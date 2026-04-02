import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, X, SlidersHorizontal } from 'lucide-react';
import { SoundElement } from '../types';

interface MixerPanelProps {
  activeSounds: Map<string, number>;
  soundLibrary: SoundElement[];
  onVolumeChange: (id: string, volume: number) => void;
  onRemove: (id: string) => void;
}

export const MixerPanel: React.FC<MixerPanelProps> = ({ activeSounds, soundLibrary, onVolumeChange, onRemove }) => {
  const activeList = Array.from(activeSounds.entries()).map(([id, volume]) => ({
    sound: soundLibrary.find(s => s.id === id)!,
    volume
  }));

  if (activeList.length === 0) return null;

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-panel p-6 space-y-6 border-indigo-500/10"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-indigo-400">
          <SlidersHorizontal size={16} />
          <h3 className="text-xs font-mono uppercase tracking-widest">Sound Mixer</h3>
        </div>
        <span className="text-[10px] text-white/20">{activeList.length} ACTIVE LAYERS</span>
      </div>

      <div className="space-y-4">
        {activeList.map(({ sound, volume }) => (
          <div key={sound.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-light opacity-80">{sound.title}</span>
              <button 
                onClick={() => onRemove(sound.id)}
                className="text-white/20 hover:text-rose-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <Volume2 size={12} className="text-white/20" />
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume} 
                onChange={(e) => onVolumeChange(sound.id, parseInt(e.target.value))}
                className="flex-1 h-[2px] bg-white/5 appearance-none cursor-pointer accent-indigo-500"
              />
              <span className="text-[10px] font-mono text-white/20 w-6">{volume}%</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
