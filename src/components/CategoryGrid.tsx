import React from 'react';
import { SoundElement } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Check } from 'lucide-react';

interface CategoryGridProps {
  sounds: SoundElement[];
  activeIds: string[];
  onToggle: (sound: SoundElement) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ sounds, activeIds, onToggle }) => {
  // Group sounds by category
  const categories = Array.from(new Set(sounds.map(s => s.category)));

  return (
    <div className="space-y-10">
      {categories.map(category => (
        <div key={category} className="space-y-5">
          <div className="flex items-center gap-3 ml-1">
            <div className="w-1 h-1 rounded-full bg-indigo-500/40" />
            <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">{category}</h3>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {sounds.filter(s => s.category === category).map((sound) => {
              const isActive = activeIds.includes(sound.id);
              return (
                <motion.button
                  key={sound.id}
                  whileHover={{ y: -2, backgroundColor: 'rgba(255,255,255,0.08)' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onToggle(sound)}
                  className={`relative flex flex-col items-center gap-2 py-5 px-2 rounded-[20px] transition-silky border ${
                    isActive 
                      ? 'bg-indigo-500/10 border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.05)]' 
                      : 'bg-white/[0.02] border-white/[0.03] hover:border-white/10'
                  }`}
                >
                  <div className={`text-xl transition-silky ${
                    isActive ? 'scale-110' : 'opacity-40 grayscale'
                  }`}>
                    {sound.icon}
                  </div>
                  <span className={`text-[9px] font-light tracking-wider transition-silky ${
                    isActive ? 'text-indigo-300' : 'text-white/20'
                  }`}>
                    {sound.title}
                  </span>
                  
                  <AnimatePresence>
                    {isActive && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg"
                      >
                        <Check size={8} className="text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
