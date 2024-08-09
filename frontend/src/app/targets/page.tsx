'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Header from "@/app/Components/header";
import axios from "axios";
import { Select, MenuItem, Button, Paper, TextField, SelectChangeEvent } from "@mui/material";

interface KPI {
  id: number;
  name: string;
  department: string;
}

interface KPITarget {
  id: number;
  kpi: number;
  target_value: number;
  month: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/getKPIs';

export default function TargetSetting() {
  const router = useRouter();
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [selectedKPI, setSelectedKPI] = useState<number | null>(null);
  const [targets, setTargets] = useState<KPITarget[]>([]);

  useEffect(() => {
    if (!sessionStorage.getItem('token')) {
      console.log("No token found, redirecting to login");
      router.push('/login');
    } else {
      fetchKPIs();
    }
  }, []);

  const getAuthHeaders = () => ({
    Authorization: `Token ${sessionStorage.getItem('token')}`
  });

  const fetchKPIs = async () => {
    try {
      const response = await axios.get<KPI[]>(`${API_BASE_URL}/kpis/`, {
        headers: getAuthHeaders()
      });
      setKpis(response.data);
      if (response.data.length > 0) {
        setSelectedKPI(response.data[0].id);
        fetchTargets(response.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching KPIs:", error);
    }
  };

  const fetchTargets = async (kpiId: number) => {
    try {
      const response = await axios.get<KPITarget[]>(`${API_BASE_URL}/kpis/${kpiId}/targets/`, {
        headers: getAuthHeaders()
      });
      setTargets(response.data);
    } catch (error) {
      console.error("Error fetching targets:", error);
    }
  };

  const handleKPIChange = (event: SelectChangeEvent<number>) => {
    const kpiId = event.target.value as number;
    setSelectedKPI(kpiId);
    fetchTargets(kpiId);
  };

  const handleTargetChange = (month: string, newValue: string) => {
    setTargets(prevTargets => 
      prevTargets.map(target => 
        target.month === month ? { ...target, target_value: parseFloat(newValue) || 0 } : target
      )
    );
  };

  const handleSaveTargets = async () => {
    if (!selectedKPI) {
      alert("Please select a KPI first.");
      return;
    }
    
    try {
      await axios.put(
        `${API_BASE_URL}/kpis/${selectedKPI}/update_targets/`,
        { targets },
        { headers: getAuthHeaders() }
      );
      alert("Targets updated successfully!");
    } catch (error) {
      console.error("Error updating targets:", error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`Failed to update targets: ${error.response.data.detail || 'Unknown error'}`);
      } else {
        alert("Failed to update targets. Please check your connection and try again.");
      }
    }
  };

  const currentYear = new Date().getFullYear();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white w-full">
      <Header />
      <main className="flex-grow p-4 mt-20">
        <Paper elevation={3} className="max-w-7xl mx-auto p-4">
          <div className="mb-4">
            <Select
              value={selectedKPI || ''}
              onChange={handleKPIChange}
              className="w-full mb-4"
            >
              {kpis.map((kpi) => (
                <MenuItem key={kpi.id} value={kpi.id}>
                  {kpi.name} - {kpi.department}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                    Target Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {months.map((month, index) => {
                  const monthDate = `${currentYear}-${String(index + 1).padStart(2, '0')}-01`;
                  const target = targets.find(t => t.month === monthDate) || { target_value: 0 };
                  return (
                    <tr key={month}>
                      <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300">
                        {month} {currentYear}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300">
                        <TextField
                          type="number"
                          value={target.target_value}
                          onChange={(e) => handleTargetChange(monthDate, e.target.value)}
                          className="w-full"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveTargets}
            >
              Save Targets
            </Button>
          </div>
        </Paper>
      </main>
    </div>
  );
}