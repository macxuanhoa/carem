'use client';

import { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import ROIChart from '@/components/ROIChart';
import CashFlowChart from '@/components/CashFlowChart';
import ExcelExport from '@/components/ExcelExport';
import { TrendingUp, DollarSign, Clock, AlertTriangle, ArrowUpRight, ArrowDownRight, Filter, Wallet } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function ReportPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports/analytics')
      .then(res => res.json())
      .then(data => {
          setData(data);
          setLoading(false);
      })
      .catch(err => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-gray-400 font-medium text-sm">Đang phân tích dữ liệu...</div>
        </div>
    </div>
  );
  
  if (!data) return <div className="p-10 text-center text-red-500">Lỗi tải dữ liệu</div>;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-24 font-sans">
      {/* 1. Header */}
      <div className="bg-white dark:bg-gray-900 sticky top-0 z-30 px-6 py-4 shadow-sm border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
         <h1 className="font-bold text-xl text-gray-800 dark:text-white">Báo Cáo</h1>
         <div className="flex gap-2">
            <ExcelExport data={data.exportData} />
            <button className="bg-gray-50 dark:bg-gray-800 p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Filter size={20} />
            </button>
         </div>
      </div>

      <div className="p-4 space-y-6">
          {/* Hero Stats */}
          <div className="bg-black dark:bg-black text-white p-6 rounded-3xl shadow-xl shadow-gray-200 dark:shadow-none relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -ml-10 -mb-10"></div>

                <div className="relative z-10">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Lợi Nhuận Ròng</p>
                    <div className="flex items-baseline">
                        <h2 className="text-4xl font-bold tracking-tight">{data.financial.totalProfit.toLocaleString()}</h2>
                        <span className="text-sm font-normal text-gray-500 ml-1">đ</span>
                    </div>
                    
                    <div className="flex items-center mt-3 space-x-2">
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-lg text-xs font-bold flex items-center border border-green-500/20">
                            <TrendingUp size={12} className="mr-1"/> +{data.financial.margin.toFixed(1)}% biên lãi
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                        <div>
                             <p className="text-gray-400 text-[10px] uppercase font-bold mb-1">Doanh Thu</p>
                             <p className="font-bold text-lg">{data.financial.totalRevenue.toLocaleString()}</p>
                        </div>
                         <div>
                             <p className="text-gray-400 text-[10px] uppercase font-bold mb-1">Chi Phí</p>
                             <p className="font-bold text-lg text-orange-400">{data.financial.totalCost.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
          </div>

        {/* 2. Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ROI Chart */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-800 dark:text-white text-sm uppercase">Tỷ Suất Lợi Nhuận (ROI)</h3>
                 </div>
                 <ROIChart data={data.roiData} />
            </div>

            {/* Cash Flow Chart */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-800 dark:text-white text-sm uppercase flex items-center">
                        <Wallet size={18} className="mr-2 text-blue-500"/> Phân Bổ Dòng Tiền
                    </h3>
                 </div>
                 <CashFlowChart data={data.cashFlow} />
            </div>
        </div>

        {/* Growth Chart */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800 dark:text-white text-sm uppercase">Biểu đồ tăng trưởng</h3>
             </div>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.chartData} barSize={32}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" className="dark:stroke-gray-800"/>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} dy={10}/>
                        <Tooltip 
                            cursor={{fill: '#f9fafb'}}
                            contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}}
                            labelStyle={{color: '#6b7280', fontSize: '12px', marginBottom: '4px'}}
                        />
                        <Bar dataKey="revenue" name="Doanh Thu" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="profit" name="Lợi Nhuận" fill="#10b981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
             </div>
        </div>

        {/* 3. Top Performers & Inventory Risk Grid */}
        <div className="grid grid-cols-1 gap-6">
            
            {/* Top Profit Cars */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-5 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center text-sm uppercase">
                        <TrendingUp size={18} className="mr-2 text-green-500"/> Top Lợi Nhuận
                    </h3>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                    {data.topProfitCars.map((car: any, idx: number) => (
                        <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center font-bold text-xs mr-3 border border-green-100 dark:border-green-900/30">
                                    {idx + 1}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-white text-sm line-clamp-1">{car.dongXe}</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">{car.bienSo}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-green-600 dark:text-green-400 text-sm">+{car.profit.toLocaleString()}</p>
                                <p className="text-[10px] text-gray-400">DT: {car.revenue.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Inventory Risk */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-5 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 dark:text-white flex items-center text-sm uppercase">
                        <AlertTriangle size={18} className="mr-2 text-orange-500"/> Tồn Kho Lâu
                    </h3>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                    {data.inventoryAging.map((car: any, idx: number) => (
                        <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                             <div className="flex items-center">
                                <div className={`w-2 h-2 rounded-full mr-3 ${car.daysInStock > 60 ? 'bg-red-500 shadow-red-200 shadow-sm' : 'bg-orange-400'}`}></div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-white text-sm line-clamp-1">{car.dongXe}</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">{car.bienSo}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold text-sm ${car.daysInStock > 60 ? 'text-red-600 dark:text-red-400' : 'text-orange-500 dark:text-orange-400'}`}>
                                    {car.daysInStock} ngày
                                </p>
                                <p className="text-[10px] text-gray-400">Vốn: {car.tongGiaMua.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                    {data.inventoryAging.length === 0 && (
                        <div className="p-8 text-center text-gray-400 text-sm">Kho hàng luân chuyển tốt.</div>
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
