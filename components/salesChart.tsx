// components/SalesChart.tsx
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const SalesChart = () => {
  // Sample data for the chart
  const data = [
    { name: 'Jan', sold: 2, unsold: 5 },
    { name: 'Feb', sold: 3, unsold: 4 },
    { name: 'Mar', sold: 1, unsold: 6 },
    { name: 'Apr', sold: 4, unsold: 3 },
    { name: 'May', sold: 3, unsold: 4 },
    { name: 'Jun', sold: 5, unsold: 2 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sold" stackId="a" fill="#10B981" name="Sold Properties" />
        <Bar dataKey="unsold" stackId="a" fill="#F59E0B" name="Unsold Properties" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;