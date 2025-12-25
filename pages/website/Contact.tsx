
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ProductType } from '../../types';

export const Contact: React.FC = () => {
  const { addLead } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: ProductType.LIFE,
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLead(formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center border border-slate-100">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h2>
          <p className="text-slate-600">Your inquiry has been securely transmitted to our advisor team. We will be in touch shortly.</p>
          <button onClick={() => setSubmitted(false)} className="mt-6 text-blue-600 hover:text-blue-800 font-medium">Send another message</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-16 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-24">
      <div className="relative max-w-xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Contact Us</h2>
          <p className="mt-4 text-lg text-slate-500">
            Let us know how we can help you secure your future.
          </p>
        </div>
        <div className="mt-12">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-slate-300 rounded-md border bg-white text-slate-900"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
            
            <div className="sm:col-span-1">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-slate-300 rounded-md border bg-white text-slate-900"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone</label>
              <div className="mt-1">
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-slate-300 rounded-md border bg-white text-slate-900"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="interest" className="block text-sm font-medium text-slate-700">Interested In</label>
              <div className="mt-1">
                <select
                  id="interest"
                  name="interest"
                  className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-slate-300 rounded-md border bg-white text-slate-900"
                  value={formData.interest}
                  onChange={e => setFormData({...formData, interest: e.target.value as ProductType})}
                >
                  {Object.values(ProductType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="message" className="block text-sm font-medium text-slate-700">Message</label>
              <div className="mt-1">
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border border-slate-300 rounded-md bg-white text-slate-900"
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                />
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit Inquiry
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
