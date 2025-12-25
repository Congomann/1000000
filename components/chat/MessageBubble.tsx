
import React, { useState } from 'react';
import { ChatMessage, ChatAttachment } from '../../types';
import { Check, CheckCheck, MoreHorizontal, Pencil, Trash2, X, CheckCircle } from 'lucide-react';
import { FilePreview } from './FilePreview';
import { useData } from '../../context/DataContext';

interface MessageBubbleProps {
  message: ChatMessage;
  isMe: boolean;
  showAvatar?: boolean;
  avatarUrl?: string;
  onPreviewFile?: (file: ChatAttachment) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMe, showAvatar, avatarUrl, onPreviewFile }) => {
  const { editChatMessage, deleteChatMessage } = useData();
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);

  const canEditOrDelete = isMe && (new Date().getTime() - new Date(message.timestamp).getTime() < 300000);

  const handleEditSave = () => {
    if (editText.trim() && editText !== message.text) {
        editChatMessage(message.id, editText);
    }
    setIsEditing(false);
    setShowActions(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
        deleteChatMessage(message.id);
    }
  };

  return (
    <div className={`flex w-full mb-2 group ${isMe ? 'justify-end' : 'justify-start'}`}>
      {!isMe && (
        <div className="w-8 flex-shrink-0 mr-2 flex items-end">
          {showAvatar ? (
            <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full bg-slate-200 border border-white/20 object-cover shadow-sm" />
          ) : <div className="w-8" />}
        </div>
      )}
      
      <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'} relative group`}>
        {/* Actions Overlay */}
        {canEditOrDelete && !isEditing && (
            <div className={`absolute -top-8 ${isMe ? 'right-0' : 'left-0'} flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-slate-100 p-1`}>
                <button onClick={() => setIsEditing(true)} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 hover:text-blue-600 transition-colors">
                    <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={handleDelete} className="p-1.5 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-600 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </div>
        )}

        <div 
          className={`
            relative px-4 py-2.5 text-sm shadow-sm backdrop-blur-md transition-all
            ${isMe 
              ? 'bg-blue-600 text-white rounded-2xl rounded-tr-md' 
              : 'bg-white/80 text-slate-800 border border-white/40 rounded-2xl rounded-tl-md hover:bg-white'
            }
          `}
        >
          {message.attachment && (
            <div className="mb-2">
              <FilePreview attachment={message.attachment} isMe={isMe} onPreview={() => onPreviewFile?.(message.attachment!)} />
            </div>
          )}
          
          {isEditing ? (
              <div className="flex flex-col gap-2 min-w-[200px]">
                  <textarea 
                    autoFocus
                    className="w-full bg-white/20 text-white placeholder:text-blue-100 border-none rounded-lg p-2 text-sm focus:ring-1 focus:ring-white outline-none resize-none"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleEditSave())}
                  />
                  <div className="flex justify-end gap-2">
                      <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-white/10 rounded"><X className="h-4 w-4" /></button>
                      <button onClick={handleEditSave} className="p-1 hover:bg-white/10 rounded text-white font-bold"><CheckCircle className="h-4 w-4" /></button>
                  </div>
              </div>
          ) : (
              <>
                {message.text && <p className="leading-relaxed whitespace-pre-wrap font-medium">{message.text}</p>}
                {message.isEdited && <span className={`text-[9px] mt-1 block opacity-50 italic ${isMe ? 'text-right' : 'text-left'}`}>Edited</span>}
              </>
          )}
          
          <div className={`
            absolute -bottom-5 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity
            ${isMe ? 'right-1 text-slate-400' : 'left-1 text-slate-400'}
          `}>
            <span>
              {new Date(message.timestamp).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})}
            </span>
            {isMe && (
              <span className={message.read ? 'text-blue-500' : 'text-slate-300'}>
                {message.read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
