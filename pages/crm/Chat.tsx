
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ChatSidebar } from '../../components/chat/ChatSidebar';
import { ChatWindow } from '../../components/chat/ChatWindow';
import { MessageSquare } from 'lucide-react';

export const Chat: React.FC = () => {
  const { colleagues } = useData();
  const [activeChat, setActiveChat] = useState<{ id: string; type: 'user' | 'lead' | 'group' } | null>(null);

  // Initialize with first colleague if none selected, or null state
  // For demo visual, we can start empty
  
  return (
    <div className="h-full flex flex-col bg-white/40 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden relative">
      {/* Background Mesh Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 via-purple-50/20 to-blue-50/40 pointer-events-none -z-10"></div>

      <div className="flex h-full">
        {/* Sidebar */}
        <ChatSidebar 
            activeId={activeChat?.id || null} 
            onSelect={(id, type) => setActiveChat({ id, type })} 
        />

        {/* Main Area */}
        <div className="flex-1 flex flex-col h-full bg-white/20 backdrop-blur-sm">
            {activeChat ? (
                <ChatWindow activeId={activeChat.id} type={activeChat.type} />
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                    <div className="w-24 h-24 bg-white/60 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center mb-6 shadow-xl shadow-blue-900/5 border border-white/50">
                        <MessageSquare className="h-10 w-10 text-blue-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-700 tracking-tight">Team Messages</h3>
                    <p className="mt-2 font-medium text-slate-500 max-w-sm">
                        Select a colleague, lead, or group from the sidebar to start a secure conversation.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
