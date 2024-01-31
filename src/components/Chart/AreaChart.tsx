import React from "react";
import {
  AreaChart as RechartsAreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  XAxis,
} from "recharts";

interface IAreaChartProps {
  data: {
    name: string;
    score: number;
  }[];
}

const AreaChart: React.FC<IAreaChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsAreaChart
        width={200}
        height={60}
        data={data}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <XAxis dataKey="name" />
        <Tooltip />

        <Area
          type="monotone"
          dataKey="score"
          stroke="rgb(247, 148, 31)"
          fill="rgb(247, 148, 31)"
          strokeWidth={3}
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChart;
