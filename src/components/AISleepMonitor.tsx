import React from 'react';
import { Activity, Zap, ShieldAlert, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SleepState, AIStrategy } from '../types';

interface AISleepMonitorProps {
  currentState: SleepState;
}

const STRATEGIES: Record<SleepState, AIStrategy> = {
  IDLE: { state: 'IDLE', action: '等待监测', description: '系统已就绪，等待用户开启睡眠模式。' },
  LATENCY: { state: 'LATENCY', action: '漏斗式衰减', description: '检测到入睡潜伏期。音量每5分钟下降10%，过滤高频成分。' },
  DEEP_SLEEP: { state: 'DEEP_SLEEP', action: '深度维持', description: '进入深度睡眠。维持极低频Delta波背景音。' },
  SNORING: { state: 'SNORING', action: '声学干预', description: '检测到非规律性鼾声。混入40Hz脉冲，诱导轻微翻身。' },
  WAKE_UP_PHASE: { state: 'WAKE_UP_PHASE', action: '声学阶梯唤醒', description: '浅睡期唤醒。从自然声过渡到60BPM节奏音乐。' },
};

export const AISleepMonitor: React.FC<AISleepMonitorProps> = ({ currentState }) => {
  const strategy = STRATEGIES[currentState];

  return (
    <div className="w-full glass-panel p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <h3 className="text-xs font-mono text-white/30 uppercase tracking-[0.2em]">AI Acoustic Engine</h3>
        </div>
        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-mono text-white/40">
          LIVE FEED
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-start gap-6">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-indigo-400">
            {currentState === 'LATENCY' && <Zap size={20} strokeWidth={1.5} />}
            {currentState === 'SNORING' && <ShieldAlert size={20} strokeWidth={1.5} className="text-rose-500" />}
            {currentState === 'WAKE_UP_PHASE' && <Sun size={20} strokeWidth={1.5} className="text-amber-200" />}
            {currentState === 'DEEP_SLEEP' && <Moon size={20} strokeWidth={1.5} className="text-indigo-300" />}
            {currentState === 'IDLE' && <Activity size={20} strokeWidth={1.5} className="opacity-20" />}
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-serif font-light mb-1 opacity-90">{strategy.action}</h4>
            <p className="text-sm text-white/40 leading-relaxed font-light">{strategy.description}</p>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5">
          <div className="flex items-end justify-between h-8 gap-[2px]">
            {[...Array(32)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  height: currentState === 'IDLE' ? 2 : [2, Math.random() * 24 + 4, 2],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ duration: 1.5, delay: i * 0.05, repeat: Infinity }}
                className="flex-1 bg-indigo-400 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
