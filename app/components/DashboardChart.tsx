'use client';
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function DashboardChart({ 
    data, 
    type = 'area' 
}: { 
    data: any[],
    type?: 'area' | 'bar'
}) {
    // 1. Simple Mini Chart (For Header)
    if (type === 'area') {
        return (
            <div className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.5}/>
                                <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="value" stroke="#ffffff" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
    }

    // 2. Full Profit/Expense Chart (Bar)
    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
                    <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: '#9CA3AF' }} 
                        dy={10}
                        tickFormatter={(val) => val.split('-').slice(1).join('/')}
                    />
                    <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: 'transparent' }}
                    />
                    <Bar 
                        dataKey="value" 
                        name="Doanh Thu" 
                        fill="#3B82F6" 
                        radius={[4, 4, 0, 0]} 
                        barSize={8}
                    />
                    <Bar 
                        dataKey="expense" 
                        name="Chi Phí" 
                        fill="#EF4444" 
                        radius={[4, 4, 0, 0]} 
                        barSize={8}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
