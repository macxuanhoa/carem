"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CashFlowChartProps {
  data: {
    inCar: number;
    receivable: number;
    payable: number;
    cashOnHand: number;
  };
}

const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#22c55e'];

export default function CashFlowChart({ data }: CashFlowChartProps) {
  const chartData = [
    { name: 'Vốn Trong Xe', value: data.inCar },
    { name: 'Khách Nợ', value: data.receivable },
    { name: 'Nợ Phải Trả', value: data.payable },
    { name: 'Tiền Mặt/Lãi', value: data.cashOnHand },
  ].filter(item => item.value > 0);

  return (
    <div className="h-[300px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any) => [new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value || 0)), 'Giá trị']}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
      {/* Center Label */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-8">
        <p className="text-xs text-gray-500 font-bold uppercase">Tổng Vốn</p>
        <p className="text-sm font-bold text-gray-900">
            {new Intl.NumberFormat('vi-VN', { notation: "compact", compactDisplay: "short" }).format(data.inCar + data.receivable + data.cashOnHand)}
        </p>
      </div>
    </div>
  );
}
