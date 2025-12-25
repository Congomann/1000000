
import React from 'react';
import { useAccounting } from '../../../context/AccountingContext';
import { useData } from '../../../context/DataContext';
import { Landmark, AlertTriangle, CheckCircle, TrendingUp, DollarSign, Settings } from 'lucide-react';

export const TaxCenter: React.FC = () => {
  const { calculateEstimatedTax, updateTaxConfig, taxConfig } = useAccounting();
  const { user } = useData();

  if (!user) return null;

  const { taxableIncome, estimatedTax, savingsRate } = calculateEstimatedTax(user.id);
  
  // Mock "Saved so far" - in a real app, this would be a balance in a specific sub-account
  const savedAmount = estimatedTax * 0.85; 
  const shortfall = estimatedTax - savedAmount;

  return (
    <div className="space-y-8 pb-10">
        <div>
            <h1 className="text-2xl font-bold text-[#0B2240]">Tax Savings Center</h1>
            <p className="text-slate-500">Automated 1099 tax estimation and allocation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0B2240] text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-blue-200 font-bold text-xs uppercase tracking-widest mb-1">Estimated Tax YTD</p>
                    <p className="text-4xl font-black tracking-tight">${estimatedTax.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                    <div className="mt-6 flex items-center gap-2 text-sm font-medium bg-white/10 px-3 py-1.5 rounded-lg w-fit">
                        <TrendingUp className="h-4 w-4 text-green-400" />
                        <span>Based on {(savingsRate * 100).toFixed(0)}% Rate</span>
                    </div>
                </div>
                <div className="absolute -right-6 -bottom-6 text-white/5 rotate-12">
                    <Landmark className="h-40 w-40" />
                </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between">
                <div>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Taxable Income (Net)</p>
                    <p className="text-3xl font-black text-slate-900">${taxableIncome.toLocaleString()}</p>
                </div>
                <div className="mt-4">
                    <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <p className="text-xs text-slate-500">Income minus deductible expenses</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between">
                <div>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Set Aside Savings</p>
                    <p className={`text-3xl font-black ${shortfall > 0 ? 'text-orange-500' : 'text-green-500'}`}>
                        ${savedAmount.toLocaleString()}
                    </p>
                </div>
                {shortfall > 0 ? (
                    <div className="flex items-center gap-2 text-orange-600 text-xs font-bold bg-orange-50 px-3 py-2 rounded-xl mt-4">
                        <AlertTriangle className="h-4 w-4" />
                        <span>${shortfall.toLocaleString(undefined, {maximumFractionDigits:0})} shortfall suggested</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-green-600 text-xs font-bold bg-green-50 px-3 py-2 rounded-xl mt-4">
                        <CheckCircle className="h-4 w-4" />
                        <span>On Track</span>
                    </div>
                )}
            </div>
        </div>

        {/* Configuration */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <Settings className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Configuration</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Effective Tax Rate (%)</label>
                    <div className="flex items-center gap-4">
                        <input 
                            type="range" 
                            min="10" 
                            max="40" 
                            step="1"
                            className="w-full accent-blue-600"
                            value={taxConfig.rate * 100}
                            onChange={(e) => updateTaxConfig({ rate: parseInt(e.target.value) / 100 })}
                        />
                        <span className="font-black text-xl text-blue-900 w-16 text-right">{(taxConfig.rate * 100).toFixed(0)}%</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Adjust based on your state ({taxConfig.state}) and filing status.</p>
                </div>
                
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">State Jurisdiction</label>
                    <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={taxConfig.state}
                        onChange={(e) => updateTaxConfig({ state: e.target.value })}
                    >
                        <option value="Federal">Federal Only</option>
                        <option value="CA">California</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas (No State Tax)</option>
                        <option value="FL">Florida (No State Tax)</option>
                        <option value="PA">Pennsylvania</option>
                    </select>
                </div>
            </div>
        </div>
        
        {/* Mock Estimated Payments Table */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Quarterly Estimates</h3>
            </div>
            <div className="divide-y divide-slate-100">
                <div className="p-5 flex justify-between items-center">
                    <div>
                        <p className="font-bold text-slate-700">Q1 (Apr 15)</p>
                        <p className="text-xs text-slate-400">Jan 1 - Mar 31</p>
                    </div>
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-bold">Paid</span>
                </div>
                <div className="p-5 flex justify-between items-center">
                    <div>
                        <p className="font-bold text-slate-700">Q2 (Jun 15)</p>
                        <p className="text-xs text-slate-400">Apr 1 - May 31</p>
                    </div>
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-bold">Paid</span>
                </div>
                <div className="p-5 flex justify-between items-center bg-blue-50/30">
                    <div>
                        <p className="font-bold text-slate-900">Q3 (Sep 15)</p>
                        <p className="text-xs text-slate-500">Jun 1 - Aug 31</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-slate-900">${(estimatedTax / 4).toLocaleString()}</p>
                        <p className="text-xs text-orange-500 font-bold">Due Soon</p>
                    </div>
                </div>
                <div className="p-5 flex justify-between items-center opacity-50">
                    <div>
                        <p className="font-bold text-slate-700">Q4 (Jan 15)</p>
                        <p className="text-xs text-slate-400">Sep 1 - Dec 31</p>
                    </div>
                    <span className="px-4 py-2 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">Upcoming</span>
                </div>
            </div>
        </div>
    </div>
  );
};
