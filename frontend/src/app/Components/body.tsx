import React, { useState } from 'react';

interface KPIData {
  id: number;
  kpi: string;
  date: string;
  value: number;
}

interface DataTableProps {
  data: KPIData[];
  onUpdateValue: (id: number, newValue: number) => void;
}

export default function DataTable({ data, onUpdateValue }: DataTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  const handleEdit = (item: KPIData) => {
    setEditingId(item.id);
    setEditValue(item.value.toString());
  };

  const handleSave = (id: number) => {
    const newValue = parseFloat(editValue);
    if (!isNaN(newValue)) {
      onUpdateValue(id, newValue);
    }
    setEditingId(null);
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Value
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300">
                {item.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300">
                {editingId === item.id ? (
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                ) : (
                  item.value
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap border-b border-gray-300">
                {item.date === today && (
                  editingId === item.id ? (
                    <button
                      onClick={() => handleSave(item.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}