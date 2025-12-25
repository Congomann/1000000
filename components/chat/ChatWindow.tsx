
import React, { useRef, useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';
import { ChatAttachment } from '../../types';
import { Info, Users, X, Download, Maximize2 } from 'lucide-react';

interface ChatWindowProps {
  activeId: string;
  type: 'user' | 'lead' | 'group';
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ activeId, type }) => {
  const { colleagues, leads, chatMessages, sendChatMessage, markChatRead, user } = useData();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [previewFile, setPreviewFile] = useState<ChatAttachment | null>(null);

  const activeColleague = colleagues.find(c => c.id === activeId);
  const typingColleague = colleagues.find(c => c.isTyping && (type === 'group' ? true : c.id === activeId));

  // Resolve Target
  let targetName = 'Unknown';
  let targetAvatar = undefined;
  let targetSub = '';

  if (type === 'user') {
      targetName = activeColleague?.name || 'Unknown';
      targetAvatar = activeColleague?.avatar;
      targetSub = activeColleague?.status === 'online' ? 'Active Now' : 'Offline';
  } else if (type === 'lead') {
      const lead = leads.find(l => l.id === activeId);
      targetName = lead?.name || 'Lead';
      targetSub = `${lead?.interest} Opportunity`;
  } else {
      targetName = activeId === 'g-1' ? 'Sales Team' : 'Underwriting';
      targetSub = `${colleagues.length} participants`;
  }

  // Filter messages logic based on absolute IDs
  const messages = chatMessages
    .filter(m => {
        if (!user) return false;
        if (type === 'group') {
            return m.receiverId === activeId;
        }
        return (
            (m.senderId === user.id && m.receiverId === activeId) || 
            (m.senderId === activeId && m.receiverId === user.id)
        );
    })
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Mark as read when messages change while chat is open
  useEffect(() => {
    if (activeId) markChatRead(activeId);
  }, [messages.length, activeId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingColleague]);

  const handleSend = (text: string, attachment?: ChatAttachment) => {
      sendChatMessage(activeId, text, attachment);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white/40 backdrop-blur-2xl relative overflow-hidden">
        {/* Glass Header */}
        <div className="h-16 px-6 flex items-center justify-between bg-white/60 backdrop-blur-md border-b border-white/20 z-10 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="relative">
                    {type === 'group' ? (
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border-2 border-white shadow-sm">
                            <Users className="h-5 w-5" />
                        </div>
                    ) : targetAvatar ? (
                        <img src={targetAvatar} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            {targetName[0]}
                        </div>
                    )}
                    {type === 'user' && (activeColleague?.status === 'online') && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-sm leading-tight">{targetName}</h3>
                    <div className="flex items-center gap-1.5">
                        {typingColleague ? (
                             <p className="text-[10px] font-black text-blue-600 animate-pulse uppercase tracking-widest">
                                 {type === 'group' ? `${typingColleague.name.split(' ')[0]} is typing...` : 'Typing...'}
                             </p>
                        ) : (
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{targetSub}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                    <Info className="h-5 w-5" />
                </button>
            </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar no-scrollbar">
            <div className="flex justify-center py-4">
                <span className="text-[10px] font-black text-slate-400 bg-slate-100/80 px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm backdrop-blur-md">Secure Team Channel</span>
            </div>
            {messages.map((msg, i) => {
                const isMe = msg.senderId === user?.id;
                const showAvatar = !isMe && (messages[i+1]?.senderId !== msg.senderId);
                const sender = !isMe ? colleagues.find(c => c.id === msg.senderId) : null;

                return (
                    <MessageBubble 
                        key={msg.id} 
                        message={msg} 
                        isMe={isMe} 
                        showAvatar={showAvatar}
                        avatarUrl={sender?.avatar || targetAvatar}
                        onPreviewFile={(file) => setPreviewFile(file)}
                    />
                );
            })}
            
            {/* Real-time participant typing indicator */}
            {typingColleague && (
                <div className="flex justify-start items-center gap-2 p-2 animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 border border-white shadow-sm">
                        <img src={typingColleague.avatar} className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-white/60 px-4 py-2.5 rounded-2xl rounded-tl-sm flex items-center gap-2 border border-white/50 shadow-sm">
                        <div className="flex gap-1">
                            <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={scrollRef} />
        </div>

        {/* Composer */}
        <ChatInput onSendMessage={handleSend} />

        {/* File Preview Modal */}
        {previewFile && (
            <div className="fixed inset-0 z-[100] flex flex-col bg-slate-900/95 backdrop-blur-2xl animate-fade-in">
                <div className="h-20 px-8 flex items-center justify-between border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-2xl text-blue-400">
                             <Maximize2 className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold">{previewFile.name}</h3>
                            <p className="text-white/40 text-xs uppercase tracking-widest font-black">Encrypted Preview</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a 
                            href={previewFile.url} 
                            download={previewFile.name}
                            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-sm transition-all"
                        >
                            <Download className="h-4 w-4" /> Download
                        </a>
                        <button 
                            onClick={() => setPreviewFile(null)}
                            className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl transition-all"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
                    {previewFile.url.includes('pdf') || previewFile.name.toLowerCase().endsWith('.pdf') ? (
                        <iframe 
                            src={`${previewFile.url}#toolbar=0`} 
                            className="w-full h-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-white/20"
                            title="PDF Preview"
                        />
                    ) : previewFile.type === 'image' ? (
                        <img 
                            src={previewFile.url} 
                            className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl border border-white/20" 
                            alt="Preview"
                        />
                    ) : (
                        <div className="text-center text-white/40">
                             <p className="text-xl font-bold">Preview not supported for this file type.</p>
                             <p className="mt-2">Please download the file to view it locally.</p>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};
