
import React, { useRef, useState } from 'react';
import { Paperclip, Mic, Send, Image as ImageIcon, File, X } from 'lucide-react';
import { ChatAttachment } from '../../types';
import { AudioRecorder } from './AudioRecorder';

interface ChatInputProps {
  onSendMessage: (text: string, attachment?: ChatAttachment) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleAudioSend = (blob: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
        const base64 = reader.result as string;
        onSendMessage('', { type: 'audio', url: base64, name: 'voice_note.webm' });
        setIsRecording(false);
    };
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
        const result = ev.target?.result as string;
        const type = file.type.startsWith('image/') ? 'image' : 'file';
        onSendMessage('', { type, url: result, name: file.name });
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  if (isRecording) {
      return (
          <div className="p-4 bg-white/80 backdrop-blur-xl border-t border-white/20 animate-slide-up">
              <AudioRecorder onSend={handleAudioSend} onCancel={() => setIsRecording(false)} />
          </div>
      )
  }

  return (
    <div 
        className="p-4 bg-white/60 backdrop-blur-xl border-t border-white/10 relative"
        onDragEnter={handleDrag}
    >
      {dragActive && (
          <div 
            className="absolute inset-0 z-50 bg-blue-600/10 backdrop-blur-sm border-2 border-dashed border-blue-500 rounded-none flex flex-col items-center justify-center transition-all animate-pulse"
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onDragOver={handleDrag}
          >
              <File className="h-12 w-12 text-blue-600 mb-2" />
              <p className="text-blue-600 font-black text-lg">Release to send file</p>
          </div>
      )}

      <form 
        onSubmit={handleSubmit}
        className="flex items-end gap-2 bg-white/80 p-2 rounded-[2rem] border border-slate-200 shadow-sm focus-within:border-blue-300 focus-within:shadow-md transition-all duration-300 ring-1 ring-black/5"
      >
        <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors flex-shrink-0"
        >
            <Paperclip className="h-5 w-5 transform -rotate-45" />
        </button>
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />

        <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Secure message..."
            rows={1}
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-3 px-1 text-sm text-slate-800 placeholder:text-slate-400 max-h-40 scrollbar-hide font-medium"
            style={{ minHeight: '44px' }}
        />

        {text.trim() ? (
            <button type="submit" className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md transition-all active:scale-90 flex-shrink-0">
                <Send className="h-4 w-4 ml-0.5" />
            </button>
        ) : (
            <button 
                type="button" 
                onClick={() => setIsRecording(true)}
                className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors flex-shrink-0"
            >
                <Mic className="h-5 w-5" />
            </button>
        )}
      </form>
    </div>
  );
};
