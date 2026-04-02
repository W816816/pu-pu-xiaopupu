import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, MapPin } from 'lucide-react';
import { AudioTrack } from '../types';

interface TrackDetailProps {
  track: AudioTrack;
  onClose: () => void;
}

export const TrackDetail: React.FC<TrackDetailProps> = ({ track, onClose }) => {
  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[60] bg-black/95 p-6 overflow-y-auto"
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 bg-white/10 rounded-full"
      >
        <X size={24} />
      </button>

      <div className="max-w-2xl mx-auto pt-12 space-y-12">
        <div className="flex flex-col items-center text-center">
          <img 
            src={track.coverUrl} 
            className="w-48 h-48 rounded-3xl shadow-2xl mb-6 object-cover"
            referrerPolicy="no-referrer"
          />
          <h2 className="text-3xl font-serif font-bold mb-2">{track.title}</h2>
          <p className="text-orange-400 font-mono text-sm tracking-widest">{track.subcategory}</p>
        </div>

        {/* Expert Scripts / Scene Descriptions */}
        <div className="space-y-8">
          {track.category === '引导式冥想' && (
            <section className="glass-panel p-6 space-y-4">
              <div className="flex items-center gap-2 text-orange-400 mb-2">
                <BookOpen size={20} />
                <h3 className="font-bold">专家引导词大纲 (前3分钟)</h3>
              </div>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <div className="pl-4 border-l-2 border-orange-500/30">
                  <p className="text-xs font-mono text-white/40 mb-1">0:00 - 1:00 建立安全感</p>
                  <p>“现在，想象你的床是一片深邃而柔软的云朵，它正完全承托着你的重量。你不需要做任何努力，只需要存在。”</p>
                </div>
                <div className="pl-4 border-l-2 border-orange-500/30">
                  <p className="text-xs font-mono text-white/40 mb-1">1:00 - 2:30 渐进式肌肉放松</p>
                  <p>“从脚趾开始。吸气，用力蜷缩你的脚趾，感受那种紧张……保持 3 秒……呼气，完全松开。感受血液回流的温暖。”</p>
                </div>
                <div className="pl-4 border-l-2 border-orange-500/30">
                  <p className="text-xs font-mono text-white/40 mb-1">2:30 - 3:00 重力暗示</p>
                  <p>“感受你的双腿变得像铅一样沉重，深深地陷进床垫里。这种沉重感正在蔓延到你的腰部……”</p>
                </div>
              </div>
            </section>
          )}

          {track.category === '自然声学' && (
            <section className="glass-panel p-6 space-y-4">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <MapPin size={20} />
                <h3 className="font-bold">3D 空间音频场景描述</h3>
              </div>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p><strong>底层环境：</strong> 极低频的森林环境底噪（风经过针叶林的沙沙声），全方位包围。</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="text-blue-400 shrink-0">远景:</span>
                    <span>左后方每隔 45 秒出现一次极远处的狼嚎，带有长混响。</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-400 shrink-0">近景:</span>
                    <span>下方流过的清澈溪流声，音色清脆，定位在脚部。</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-400 shrink-0">头顶:</span>
                    <span>细密的雨滴打在宽大叶片上的声音，具有明显的方位感。</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-400 shrink-0">焦点:</span>
                    <span>正前方篝火的噼啪声，作为听觉的“锚点”。</span>
                  </li>
                </ul>
              </div>
            </section>
          )}

          <section className="space-y-4">
            <h3 className="text-sm font-mono text-white/40 uppercase tracking-widest">关于此音频</h3>
            <p className="text-white/70 leading-relaxed">{track.description}</p>
          </section>

          <section className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-2xl">
              <p className="text-[10px] text-white/30 uppercase mb-1">声音纹理</p>
              <p className="text-sm">{track.tags.texture}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl">
              <p className="text-[10px] text-white/30 uppercase mb-1">情绪调性</p>
              <p className="text-sm">{track.tags.mood}</p>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};
