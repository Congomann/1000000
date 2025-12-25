import React from 'react';
import { useData } from '../../context/DataContext';
import { Navbar } from '../../components/Navbar';
import { FileText, Shield, User } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { UserRole } from '../../types';

export const ClientPortal: React.FC = () => {
  const { user, clients } = useData();

  if (!user || user.role !== UserRole.CLIENT) {
    return <Navigate to="/login" replace />;
  }

  // Mock: Filter policies for "this" user (in a real app, filtered by user ID)
  // Showing a subset of dummy clients for demo purposes
  const myPolicies = clients.slice(0, 2); 

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Client Portal</h1>
          <p className="text-slate-600">Welcome back, {user.name}. Manage your policies and documents.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200">
                <h3 className="text-lg font-medium leading-6 text-slate-900 flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-blue-500" />
                  Active Policies
                </h3>
              </div>
              <ul className="divide-y divide-slate-200">
                {myPolicies.map((policy) => (
                  <li key={policy.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">{policy.product}</p>
                        <p className="text-lg font-semibold text-slate-900">{policy.policyNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Annual Premium</p>
                        <p className="text-base font-medium text-slate-900">${policy.premium.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-slate-500">
                      <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">Active</span>
                      <span className="mx-2">•</span>
                      Renews: {policy.renewalDate}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center mb-4">
                <User className="h-6 w-6 text-slate-400 mr-3" />
                <h3 className="text-lg font-medium text-slate-900">Advisor Contact</h3>
              </div>
              <p className="text-sm text-slate-500 mb-4">Your dedicated advisor is available for reviews.</p>
              <div className="flex items-center space-x-3">
                <img className="h-10 w-10 rounded-full" src="https://picsum.photos/100/100?random=10" alt="" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Eleanor Sterling</p>
                  <p className="text-xs text-slate-500">Senior Partner</p>
                </div>
              </div>
              <button className="mt-4 w-full flex justify-center items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">
                <FileText className="mr-2 h-4 w-4 text-slate-400" />
                Request Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};