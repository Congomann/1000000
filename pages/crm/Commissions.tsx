
import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BadgeDollarSign, TrendingUp, Wallet, ArrowUpRight, DollarSign } from 'lucide-react';
import { ProductType, UserRole } from '../../types';

// Vibrant MacOS-style colors
const CHART_COLORS = ['#3B82F6', '#06B6D4', '#8B5CF6', '#10B981', '#F59E0B'];

export const Commissions: React.FC = () => {
  const { commissions, metrics, user } = useData();

  const filteredCommissions = useMemo(() => {
    if (user?.role === UserRole.ADVISOR && user.productsSold) {
        return commissions.filter(c => user.productsSold!.includes(c.product));
    }
    return commissions;
  }, [commissions, user]);

  const commissionsByProduct = useMemo(() => {
    const data: Record<string, number> = {};
    const relevantProducts = user?.role === UserRole.ADVISOR && user.productsSold 
        ? user.productsSold 
        : Object.values(ProductType);
    
    relevantProducts.forEach(t => data[t] = 0);

    filteredCommissions.forEach(c => {
      if (data[c.product] !== undefined) {
         data[c.product] = (data[c.product] || 0) + c.amount;
      }
    });

    return Object.entries(data)
      .filter(([_, val]) => val > 0)
      .map(([name, value]) => ({ name, value }));
  }, [filteredCommissions, user]);

  const recentCommissions = [...filteredCommissions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculate Average Commission Rate based on actual data
  const avgCommissionRate = filteredCommissions.length > 0
    ? (filteredCommissions.reduce((acc, c) => acc + c.rate, 0) / filteredCommissions.length) * 100
    : 0;

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Commissions & Earnings</h1>
        <p className="text-slate-500 font-medium mt-1">Track your written business and commission payouts.</p>
      </div>

      {/* Top Cards - MacOS Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Total Commission (Green Gradient) */}
        <div className="bg-[#10B981] p-8 rounded-[2.5rem] shadow-xl shadow-emerald-500/20 text-white relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
           <div className="absolute -right-6 -top-6 p-8 opacity-10 transform group-hover:rotate-12 transition-transform duration-500">
               <Wallet className="h-32 w-32 text-white" />
           </div>
           <div className="relative z-10 flex flex-col h-full justify-between">
               <div className="flex items-center justify-between mb-2">
                  <p className="text-emerald-100 font-bold text-xs uppercase tracking-widest">Total Commission Earned</p>
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                    <Wallet className="h-5 w-5 text-white" />
                  </div>
               </div>
               <div>
                   <p className="text-4xl font-black tracking-tight mb-3">${metrics.totalCommission.toLocaleString()}</p>
                   <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md">
                      <TrendingUp className="h-3 w-3" />
                      +12% from last month
                   </div>
               </div>
           </div>
        </div>

        {/* Card 2: Avg Rate (White Glass) */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-50 group-hover:opacity-100"></div>
           
           <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Avg. Commission Rate</p>
                  <p className="text-4xl font-black text-slate-900">{avgCommissionRate.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform shadow-sm">
                  <TrendingUp className="h-6 w-6" />
              </div>
           </div>
           <p className="text-sm text-slate-500 font-medium relative z-10">Across all products</p>
        </div>

         {/* Card 3: Written Premium (White Glass) */}
         <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-50 group-hover:opacity-100"></div>

           <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Written Premium</p>
                  <p className="text-4xl font-black text-slate-900">${metrics.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform shadow-sm">
                  <BadgeDollarSign className="h-6 w-6" />
              </div>
           </div>
           <p className="text-sm text-slate-500 font-medium relative z-10">Total policy value</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Breakdown Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 h-[28rem] flex flex-col hover:shadow-md transition-shadow duration-300">
           <h3 className="text-lg font-bold text-slate-900 mb-6">Earnings by Product</h3>
           <div className="flex-1 w-full min-w-0" style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={commissionsByProduct} margin={{ left: -20, right: 0, bottom: 0, top: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} 
                    dy={10}
                    interval={0}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} 
                    tickFormatter={(val) => `$${val/1000}k`} 
                />
                <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)', padding: '12px', fontWeight: 'bold'}}
                    formatter={(val: number) => [`$${val.toLocaleString()}`, 'Commission']}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {commissionsByProduct.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
           </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 h-[28rem] flex flex-col hover:shadow-md transition-shadow duration-300">
           <h3 className="text-lg font-bold text-slate-900 mb-6">Portfolio Mix</h3>
           <div className="flex-1 w-full relative min-w-0" style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={commissionsByProduct}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={6}
                >
                  {commissionsByProduct.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)', padding: '12px', fontWeight: 'bold'}}
                    formatter={(val: number) => `$${val.toLocaleString()}`} 
                />
                <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-slate-600 font-bold text-xs ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                <div className="text-center">
                    <p className="text-3xl font-black text-slate-900">{commissionsByProduct.length}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Categories</p>
                </div>
            </div>
           </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900">Transaction History</h3>
          <button className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-2 rounded-xl transition-colors">Export CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Client</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Product</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Premium</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Rate</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Commission</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {recentCommissions.map((comm) => (
                <tr key={comm.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-5 whitespace-nowrap text-sm font-bold text-slate-900">{comm.clientName}</td>
                  <td className="px-8 py-5 whitespace-nowrap">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">{comm.product}</span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-slate-500">${comm.premium.toLocaleString()}</td>
                  <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-slate-500">{(comm.rate * 100).toFixed(1)}%</td>
                  <td className="px-8 py-5 whitespace-nowrap">
                      <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                          <ArrowUpRight className="h-3 w-3" />
                          ${comm.amount.toLocaleString()}
                      </span>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-sm font-medium text-slate-400">{new Date(comm.date).toLocaleDateString()}</td>
                </tr>
              ))}
              {recentCommissions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-slate-400 font-medium">
                    No commission data found for your specific products.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
