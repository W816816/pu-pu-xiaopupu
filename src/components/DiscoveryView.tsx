import React from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const TAGS = ['焦虑型失眠', '浅眠回睡', '快速入睡', '冥想引导', '脑波同步', '3D空间音', '自然白噪音', 'ASMR'];

export const DiscoveryView: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
        <input 
          type="text" 
          placeholder="搜索声音、场景或痛点..." 
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 ring-orange-500/50 transition-all"
        />
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-serif font-medium flex items-center gap-2">
            <Sparkles size={18} className="text-orange-400" />
            热门标签
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {TAGS.map(tag => (
            <button key={tag} className="px-4 py-2 bg-white/5 hover:bg-orange-500/20 border border-white/10 rounded-full text-xs transition-colors">
              {tag}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-serif font-medium">专题策划</h3>
        <div className="space-y-4">
          <div className="relative h-40 rounded-3xl overflow-hidden group">
            <img src="https://picsum.photos/seed/forest/800/400" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
            <div className="absolute inset-0 p-6 flex flex-col justify-center">
              <span className="text-[10px] font-mono text-orange-400 mb-1">COLLECTION</span>
              <h4 className="text-xl font-bold mb-2">北欧森林疗愈系列</h4>
              <p className="text-xs text-white/60 max-w-[200px]">采用 3D 环绕采样，还原挪威深夜的极致宁静。</p>
            </div>
          </div>

          <div className="relative h-40 rounded-3xl overflow-hidden group">
            <img src="https://picsum.photos/seed/tech/800/400" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent" />
            <div className="absolute inset-0 p-6 flex flex-col justify-center">
              <span className="text-[10px] font-mono text-blue-400 mb-1">TECHNOLOGY</span>
              <h4 className="text-xl font-bold mb-2">脑波同步实验室</h4>
              <p className="text-xs text-white/60 max-w-[200px]">基于 Delta 波段设计的纯技术助眠方案。</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
