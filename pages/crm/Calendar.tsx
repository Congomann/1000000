
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Trash2, 
  AlertCircle, 
  Coffee, 
  ArrowLeft, 
  Save,
  Lock
} from 'lucide-react';
import { CalendarEvent } from '../../types';

export const Calendar: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent, user } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  /**
   * Filter logic for privacy:
   * 1. Off-days are public (everyone sees everyone's red marks)
   * 2. Meetings are public (company-wide)
   * 3. Reminders and Tasks are PRIVATE (only visible to creator)
   */
  const visibleEvents = useMemo(() => {
    return events.filter(e => {
        if (e.type === 'off-day' || e.type === 'meeting') return true;
        return e.creatorId === user?.id;
    });
  }, [events, user]);

  const [formData, setFormData] = useState<{
    title: string;
    startDate: string;
    endDate: string;
    time: string;
    type: 'meeting' | 'reminder' | 'task' | 'off-day';
    description?: string;
  }>({
    title: '',
    startDate: todayStr,
    endDate: todayStr,
    time: '09:00',
    type: 'meeting',
    description: ''
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingEvent = events.find(e => e.id === editingId);
  const isReadOnly = editingId ? editingEvent?.creatorId !== user?.id : false;

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const formatDateHeader = (date: Date) => new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + offset));
    setCurrentDate(new Date(newDate));
  };

  const formatTimeForInput = (timeStr: string) => {
    try {
        if (timeStr === 'All Day') return '09:00';
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12' && modifier === 'AM') hours = '00';
        else if (modifier === 'PM' && hours !== '12') hours = (parseInt(hours, 10) + 12).toString();
        return `${hours.padStart(2, '0')}:${minutes}`;
    } catch (e) { return '09:00'; }
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
        title: '',
        startDate: todayStr,
        endDate: todayStr,
        time: '09:00',
        type: 'meeting',
        description: ''
    });
    setIsModalOpen(true);
  };

  const handleDateClick = (dateStr: string) => {
    if (dateStr < todayStr) return;
    setEditingId(null);
    setFormData({
        title: '',
        startDate: dateStr,
        endDate: dateStr,
        time: '09:00',
        type: 'meeting',
        description: ''
    });
    setIsModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setEditingId(event.id);
    setFormData({
        title: event.title,
        startDate: event.date,
        endDate: event.date,
        time: formatTimeForInput(event.time),
        type: event.type,
        description: event.description || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    
    const [hours, minutes] = formData.time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    const formattedTime = formData.type === 'off-day' ? 'All Day' : `${hour12}:${minutes} ${ampm}`;

    if (editingId) {
        updateEvent({
            id: editingId,
            title: formData.title,
            date: formData.startDate,
            time: formattedTime,
            type: formData.type,
            description: formData.description,
            creatorId: editingEvent?.creatorId,
            creatorName: editingEvent?.creatorName
        });
    } else {
        // Multi-day logic for Off Days (or any multi-day span)
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        
        if (start > end) {
            alert("End date cannot be before start date.");
            return;
        }

        const tempDate = new Date(start);
        while (tempDate <= end) {
            const currentStr = tempDate.toISOString().split('T')[0];
            addEvent({
                title: formData.type === 'off-day' ? `${user?.name || 'Advisor'} Off-Day` : formData.title,
                date: currentStr,
                time: formattedTime,
                type: formData.type,
                description: formData.description,
                creatorId: user?.id,
                creatorName: user?.name
            });
            tempDate.setDate(tempDate.getDate() + 1);
        }
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (editingId && !isReadOnly) {
        if(window.confirm('Delete this event?')) {
            deleteEvent(editingId);
            setIsModalOpen(false);
        }
    }
  };

  /**
   * COLOR MAPPING:
   * Off-day: Red
   * Meeting: Green
   * Reminder: Yellow
   * Task: Blue
   */
  const getEventStyles = (type: string) => {
    switch(type) {
      case 'meeting': return 'bg-emerald-500 text-white border-emerald-600';
      case 'reminder': return 'bg-amber-400 text-white border-amber-500';
      case 'task': return 'bg-blue-500 text-white border-blue-600';
      case 'off-day': return 'bg-rose-500 text-white border-rose-600';
      default: return 'bg-slate-500 text-white border-slate-600';
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

  const upcomingEvents = useMemo(() => {
      return [...visibleEvents]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .filter(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0)));
  }, [visibleEvents]);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-8 animate-fade-in">
      <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-10 py-8 border-b border-slate-200">
          <div className="flex items-center gap-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{formatDateHeader(currentDate)}</h2>
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
          </div>
          <button 
            onClick={handleOpenCreateModal}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-sm font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Event
          </button>
        </div>

        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/50">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
            <div key={day} className="py-5 text-center text-xs font-bold text-slate-400 tracking-widest">{day}</div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7 grid-rows-5 overflow-y-auto">
          {Array.from({ length: getFirstDayOfMonth(currentDate) }).map((_, i) => (
            <div key={`empty-${i}`} className="border-r border-b border-slate-100 bg-slate-50/30" />
          ))}

          {Array.from({ length: getDaysInMonth(currentDate) }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = visibleEvents.filter(e => e.date === dateStr);
            const isTodayDay = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
            const isPast = dateStr < todayStr;

            return (
              <div 
                key={day} 
                onClick={() => handleDateClick(dateStr)}
                className={`relative border-r border-b border-slate-100 p-4 min-h-[120px] transition-all duration-200 group ${isTodayDay ? 'bg-blue-50/40' : 'bg-white'} ${isPast ? 'opacity-60 cursor-default' : 'cursor-pointer hover:bg-slate-50'}`}
              >
                <span className={`inline-flex items-center justify-center w-9 h-9 text-sm font-bold rounded-full mb-3 transition-colors ${isTodayDay ? 'bg-blue-600 text-white shadow-lg' : isPast ? 'text-slate-300' : 'text-slate-700 group-hover:bg-slate-200'}`}>
                  {day}
                </span>
                
                <div className="space-y-1.5">
                  {dayEvents.map(event => (
                    <div 
                        key={event.id} 
                        onClick={(e) => { e.stopPropagation(); handleEventClick(event); }}
                        className={`group/event flex items-center justify-between text-[10px] leading-tight truncate px-2.5 py-1.5 rounded-lg font-black border transition-all hover:scale-[1.02] shadow-sm ${getEventStyles(event.type)}`}
                    >
                        <div className="flex items-center overflow-hidden">
                            {event.creatorId !== user?.id && (event.type === 'reminder' || event.type === 'task') && <Lock className="h-3 w-3 mr-1 opacity-60" />}
                            {getEventIcon(event.type)}
                            <span className="truncate">{event.type === 'off-day' ? `${event.creatorName?.split(' ')[0]}: OFF` : event.title}</span>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full lg:w-[24rem] flex-shrink-0 bg-white rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col overflow-hidden h-full">
        <div className="p-8 border-b border-slate-100 bg-slate-50">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Agenda</h3>
          <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-widest">Team Visibility</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {upcomingEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-60 text-slate-400">
                <CalendarIcon className="h-12 w-12 mb-4 opacity-10" />
                <p className="text-sm font-bold uppercase tracking-widest opacity-40">No upcoming events</p>
            </div>
          ) : (
            upcomingEvents.slice(0, 10).map((event) => (
              <div 
                  key={event.id} 
                  onClick={() => handleEventClick(event)}
                  className={`p-5 rounded-[1.5rem] border cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 group/item ${getEventStyles(event.type)}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h4 className="text-xs font-black leading-tight mb-2 flex items-center justify-between uppercase tracking-wide">
                      <span className="flex items-center gap-2">
                          {getEventIcon(event.type)}
                          {event.type === 'off-day' ? `${event.creatorName}: OFF` : event.title}
                      </span>
                    </h4>
                    <div className="flex items-center text-[10px] font-bold opacity-80 uppercase tracking-widest">
                      <span className="bg-white/20 px-2 py-0.5 rounded-lg">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      <span className="mx-2">•</span>
                      <span>{event.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white overflow-y-auto no-scrollbar animate-fade-in">
          <div className="flex items-center justify-between px-10 py-8 border-b border-slate-100 bg-white sticky top-0 z-10 shadow-sm">
            <button onClick={() => setIsModalOpen(false)} className="flex items-center gap-3 text-slate-800 hover:text-blue-600 transition-all font-black text-sm uppercase tracking-widest group">
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" /> Back
            </button>
            <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">
              {editingId ? 'Event Details' : 'Create New Calendar Entry'}
            </h3>
            <div className="w-16" />
          </div>

          <div className="flex-1 w-full max-w-4xl mx-auto px-8 py-16 pb-32">
            <form onSubmit={handleSubmit} className="space-y-12">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase mb-4 ml-2 tracking-[0.2em]">Title / Description</label>
                <input 
                  type="text" required autoFocus disabled={isReadOnly || formData.type === 'off-day'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-[2.5rem] px-10 py-8 text-2xl font-black focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-200 shadow-inner disabled:opacity-70"
                  placeholder={formData.type === 'off-day' ? "Advisor Out of Office" : "e.g. Portfolio Strategy Review"}
                  value={formData.type === 'off-day' ? `${user?.name} Off-Day` : formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase mb-4 ml-2 tracking-[0.2em]">
                    {formData.type === 'off-day' ? 'Start Date' : 'Event Date'}
                  </label>
                  <input type="date" required min={todayStr} disabled={isReadOnly}
                    className="w-full bg-slate-50 border border-slate-200 rounded-[2.5rem] px-8 py-6 text-xl font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner disabled:opacity-70"
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value, endDate: e.target.value > formData.endDate ? e.target.value : formData.endDate})}
                  />
                </div>
                {formData.type === 'off-day' && (
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase mb-4 ml-2 tracking-[0.2em]">End Date (Until)</label>
                    <input type="date" required min={formData.startDate} disabled={isReadOnly}
                      className="w-full bg-slate-50 border border-slate-200 rounded-[2.5rem] px-8 py-6 text-xl font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner"
                      value={formData.endDate}
                      onChange={e => setFormData({...formData, endDate: e.target.value})}
                    />
                  </div>
                )}
                {formData.type !== 'off-day' && (
                    <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase mb-4 ml-2 tracking-[0.2em]">Time</label>
                        <input type="time" required disabled={isReadOnly}
                            className="w-full bg-slate-50 border border-slate-200 rounded-[2.5rem] px-8 py-6 text-xl font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-inner"
                            value={formData.time}
                            onChange={e => setFormData({...formData, time: e.target.value})}
                        />
                    </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase mb-8 ml-2 tracking-[0.2em]">Classification</label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                      { id: 'meeting', icon: CalendarIcon, label: 'Meeting', active: 'border-emerald-600 text-emerald-600 ring-emerald-50' },
                      { id: 'reminder', icon: AlertCircle, label: 'Reminder', active: 'border-amber-400 text-amber-500 ring-amber-50' },
                      { id: 'task', icon: CheckCircle2, label: 'Task', active: 'border-blue-600 text-blue-600 ring-blue-50' },
                      { id: 'off-day', icon: Coffee, label: 'Off Day', active: 'border-rose-600 text-rose-600 ring-rose-50' }
                    ].map(type => (
                        <button
                            key={type.id}
                            type="button"
                            disabled={isReadOnly}
                            onClick={() => setFormData({...formData, type: type.id as any})}
                            className={`flex flex-col items-center justify-center gap-5 py-12 rounded-[4rem] border-2 transition-all group relative overflow-hidden
                                ${formData.type === type.id ? `bg-white ${type.active} shadow-2xl scale-105 z-10 ring-8` : 'bg-slate-50 border-transparent text-slate-400 hover:border-slate-200 hover:bg-white'}
                                ${isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >   
                            <type.icon className={`h-12 w-12 transition-transform duration-500 group-hover:scale-110`} />
                            <div className="text-center">
                                <span className="block text-[11px] font-black uppercase tracking-[0.25em]">{type.label}</span>
                                <span className="text-[9px] font-bold opacity-60 uppercase tracking-widest mt-1">
                                    {(type.id === 'reminder' || type.id === 'task') ? 'Private' : 'Public'}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
              </div>
              
              <div className="pt-16 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-slate-100">
                {editingId && !isReadOnly ? (
                    <button type="button" onClick={handleDelete} className="text-red-500 hover:text-red-700 text-sm font-black flex items-center justify-center px-12 py-6 rounded-full hover:bg-red-50 transition-all uppercase tracking-[0.2em]">
                        <Trash2 className="h-5 w-5 mr-3" /> Remove Record
                    </button>
                ) : <div className="flex-1"></div>}
                
                {!isReadOnly ? (
                    <button type="submit" className="w-full sm:w-auto px-20 py-8 text-xl font-black text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-4">
                        <Save className="h-7 w-7" /> {editingId ? 'Update Record' : 'Commit to Terminal'}
                    </button>
                ) : (
                    <button type="button" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto px-20 py-8 text-xl font-black text-white bg-slate-800 rounded-full transition-all hover:scale-105 active:scale-95">Close Details</button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
