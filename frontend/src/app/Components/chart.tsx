import React from 'react';
import { BarChart, LineChart, ChartsReferenceLine } from '@mui/x-charts';
import { Box, Paper } from '@mui/material';

interface KPIData {
  id: number;
  kpi: string;
  kpi_name: string;
  date: string;
  value: number;
  target: number;
}

interface DataChartProps {
  data: KPIData[];
}

const DataChart: React.FC<DataChartProps> = ({ data }) => {
  // Compute the cumulative sum
  const cumulativeData = data.reduce<{ date: string; cumulativeValue: number }[]>(
    (acc, item) => {
      const lastCumulativeValue = acc.length > 0 ? acc[acc.length - 1].cumulativeValue : 0;
      acc.push({
        date: item.date,
        cumulativeValue: lastCumulativeValue + item.value
      });
      return acc;
    },
    []
  );

  // Determine the target value
  const target = Math.max(...data.map(item => item.target));

  // Find the maximum value for the y-axis
  const maxYValue = Math.max(target, ...cumulativeData.map(item => item.cumulativeValue));

  return (
    <Box display="flex" gap={2}>
      {/* Bar Chart (unchanged) */}
      <Paper elevation={3}>
        <BarChart
          xAxis={[{ data: data.map(item => item.date), scaleType: 'band' }]}
          series={[{ data: data.map(item => item.value), type: 'bar', color: 'blue' }]}
          width={500}
          height={300}
        />
      </Paper>
      
      {/* Line Chart */}
      <Paper elevation={3}>
        <LineChart
          xAxis={[{ data: cumulativeData.map(item => item.date), scaleType: 'band' }]}
          yAxis={[{ min: 0, max: maxYValue }]}
          series={[
            { 
              data: cumulativeData.map(item => item.cumulativeValue), 
              type: 'line', 
              color: 'blue', 
              label: 'Cumulative Value' 
            }
          ]}
          width={500}
          height={300}
        >
          <ChartsReferenceLine
            y={target}
            label={`Target: ${target}`}
            lineStyle={{ stroke: 'red', strokeWidth: 2 }}
          />
        </LineChart>
      </Paper>
    </Box>
  );
};

export default DataChart;