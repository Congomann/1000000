
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  AlertCircle, 
  Video, 
  RefreshCw, 
  Coffee, 
  GripVertical, 
  ArrowLeft, 
  Check, 
  Save,
  Lock
} from 'lucide-react';
import { CalendarEvent } from '../../types';

export const Calendar: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent, isGoogleConnected, toggleGoogleSync, user } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);
  const [dropTargetDate, setDropTargetDate] = useState<string | null>(null);
  
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Filter events based on new Visibility Rules:
  // - Off Day: Show across all CRM along with their name
  // - Meeting: Viewable public inside the CRM
  // - Reminder & Task: Private to the advisor who created them
  const visibleEvents = useMemo(() => {
    return events.filter(e => {
        if (e.type === 'off-day' || e.type === 'meeting') return true;
        return e.creatorId === user?.id;
    });
  }, [events, user]);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    date: string;
    endDate: string;
    time: string;
    type: 'meeting' | 'reminder' | 'task' | 'off-day';
    description?: string;
    hasGoogleMeet: boolean;
  }>({
    title: '',
    date: todayStr,
    endDate: todayStr,
    time: '09:00',
    type: 'meeting',
    description: '',
    hasGoogleMeet: false
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);

  // Permission Check: Only the creator can change or update
  const editingEvent = events.find(e => e.id === editingId);
  const isReadOnly = editingId ? editingEvent?.creatorId !== user?.id : false;

  const today = new Date();

  // Calendar Logic
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
    setCurrentDate(new Date(newDate));
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const formatTimeForInput = (timeStr: string) => {
    try {
        if (timeStr === 'All Day') return '09:00';
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12' && modifier === 'AM') {
            hours = '00';
        } else if (modifier === 'PM' && hours !== '12') {
            hours = (parseInt(hours, 10) + 12).toString();
        }
        return `${hours.padStart(2, '0')}:${minutes}`;
    } catch (e) {
        return timeStr; 
    }
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
        title: '',
        date: todayStr,
        endDate: todayStr,
        time: '09:00',
        type: 'meeting',
        description: '',
        hasGoogleMeet: false
    });
    setIsModalOpen(true);
  };

  const handleDateClick = (dateStr: string) => {
    if (dateStr < todayStr) return;
    
    setEditingId(null);
    setFormData({
        title: '',
        date: dateStr,
        endDate: dateStr,
        time: '09:00',
        type: 'meeting',
        description: '',
        hasGoogleMeet: false
    });
    setIsModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setEditingId(event.id);
    setFormData({
        title: event.title,
        date: event.date,
        endDate: event.date,
        time: formatTimeForInput(event.time),
        type: event.type,
        description: event.description || '',
        hasGoogleMeet: !!event.hasGoogleMeet
    });
    setIsModalOpen(true);
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, eventId: string) => {
    const event = visibleEvents.find(ev => ev.id === eventId);
    if (event?.creatorId !== user?.id) {
        e.preventDefault();
        return;
    }
    setDraggedEventId(eventId);
    e.dataTransfer.setData('eventId', eventId);
    e.dataTransfer.effectAllowed = 'move';
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '0.4';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '1';
    setDraggedEventId(null);
    setDropTargetDate(null);
  };

  const handleDragOver = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    if (dateStr < todayStr) return;
    setDropTargetDate(dateStr);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    if (dateStr < todayStr) {
        setDraggedEventId(null);
        setDropTargetDate(null);
        return;
    }

    const eventId = e.dataTransfer.getData('eventId');
    const eventToMove = visibleEvents.find(ev => ev.id === eventId);
    
    if (eventToMove && eventToMove.date !== dateStr && eventToMove.creatorId === user?.id) {
        updateEvent({
            ...eventToMove,
            date: dateStr
        });
    }
    
    setDraggedEventId(null);
    setDropTargetDate(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isReadOnly) return;

    if (formData.date < todayStr) {
        alert("Please select a current or future date.");
        return;
    }

    const [hours, minutes] = formData.time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    const formattedTime = formData.type === 'off-day' ? 'All Day' : `${hour12}:${minutes} ${ampm}`;

    // Multi-date support for Off Day or multi-day events
    if (!editingId && formData.endDate > formData.date) {
        const start = new Date(formData.date);
        const end = new Date(formData.endDate);
        const tempDate = new Date(start);

        while (tempDate <= end) {
            const dateStr = tempDate.toISOString().split('T')[0];
            addEvent({
                title: formData.title,
                date: dateStr,
                time: formattedTime,
                type: formData.type,
                description: formData.description,
                hasGoogleMeet: formData.hasGoogleMeet
            });
            tempDate.setDate(tempDate.getDate() + 1);
        }
    } else {
        if (editingId) {
            updateEvent({
                id: editingId,
                title: formData.title,
                date: formData.date,
                time: formattedTime,
                type: formData.type,
                description: formData.description,
                hasGoogleMeet: formData.hasGoogleMeet,
                creatorId: editingEvent?.creatorId,
                creatorName: editingEvent?.creatorName
            });
        } else {
            addEvent({
                title: formData.title,
                date: formData.date,
                time: formattedTime,
                type: formData.type,
                description: formData.description,
                hasGoogleMeet: formData.hasGoogleMeet
            });
        }
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (editingId && !isReadOnly) {
        if(window.confirm('Are you sure you want to delete this event?')) {
            deleteEvent(editingId);
            setIsModalOpen(false);
        }
    }
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
        if (!isGoogleConnected) toggleGoogleSync();
        setIsSyncing(false);
    }, 1500);
  };

  const getEventStyles = (type: string) => {
    switch(type) {
      case 'meeting': return 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200';
      case 'reminder': return 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200';
      case 'task': return 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200';
      case 'off-day': return 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200 opacity-75';
      default: return 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200';
    }
  };

  const getEventIcon = (type: string) => {
    switch(type) {
        case 'meeting': return <CalendarIcon className="h-3 w-3 mr-1.5" />;
        case 'reminder': return <AlertCircle className="h-3 w-3 mr-1.5" />;
        case 'task': return <CheckCircle2 className="h-3 w-3 mr-1.5" />;
        case 'off-day': return <Coffee className="h-3 w-3 mr-1.5" />;
        default: return <CalendarIcon className="h-3 w-3 mr-1.5" />;
    }
  };

  const sortedEvents = [...visibleEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const upcomingEvents = sortedEvents.filter(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0)));

  return (
    <div className="flex flex-col lg:flex-row h-full gap-8">
      {/* Left Side - Main Calendar Grid */}
      <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-10 py-8 border-b border-slate-200">
          <div className="flex items-center gap-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{formatDate(currentDate)}</h2>
            <div className="flex items-center gap-2 bg-slate-50 rounded-2xl p-2 border border-slate-100">
              <button onClick={() => changeMonth(-1)} className="p-2.5 hover:bg-white hover:shadow-md rounded-xl transition-all">
                <ChevronLeft className="h-5 w-5 text-slate-600" />
              </button>
              <button onClick={() => setCurrentDate(new Date())} className="px-6 py-2 text-xs font-bold text-slate-600 hover:bg-white hover:shadow-md rounded-xl transition-all uppercase tracking-wide">
                Today
              </button>
              <button onClick={() => changeMonth(1)} className="p-2.5 hover:bg-white hover:shadow-md rounded-xl transition-all">
                <ChevronRight className="h-5 w-5 text-slate-600" />
              </button>
            </div>
            <button 
              onClick={handleSync} 
              disabled={isSyncing}
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 ml-4 transition-colors disabled:opacity-50 uppercase tracking-widest"
              title="Sync with Google Calendar"
            >
               <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
               {isGoogleConnected ? 'Synced' : 'Sync'}
            </button>
          </div>
          <button 
            onClick={handleOpenCreateModal}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-sm font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Event
          </button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/50">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
            <div key={day} className="py-5 text-center text-xs font-bold text-slate-400 tracking-widest">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 grid grid-cols-7 grid-rows-5 overflow-y-auto">
          {Array.from({ length: getFirstDayOfMonth(currentDate) }).map((_, i) => (
            <div key={`empty-${i}`} className="border-r border-b border-slate-100 bg-slate-50/30" />
          ))}

          {Array.from({ length: getDaysInMonth(currentDate) }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = visibleEvents.filter(e => e.date === dateStr);
            const isSelected = isToday(day);
            const isOver = dropTargetDate === dateStr;
            const isPast = dateStr < todayStr;

            return (
              <div 
                key={day} 
                onClick={() => handleDateClick(dateStr)}
                onDragOver={(e) => handleDragOver(e, dateStr)}
                onDrop={(e) => handleDrop(e, dateStr)}
                onDragLeave={() => setDropTargetDate(null)}
                className={`relative border-r border-b border-slate-100 p-4 min-h-[120px] transition-all duration-200 group 
                    ${isSelected ? 'bg-blue-50/40' : 'bg-white'} 
                    ${isOver ? 'bg-blue-50/80 ring-2 ring-inset ring-blue-300 z-10' : 'hover:bg-slate-50'}
                    ${isPast ? 'opacity-60 cursor-default' : 'cursor-pointer'}
                `}
              >
                <span 
                  className={`
                    inline-flex items-center justify-center w-9 h-9 text-sm font-bold rounded-full mb-3 transition-colors
                    ${isSelected ? 'bg-blue-600 text-white shadow-lg' : isPast ? 'text-slate-300' : 'text-slate-700 group-hover:bg-slate-200'}
                  `}
                >
                  {day}
                </span>
                
                <div className="space-y-2">
                  {dayEvents.map(event => (
                    <div 
                        key={event.id} 
                        draggable={event.creatorId === user?.id && !isPast}
                        onDragStart={(e) => handleDragStart(e, event.id)}
                        onDragEnd={handleDragEnd}
                        onClick={(e) => { e.stopPropagation(); handleEventClick(event); }}
                        className={`group/event flex items-center justify-between text-[11px] leading-tight truncate px-3 py-2 rounded-xl font-bold border transition-all hover:scale-[1.02] shadow-sm ${getEventStyles(event.type)} ${isPast ? 'cursor-pointer opacity-80' : event.creatorId === user?.id ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
                        title={event.type === 'off-day' ? `${event.creatorName}: Off Day` : event.title}
                    >
                        <div className="flex items-center overflow-hidden">
                            {event.creatorId === user?.id && !isPast && <GripVertical className="h-3 w-3 mr-1 opacity-0 group-hover/event:opacity-40 transition-opacity" />}
                            {event.creatorId !== user?.id && (event.type === 'meeting' || event.type === 'off-day') && <Lock className="h-3 w-3 mr-1 opacity-40" />}
                            {getEventIcon(event.type)}
                            <span className="truncate">
                                {event.type === 'off-day' ? `${event.creatorName}: Off Day` : event.title}
                            </span>
                        </div>
                        {event.hasGoogleMeet && event.type !== 'off-day' && <Video className="h-3 w-3 flex-shrink-0 ml-1 text-blue-600" />}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Side - Upcoming Sidebar */}
      <div className="w-full lg:w-[26rem] flex-shrink-0 bg-white rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col overflow-hidden h-full">
        <div className="p-10 border-b border-slate-100 bg-slate-50">
          <h3 className="text-2xl font-bold text-slate-900">Upcoming</h3>
          <p className="text-sm text-slate-500 mt-2 font-medium">Agenda for next 7 days</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-5 no-scrollbar">
          {upcomingEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 text-slate-400">
                <CalendarIcon className="h-16 w-16 mb-4 opacity-10" />
                <p className="text-base font-medium">No upcoming events</p>
            </div>
          ) : (
            upcomingEvents.slice(0, 10).map((event) => {
              const displayDate = new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
              const isOwner = event.creatorId === user?.id;
              return (
                <div 
                    key={event.id} 
                    onClick={() => handleEventClick(event)}
                    className={`p-6 rounded-[2rem] border cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 group/item ${getEventStyles(event.type)}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h4 className="text-sm font-bold leading-tight mb-3 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            {getEventIcon(event.type)}
                            {event.type === 'off-day' ? `${event.creatorName}: Off Day` : event.title}
                        </span>
                        {!isOwner && <Lock className="h-3 h-3 opacity-30" />}
                      </h4>
                      <div className="flex items-center text-xs font-semibold opacity-80 mb-4">
                        <span className="ml-1">{displayDate}</span>
                      </div>
                      {event.type !== 'off-day' && (
                        <div className="flex items-center justify-between text-xs font-bold opacity-90">
                            <span className="flex items-center bg-white/40 px-3 py-1.5 rounded-xl"><Clock className="h-3.5 w-3.5 mr-2" /> {event.time}</span>
                            {event.hasGoogleMeet && (
                                <span className="flex items-center text-blue-700 font-black bg-white/60 px-3 py-1.5 rounded-xl shadow-sm">
                                    <Video className="h-3.5 w-3.5 mr-2" /> Meet
                                </span>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* FULL SCREEN IMMERSIVE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-y-auto no-scrollbar animate-fade-in">
          {/* Top Header - Back Action */}
          <div className="flex items-center justify-between px-10 py-8 border-b border-slate-100 bg-white sticky top-0 z-10 shadow-sm">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="flex items-center gap-3 text-slate-800 hover:text-blue-600 transition-all font-black text-sm uppercase tracking-widest group"
            >
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              Back
            </button>
            <h3 className="text-2xl font-black text-slate-800 tracking-tighter">
              {editingId ? (isReadOnly ? 'Event Details' : 'Edit Event') : 'Create New Event'}
            </h3>
            <div className="w-16" /> {/* Placeholder to center the title */}
          </div>

          <div className="flex-1 w-full max-w-4xl mx-auto px-8 py-16">
            <form onSubmit={handleSubmit} className="space-y-12">
              
              {/* Event Title */}
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase mb-4 ml-2 tracking-[0.2em]">Event Title</label>
                <input 
                  type="text" 
                  required
                  autoFocus
                  disabled={isReadOnly}
                  className="w-full bg-slate-50 border border-slate-200 rounded-[2.5rem] px-10 py-8 text-2xl font-black focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-200 shadow-inner disabled:opacity-70 disabled:cursor-not-allowed"
                  placeholder="e.g. Portfolio Strategy Review"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
                {isReadOnly && (
                    <p className="mt-4 ml-4 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Lock className="h-3 w-3" /> Created by {editingEvent?.creatorName} (Read-Only)
                    </p>
                )}
              </div>
              
              {/* Date & Time Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase mb-4 ml-2 tracking-[0.2em]">Start Date</label>
                  <input 
                    type="date" 
                    required
                    min={todayStr}
                    disabled={isReadOnly}
                    className="w-full bg-slate-50 border border-slate-200 rounded-[2.5rem] px-8 py-6 text-xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner disabled:opacity-70 disabled:cursor-not-allowed"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value, endDate: e.target.value > formData.endDate ? e.target.value : formData.endDate})}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase mb-4 ml-2 tracking-[0.2em]">End Date (Optional)</label>
                  <input 
                    type="date" 
                    min={formData.date}
                    disabled={isReadOnly}
                    className="w-full bg-slate-50 border border-slate-200 rounded-[2.5rem] px-8 py-6 text-xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner disabled:opacity-70 disabled:cursor-not-allowed"
                    value={formData.endDate}
                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>

              {/* Time Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase mb-4 ml-2 tracking-[0.2em]">Time</label>
                  <input 
                    type="time" 
                    required
                    disabled={formData.type === 'off-day' || isReadOnly}
                    className="w-full bg-slate-50 border border-slate-200 rounded-[2.5rem] px-8 py-6 text-xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-inner disabled:cursor-not-allowed"
                    value={formData.time}
                    onChange={e => setFormData({...formData, time: e.target.value})}
                  />
                </div>
              </div>

              {/* Event Type Grid - Private/Public Rules Apply */}
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase mb-8 ml-2 tracking-[0.2em]">Event Type</label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                      { id: 'meeting', icon: CalendarIcon, label: 'Meeting', color: 'green', visibility: 'Public' },
                      { id: 'reminder', icon: AlertCircle, label: 'Reminder', color: 'purple', visibility: 'Private' },
                      { id: 'task', icon: CheckCircle2, label: 'Task', color: 'blue', visibility: 'Private' },
                      { id: 'off-day', icon: Coffee, label: 'Off Day', color: 'red', visibility: 'Public' }
                    ].map(type => (
                        <button
                            key={type.id}
                            type="button"
                            disabled={isReadOnly}
                            onClick={() => setFormData({...formData, type: type.id as any, time: type.id === 'off-day' ? '09:00' : formData.time})}
                            className={`
                                flex flex-col items-center justify-center gap-5 py-12 rounded-[4rem] border-2 transition-all group relative overflow-hidden
                                ${formData.type === type.id 
                                    ? `bg-white border-${type.color}-600 text-${type.color}-600 shadow-2xl scale-105 z-10 ring-8 ring-${type.color}-50` 
                                    : 'bg-slate-50 border-transparent text-slate-400 hover:border-slate-200 hover:bg-white'}
                                ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >   
                            <type.icon className={`h-12 w-12 transition-transform duration-500 group-hover:scale-110 ${formData.type === type.id ? `text-${type.color}-600` : 'text-slate-300'}`} />
                            <div className="text-center">
                                <span className="block text-[11px] font-black uppercase tracking-[0.25em]">{type.label}</span>
                                <span className="text-[9px] font-bold opacity-60 uppercase tracking-widest mt-1">{type.visibility}</span>
                            </div>
                            {formData.type === type.id && (
                                <div className="absolute top-6 right-6">
                                    <Check className={`h-5 w-5 text-${type.color}-600`} strokeWidth={4} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
              </div>
              
              {/* Description */}
              <div>
                 <label className="block text-[11px] font-black text-slate-400 uppercase mb-4 ml-2 tracking-[0.2em]">Description (Optional)</label>
                 <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-[2.5rem] px-10 py-8 text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 resize-none font-medium transition-all placeholder:text-slate-200 shadow-inner disabled:opacity-70 disabled:cursor-not-allowed"
                    rows={4}
                    disabled={isReadOnly}
                    placeholder="Add details about this event..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                 />
              </div>

              {/* Footer Actions */}
              <div className="pt-16 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-slate-100">
                {editingId ? (
                    !isReadOnly ? (
                        <button 
                            type="button" 
                            onClick={handleDelete}
                            className="w-full sm:w-auto text-red-500 hover:text-red-700 text-sm font-black flex items-center justify-center px-12 py-6 rounded-full hover:bg-red-50 transition-all uppercase tracking-[0.2em] active:scale-95"
                        >
                            <Trash2 className="h-5 w-5 mr-3" /> Delete Event
                        </button>
                    ) : (
                        <div className="flex-1"></div>
                    )
                ) : (
                    <button 
                      type="button" 
                      onClick={() => setIsModalOpen(false)}
                      className="w-full sm:w-auto px-16 py-6 text-sm font-black text-slate-300 hover:text-slate-800 uppercase tracking-[0.3em] transition-all active:scale-95 text-center"
                    >
                      Discard Draft
                    </button> 
                )}
                
                {/* PRIMARY SAVE BUTTON */}
                {!isReadOnly ? (
                    <button 
                        type="submit" 
                        className="w-full sm:w-auto px-20 py-8 text-xl font-black text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-[0_30px_60px_-15px_rgba(37,99,235,0.4)] transition-all hover:scale-105 transform active:scale-95 flex items-center justify-center gap-4"
                    >
                        <Save className="h-7 w-7" />
                        {editingId ? 'Update Event' : 'Save Event'}
                    </button>
                ) : (
                    <button 
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="w-full sm:w-auto px-20 py-8 text-xl font-black text-white bg-slate-800 rounded-full transition-all hover:scale-105 transform active:scale-95 flex items-center justify-center gap-4"
                    >
                        Close
                    </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
