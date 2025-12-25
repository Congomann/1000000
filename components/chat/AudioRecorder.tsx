
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Send, X, Trash2 } from 'lucide-react';

interface AudioRecorderProps {
  onSend: (blob: Blob) => void;
  onCancel: () => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onSend, onCancel }) => {
  const [duration, setDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(true);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    startRecording();
    return () => {
      stopMedia();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.start();
      
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Mic Error", err);
      onCancel();
    }
  };

  const stopMedia = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleSend = () => {
    stopMedia();
    setTimeout(() => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        onSend(blob);
    }, 200);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-3 w-full animate-fade-in bg-red-50/50 backdrop-blur-md rounded-2xl p-2 border border-red-100">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 animate-pulse shadow-red-500/20 shadow-lg">
        <Mic className="h-4 w-4 text-white" />
      </div>
      
      <div className="flex-1 flex items-center gap-2 overflow-hidden h-8">
        {/* Fake Visualizer */}
        <div className="flex items-center gap-1 h-full flex-1">
            {[...Array(12)].map((_, i) => (
                <div 
                    key={i} 
                    className="w-1 bg-red-400 rounded-full animate-music-bar"
                    style={{ 
                        height: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.1}s` 
                    }} 
                />
            ))}
        </div>
        <span className="font-mono text-xs font-bold text-red-600 w-10">{formatTime(duration)}</span>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-full transition-all">
            <Trash2 className="h-4 w-4" />
        </button>
        <button onClick={handleSend} className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-md transition-all">
            <Send className="h-4 w-4 ml-0.5" />
        </button>
      </div>
    </div>
  );
};
