
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Lead, LeadStatus, UserRole, ProductType } from '../../types';
import { Sparkles, Loader2, Filter, Search, X, Eye, ChevronDown, Edit2, Save, Globe, CheckSquare, Square, Trash, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DetailRowProps {
  label: string;
  value: any;
  isEditing: boolean;
  onChange: (val: any) => void;
  type?: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, isEditing, onChange, type = "text" }) => {
    if (!isEditing) {
        return (
            <div className="mb-4">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</span>
                <span className="text-slate-900 font-medium text-base">{value || <span className="text-slate-300 italic">Not provided</span>}</span>
            </div>
        );
    }
    return (
        <div className="mb-4">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{label}</label>
            <input 
                type={type}
                className="w-full bg-white text-slate-900 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-[#0A62A7] focus:border-transparent outline-none"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export const Leads: React.FC = () => {
  const { leads, updateLeadStatus, updateLead, user } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [viewLead, setViewLead] = useState<Lead | null>(null); 
  const [isEditing, setIsEditing] = useState(false);
  const [editedLeadData, setEditedLeadData] = useState<Partial<Lead>>({});
  
  // Bulk Actions State
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [showBulkSuccess, setShowBulkSuccess] = useState(false);

  const isAdvisor = user?.role === UserRole.ADVISOR;

  // Derive unique sources
  const uniqueSources = useMemo(() => {
    const sources = new Set<string>();
    leads.forEach(l => { if (l.source) sources.add(l.source); });
    return Array.from(sources).sort();
  }, [leads]);

  const filteredLeads = useMemo(() => {
    let list = [...leads];
    if (isAdvisor && user) {
        list = list.filter(l => l.assignedTo === user.id || !l.assignedTo);
    }
    if (statusFilter !== 'All') list = list.filter(l => l.status === statusFilter);
    if (sourceFilter !== 'All') list = list.filter(l => l.source === sourceFilter);
    if (searchTerm) {
        const q = searchTerm.toLowerCase();
        list = list.filter(l => 
            l.name.toLowerCase().includes(q) || 
            l.email.toLowerCase().includes(q) ||
            l.interest.toLowerCase().includes(q)
        );
    }
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [leads, user, isAdvisor, statusFilter, sourceFilter, searchTerm]);

  const toggleSelectAll = () => {
    if (selectedLeadIds.size === filteredLeads.length) {
      setSelectedLeadIds(new Set());
    } else {
      setSelectedLeadIds(new Set(filteredLeads.map(l => l.id)));
    }
  };

  const toggleSelectLead = (id: string) => {
    const next = new Set(selectedLeadIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedLeadIds(next);
  };

  const handleBulkStatusUpdate = (newStatus: LeadStatus) => {
    selectedLeadIds.forEach(id => {
      updateLeadStatus(id, newStatus);
    });
    setSelectedLeadIds(new Set());
    setShowBulkSuccess(true);
    setTimeout(() => setShowBulkSuccess(false), 3000);
  };

  const handleOpenView = (lead: Lead) => {
      setViewLead(lead);
      setEditedLeadData({...lead});
      setIsEditing(false);
  };

  const handleSaveChanges = () => {
      if (viewLead && editedLeadData) {
          updateLead(viewLead.id, editedLeadData);
          setViewLead(prev => prev ? ({...prev, ...editedLeadData} as Lead) : null);
          setIsEditing(false);
      }
  };

  const statusColors: any = {
    [LeadStatus.NEW]: 'bg-blue-100 text-blue-800',
    [LeadStatus.CONTACTED]: 'bg-yellow-100 text-yellow-800',