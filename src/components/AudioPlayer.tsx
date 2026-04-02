import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AudioTrack } from '../types';

interface AudioPlayerProps {
  track: AudioTrack;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ track, isPlaying, onTogglePlay }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-10 glass-panel">
      <div className="relative w-72 h-72 mb-10">
        <motion.div 
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="w-full h-full rounded-full border border-white/5 p-1"
        >
          <div className="w-full h-full rounded-full overflow-hidden relative">
            <img 
              src={track.coverUrl} 
              alt={track.title} 
              className="w-full h-full object-cover opacity-60 grayscale-[20%]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
          </div>
        </motion.div>
        
        <AnimatePresence>
          {isPlaying && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -inset-4 rounded-full border border-indigo-500/20 animate-breathe" 
            />
          )}
        </AnimatePresence>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif font-light tracking-tight mb-2 opacity-90">{track.title}</h2>
        <p className="text-indigo-300/40 text-[10px] uppercase tracking-[0.3em] font-medium">{track.subcategory}</p>
      </div>

      <div className="flex items-center justify-center gap-12 w-full mb-10">
        <button className="text-white/20 hover:text-white/60 transition-silky">
          <SkipBack size={28} strokeWidth={1.5} />
        </button>
        <button 
          onClick={onTogglePlay}
          className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-silky group"
        >
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-silky">
            {isPlaying ? <Pause size={32} strokeWidth={1.5} /> : <Play size={32} strokeWidth={1.5} className="ml-1" />}
          </div>
        </button>
        <button className="text-white/20 hover:text-white/60 transition-silky">
          <SkipForward size={28} strokeWidth={1.5} />
        </button>
      </div>

      <div className="w-full space-y-3">
        <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "45%" }}
            className="h-full bg-indigo-500/40"
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-white/20 tracking-widest">
          <span>02:45</span>
          <span>{track.duration}</span>
        </div>
      </div>
    </div>
  );
};
