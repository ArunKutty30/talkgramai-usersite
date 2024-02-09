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
        <defs>
          <linearGradient id="score" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="rgb(247, 148, 31)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="rgb(247, 148, 31)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" tick={false} />
        <Tooltip position={{ x: 0, y: -75 }} />

        <Area
          type="monotone"
          dataKey="score"
          stroke="rgb(247, 148, 31)"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#score)"
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChart;
