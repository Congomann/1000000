import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ProductListing } from '../../types';
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X, Image as ImageIcon } from 'lucide-react';

export const ProductCms: React.FC = () => {
  const { companySettings, updateCompanySettings } = useData();
  const [products, setProducts] = useState<ProductListing[]>(companySettings.customProducts || []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProductListing>>({});
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    updateCompanySettings({ ...companySettings, customProducts: products });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleEdit = (product: ProductListing) => {
    setEditingId(product.id);
    setEditForm(product);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = () => {
    if (editForm.id) {
      setProducts(prev => prev.map(p => p.id === editForm.id ? { ...p, ...editForm } as ProductListing : p));
    } else {
      const newProduct: ProductListing = {
        ...editForm,
        id: `prod-${Math.random().toString(36).substr(2, 9)}`,
        order: products.length,
        isHidden: false,
      } as ProductListing;
      setProducts(prev => [...prev, newProduct]);
    }
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product listing?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const toggleVisibility = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isHidden: !p.isHidden } : p));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...(editForm.features || [])];
    newFeatures[index] = value;
    setEditForm({ ...editForm, features: newFeatures });
  };

  const addFeature = () => {
    setEditForm({ ...editForm, features: [...(editForm.features || []), ''] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...(editForm.features || [])];
    newFeatures.splice(index, 1);
    setEditForm({ ...editForm, features: newFeatures });
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0B2240]">Product Listings CMS</h1>
          <p className="text-slate-500">Manage the products displayed on the Home and Services pages.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditingId('new');
              setEditForm({ title: '', description: '', features: [], image: '', icon: 'ShieldCheck', color: 'blue', link: '', isHidden: false });
            }}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Product
          </button>
          <button
            onClick={handleSave}
            className="bg-[#0A62A7] text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <Save className="h-4 w-4" /> {isSaved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className={`bg-white rounded-[2rem] shadow-sm border ${product.isHidden ? 'border-dashed border-slate-300 opacity-75' : 'border-slate-100'} overflow-hidden flex flex-col`}>
            {editingId === product.id ? (
              <div className="p-6 flex-1 flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold"
                  value={editForm.title || ''}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                />
                <textarea
                  placeholder="Description"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
                  rows={3}
                  value={editForm.description || ''}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
                  value={editForm.image || ''}
                  onChange={e => setEditForm({ ...editForm, image: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Link (e.g., /products?category=life-insurance)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
                  value={editForm.link || ''}
                  onChange={e => setEditForm({ ...editForm, link: e.target.value })}
                />
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Features</label>
                  {(editForm.features || []).map((feature, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm"
                        value={feature}
                        onChange={e => handleFeatureChange(idx, e.target.value)}
                      />
                      <button onClick={() => removeFeature(idx)} className="text-red-500 hover:text-red-700"><X className="h-4 w-4" /></button>
                    </div>
                  ))}
                  <button onClick={addFeature} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"><Plus className="h-3 w-3" /> Add Feature</button>
                </div>
                <div className="flex gap-2 mt-auto pt-4">
                  <button onClick={handleSaveEdit} className="flex-1 bg-blue-600 text-white rounded-xl py-2 text-sm font-bold hover:bg-blue-700">Save</button>
                  <button onClick={handleCancelEdit} className="flex-1 bg-slate-200 text-slate-700 rounded-xl py-2 text-sm font-bold hover:bg-slate-300">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="h-40 relative">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => toggleVisibility(product.id)} className="p-2 bg-white/90 rounded-full shadow-sm hover:bg-white text-slate-700">
                      {product.isHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button onClick={() => handleEdit(product)} className="p-2 bg-white/90 rounded-full shadow-sm hover:bg-white text-blue-600">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 bg-white/90 rounded-full shadow-sm hover:bg-white text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{product.title}</h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{product.description}</p>
                  <div className="mt-auto">
                    <span className="text-xs font-bold text-slate-400 uppercase">Link:</span>
                    <p className="text-xs text-blue-600 truncate">{product.link}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}

        {editingId === 'new' && (
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col p-6 gap-4">
            <input
              type="text"
              placeholder="Title"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold"
              value={editForm.title || ''}
              onChange={e => setEditForm({ ...editForm, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
              rows={3}
              value={editForm.description || ''}
              onChange={e => setEditForm({ ...editForm, description: e.target.value })}
            />
            <input
              type="text"
              placeholder="Image URL"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
              value={editForm.image || ''}
              onChange={e => setEditForm({ ...editForm, image: e.target.value })}
            />
            <input
              type="text"
              placeholder="Link (e.g., /products?category=life-insurance)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm"
              value={editForm.link || ''}
              onChange={e => setEditForm({ ...editForm, link: e.target.value })}
            />
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Features</label>
              {(editForm.features || []).map((feature, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm"
                    value={feature}
                    onChange={e => handleFeatureChange(idx, e.target.value)}
                  />
                  <button onClick={() => removeFeature(idx)} className="text-red-500 hover:text-red-700"><X className="h-4 w-4" /></button>
                </div>
              ))}
              <button onClick={addFeature} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"><Plus className="h-3 w-3" /> Add Feature</button>
            </div>
            <div className="flex gap-2 mt-auto pt-4">
              <button onClick={handleSaveEdit} className="flex-1 bg-blue-600 text-white rounded-xl py-2 text-sm font-bold hover:bg-blue-700">Save</button>
              <button onClick={handleCancelEdit} className="flex-1 bg-slate-200 text-slate-700 rounded-xl py-2 text-sm font-bold hover:bg-slate-300">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
