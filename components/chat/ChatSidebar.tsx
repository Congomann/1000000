
import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Search, Hash, Clock } from 'lucide-react';

interface ChatSidebarProps {
  activeId: string | null;
  onSelect: (id: string, type: 'user' | 'lead' | 'group') => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ activeId, onSelect }) => {
  const { colleagues, chatMessages, markChatRead, user } = useData();
  const [search, setSearch] = React.useState('');

  const groups = [
    { id: 'g-1', name: 'Sales Team', type: 'group' },
    { id: 'g-2', name: 'Underwriting', type: 'group' },
  ];

  const filteredColleagues = colleagues.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  // Get last message and unread count for each thread
  const threadMeta = useMemo(() => {
    if (!user) return {};
    const meta: Record<string, { lastMsg: string, senderName: string, timestamp: Date | null, unread: number }> = {};
    
    [...colleagues.map(c => c.id), ...groups.map(g => g.id)].forEach(id => {
        const isGroup = id.startsWith('g-');
        
        const threadMsgs = chatMessages.filter(m => 
            isGroup ? (m.receiverId === id) : 
            ((m.senderId === id && m.receiverId === user.id) || (m.senderId === user.id && m.receiverId === id))
        ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        const last = threadMsgs[0];
        let senderName = '';
        if (last) {
            if (last.senderId === user.id) senderName = 'You';
            else {
                const found = colleagues.find(c => c.id === last.senderId);
                senderName = found ? found.name.split(' ')[0] : 'Member';
            }
        }

        meta[id] = {
            lastMsg: last?.text || (last?.attachment ? 'Sent an attachment' : ''),
            senderName,
            timestamp: last?.timestamp || null,
            unread: threadMsgs.filter(m => (isGroup ? (m.receiverId === id) : (m.senderId === id)) && !m.read && m.senderId !== user.id).length
        };
    });
    return meta;
  }, [chatMessages, colleagues, user]);

  const handleSelect = (id: string, type: 'user' | 'lead' | 'group') => {
      onSelect(id, type);
      markChatRead(id);
  };

  const formatTime = (date: Date | null) => {
      if (!date) return '';
      const now = new Date();
      const diff = now.getTime() - new Date(date).getTime();
      if (diff < 60000) return 'Just now';
      if (diff < 3600000) return `${Math.floor(diff/60000)}m`;
      if (diff < 86400000) return `${Math.floor(diff/3600000)}h`;
      return new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-80 flex flex-col border-r border-white/20 bg-white/30 backdrop-blur-xl h-full">
      {/* Header & Search */}
      <div className="p-5 pb-2">
        <h2 className="text-xl font-bold text-slate-800 mb-4 px-2 tracking-tight">Messaging</h2>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search conversations..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-100/50 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-blue-200 rounded-xl py-2.5 pl-9 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 text-slate-700 shadow-inner"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-6 scrollbar-hide mt-2">
        {/* Groups */}
        <div>
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-4 mb-3">Group Channels</h3>
          <div className="space-y-1">
            {groups.map(g => (
              <button
                key={g.id}
                onClick={() => handleSelect(g.id, 'group')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${activeId === g.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-700 hover:bg-white/40'}`}
              >
                <div className={`flex-shrink-0 p-2 rounded-xl ${activeId === g.id ? 'bg-white/20' : 'bg-slate-100'}`}>
                  <Hash className="h-4 w-4" />
                </div>
                <div className="flex-1 text-left overflow-hidden">
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-sm">{g.name}</span>
                        <span className="text-[10px] opacity-60 font-medium">{formatTime(threadMeta[g.id]?.timestamp)}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                        <p className={`text-xs truncate ${activeId === g.id ? 'text-blue-100' : 'text-slate-500'}`}>
                            {threadMeta[g.id]?.lastMsg ? `${threadMeta[g.id].senderName}: ${threadMeta[g.id].lastMsg}` : 'No messages'}
                        </p>
                        {threadMeta[g.id]?.unread > 0 && activeId !== g.id && (
                            <span className="h-4 min-w-[1rem] px-1 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">
                                {threadMeta[g.id].unread}
                            </span>
                        )}
                    </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Direct Messages */}
        <div>
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-4 mb-3">Direct Messages</h3>
          <div className="space-y-1">
            {filteredColleagues.map(c => {
                const meta = threadMeta[c.id];
                if (c.id === user?.id) return null; // Don't message self in DM list
                return (
                    <button
                        key={c.id}
                        onClick={() => handleSelect(c.id, 'user')}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all ${activeId === c.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-700 hover:bg-white/50'}`}
                    >
                        <div className="relative flex-shrink-0">
                            <img src={c.avatar} alt="" className="w-11 h-11 rounded-full object-cover bg-slate-200 border-2 border-white shadow-sm" />
                            {c.status === 'online' && <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>}
                        </div>
                        <div className="flex-1 text-left overflow-hidden">
                        <div className="flex justify-between items-center mb-0.5">
                            <span className="font-bold truncate text-sm">{c.name}</span>
                            <span className={`text-[10px] font-medium ${activeId === c.id ? 'text-blue-200' : 'text-slate-400'}`}>
                                {formatTime(meta?.timestamp)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                            <p className={`text-xs truncate flex-1 ${activeId === c.id ? 'text-blue-100' : 'text-slate-500'}`}>
                                {c.isTyping ? <span className="animate-pulse font-bold text-blue-400 italic">Typing...</span> : (meta?.lastMsg || c.role)}
                            </p>
                            {meta?.unread > 0 && activeId !== c.id && (
                                <span className="flex-shrink-0 h-4 min-w-[1rem] px-1 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">
                                    {meta.unread}
                                </span>
                            )}
                        </div>
                        </div>
                    </button>
                );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
