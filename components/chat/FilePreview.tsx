
import React from 'react';
import { ChatAttachment } from '../../types';
import { FileText, Play, Download, Image as ImageIcon, Eye } from 'lucide-react';

interface FilePreviewProps {
  attachment: ChatAttachment;
  isMe: boolean;
  onPreview?: () => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ attachment, isMe, onPreview }) => {
  const isImage = attachment.type === 'image';
  const isAudio = attachment.type === 'audio';
  const isPDF = attachment.name.toLowerCase().endsWith('.pdf') || attachment.url.includes('pdf');

  if (isImage) {
    return (
      <div className="group relative overflow-hidden rounded-lg mt-1 mb-1 border border-black/5 shadow-sm max-w-[200px] cursor-pointer" onClick={onPreview}>
        <img src={attachment.url} alt="Attachment" className="w-full h-auto object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white gap-3">
            <button onClick={(e) => { e.stopPropagation(); onPreview?.(); }} className="p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors">
                <Eye className="h-5 w-5" />
            </button>
            <a 
                href={attachment.url} 
                download 
                onClick={(e) => e.stopPropagation()}
                className="p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors text-white"
            >
                <Download className="h-5 w-5" />
            </a>
        </div>
      </div>
    );
  }

  if (isAudio) {
    return (
      <div className={`flex items-center gap-3 p-2 rounded-xl min-w-[200px] ${isMe ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
        <div className={`p-2 rounded-full ${isMe ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
            <Play className={`h-3 w-3 ${isMe ? 'text-white fill-current' : 'text-slate-800 fill-current'}`} />
        </div>
        <div className="flex-1 h-8 flex flex-col justify-center">
             <div className={`h-1 rounded-full w-full overflow-hidden ${isMe ? 'bg-white/30' : 'bg-slate-300'}`}>
                 <div className={`h-full w-1/3 ${isMe ? 'bg-white' : 'bg-blue-500'}`}></div>
             </div>
             <div className={`flex justify-between text-[9px] mt-1 font-medium ${isMe ? 'text-blue-100' : 'text-slate-500'}`}>
                 <span>Voice Note</span>
                 <span>0:12</span>
             </div>
        </div>
        <audio src={attachment.url} className="hidden" />
      </div>
    );
  }

  // Generic File or PDF
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isMe ? 'bg-blue-600 border-blue-500' : 'bg-slate-50 border-slate-200'}`}>
        <div className={`p-2 rounded-lg ${isMe ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
            <FileText className={`h-5 w-5 ${isMe ? 'text-white' : 'text-blue-500'}`} />
        </div>
        <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold truncate ${isMe ? 'text-white' : 'text-slate-700'}`}>{attachment.name}</p>
            <p className={`text-[10px] ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>{isPDF ? 'Portable Document' : 'Standard File'}</p>
        </div>
        <div className="flex gap-2">
            {(isPDF || isImage) && (
                <button 
                    onClick={onPreview}
                    className={`p-1.5 rounded-lg transition-colors ${isMe ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white hover:bg-slate-100 text-slate-400'}`}
                >
                    <Eye className="h-4 w-4" />
                </button>
            )}
            <a 
                href={attachment.url} 
                download 
                className={`p-1.5 rounded-lg transition-colors ${isMe ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white hover:bg-slate-100 text-slate-400'}`}
            >
                <Download className="h-4 w-4" />
            </a>
        </div>
    </div>
  );
};
