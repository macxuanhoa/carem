"use client";

import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GrowthChartProps {
  data: {
    name: string;
    revenue: number;
    profit: number;
  }[];
}

export default function GrowthChart({ data }: GrowthChartProps) {
  return (
    <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" className="dark:stroke-slate-800"/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} dy={10}/>
                <Tooltip 
                    cursor={{fill: '#f9fafb'}}
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}}
                    labelStyle={{color: '#6b7280', fontSize: '12px', marginBottom: '4px'}}
                    formatter={(value: any) => new Intl.NumberFormat('vi-VN').format(value)}
                />
                <Bar dataKey="revenue" name="Doanh Thu" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="profit" name="Lợi Nhuận" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
}
