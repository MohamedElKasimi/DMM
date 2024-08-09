'use client'
import Header from "@/app/Components/header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../Components/body";
import DataChart from "../Components/chart";
import { Select, MenuItem, Button, Paper } from "@mui/material";

interface KPIData {
  id: number;
  kpi: string;
  kpi_name: string;
  date: string;
  value: number;
  target: number; // Include target field
}

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<KPIData[]>([]);
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

  useEffect(() => {
    if (!sessionStorage.getItem('token')) {
      console.log("No token found, redirecting to login");
      router.push('/login');
    } else {
      fetchKPIs();
    }
  }, []);

  const fetchKPIs = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get<KPIData[]>('http://localhost:8000/performances/performanceData/', {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      console.log(response.data)
      setData(response.data);
      if (response.data.length > 0) {
        const uniqueKPIs = Array.from(new Set(response.data.map(item => item.kpi_name)));
        setSelectedKPI(uniqueKPIs[0]);
      }
    } catch (error) {
      console.error("Error fetching KPIs:", error);
    }
  };

  const uniqueKPIs = Array.from(new Set(data.map(item => item.kpi_name)));
  const filteredData = selectedKPI ? data.filter(item => item.kpi_name === selectedKPI) : data;

  const reversedData = filteredData.slice().reverse();
  const handleUpdateValue = async (id: number, newValue: number) => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.put(`http://localhost:8000/performances/updateValue/${id}/`, 
        { value: newValue },
        {
          headers: {
            Authorization: `Token ${token}`
          }
        }
      );
      // Update the local state
      setData(prevData => prevData.map(item => 
        item.id === id ? { ...item, value: newValue } : item
      ));
    } catch (error) {
      console.error("Error updating value:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen min-w- bg-white w-full">
      <Header />
      <main className="flex-grow p-4 mt-20"> {/* Added top margin to account for fixed header */}
        <Paper elevation={3} className="max-w-7xl mx-auto p-4">
          <div className="mb-4 flex justify-between items-center">
            <Select
              value={selectedKPI || ''}
              onChange={(e) => setSelectedKPI(e.target.value as string)}
              className="w-48"
            >
              {uniqueKPIs.map((kpiName) => (
                <MenuItem key={kpiName} value={kpiName}>
                  {kpiName}
                </MenuItem>
              ))}
            </Select>
            <div>
              <Button 
                variant={viewMode === 'table' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('table')}
                className="mr-2"
              >
                Table View
              </Button>
              <Button 
                variant={viewMode === 'chart' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('chart')}
              >
                Chart View
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            {viewMode === 'table' ? (
              <DataTable data={reversedData} onUpdateValue={handleUpdateValue} />
            ) : (
              <DataChart data={filteredData} />
            )}
          </div>
        </Paper>
      </main>
    </div>
  );
}
