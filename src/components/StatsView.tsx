import React from 'react';
import { BarChart3, Clock, Zap, Moon } from 'lucide-react';
import { motion } from 'motion/react';

export const StatsView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold">睡眠洞察</h2>
        <div className="px-3 py-1 bg-orange-500/20 rounded-full text-[10px] text-orange-400 font-mono">LAST 7 DAYS</div>
      </div>

      {/* Main Score */}
      <div className="glass-panel p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50" />
        <p className="text-sm text-white/40 mb-2">昨晚睡眠评分</p>
        <div className="text-6xl font-serif font-bold text-orange-500 mb-2">88</div>
        <p className="text-xs text-green-400 flex items-center justify-center gap-1">
          <Zap size={12} /> 比上周提升 12%
        </p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel p-4">
          <div className="flex items-center gap-2 text-white/40 mb-2">
            <Clock size={14} />
            <span className="text-xs">睡眠时长</span>
          </div>
          <div className="text-xl font-medium">7h 45m</div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-2 text-white/40 mb-2">
            <Moon size={14} />
            <span className="text-xs">深度睡眠</span>
          </div>
          <div className="text-xl font-medium">2h 12m</div>
        </div>
      </div>

      {/* Chart Mockup */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-medium">睡眠周期分布</h3>
          <BarChart3 size={16} className="text-white/20" />
        </div>
        <div className="flex items-end justify-between h-32 gap-2">
          {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                className={`w-full rounded-t-sm ${i === 3 ? 'bg-orange-500' : 'bg-white/10'}`}
              />
              <span className="text-[10px] text-white/20 font-mono">0{i+1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Advice */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
        <h4 className="text-blue-400 text-xs font-bold mb-1 uppercase tracking-wider">AI 专家建议</h4>
        <p className="text-sm text-white/70 leading-relaxed">
          检测到您在凌晨 3:15 有一次短暂惊醒。建议今晚尝试“京都禅意雨天”3D音频，其低频钟声有助于维持深睡期的脑波稳定性。
        </p>
      </div>
    </div>
  );
};
