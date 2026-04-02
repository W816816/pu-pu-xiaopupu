import { useState, useEffect, useCallback, useRef } from 'react';
import { Howl, Howler } from 'howler';
import { AudioPlayer } from './components/AudioPlayer';
import { AISleepMonitor } from './components/AISleepMonitor';
import { CategoryGrid } from './components/CategoryGrid';
import { StatsView } from './components/StatsView';
import { DiscoveryView } from './components/DiscoveryView';
import { TrackDetail } from './components/TrackDetail';
import { MixerPanel } from './components/MixerPanel';
import { Login } from './components/Login';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AudioTrack, SleepState, SoundElement } from './types';
import { Moon, Settings, Bell, User, Tag, Activity, Search, Sparkles, X, SlidersHorizontal, Music, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db, onAuthStateChanged, User as FirebaseUser, doc, setDoc, getDoc, onSnapshot, handleFirestoreError, OperationType } from './firebase';
import { signOut } from 'firebase/auth';

const SOUND_LIBRARY: SoundElement[] = [
  // Nature
  { id: 'n1', title: '篝火', icon: '🔥', category: '自然', url: 'https://www.soundjay.com/nature/sounds/campfire-1.mp3' },
  { id: 'n2', title: '海浪', icon: '🌊', category: '自然', url: 'https://www.soundjay.com/nature/sounds/ocean-wave-1.mp3' },
  { id: 'n3', title: '细雨', icon: '🌧️', category: '自然', url: 'https://www.soundjay.com/nature/sounds/rain-01.mp3' },
  { id: 'n4', title: '雷鸣', icon: '⚡', category: '自然', url: 'https://www.soundjay.com/nature/sounds/thunder-01.mp3' },
  { id: 'n5', title: '森林', icon: '🌲', category: '自然', url: 'https://www.soundjay.com/nature/sounds/birds-chirping-01.mp3' },
  { id: 'n6', title: '溪流', icon: '💧', category: '自然', url: 'https://www.soundjay.com/nature/sounds/river-1.mp3' },
  { id: 'n7', title: '夏蝉', icon: '🦗', category: '自然', url: 'https://assets.mixkit.co/sfx/preview/mixkit-crickets-chirping-at-night-loop-1256.mp3' },
  { id: 'n8', title: '深雪', icon: '❄️', category: '自然', url: 'https://assets.mixkit.co/sfx/preview/mixkit-walking-on-snow-loop-1257.mp3' },
  { id: 'n9', title: '狂风', icon: '🌬️', category: '自然', url: 'https://www.soundjay.com/nature/sounds/wind-01.mp3' },
  // Urban
  { id: 'u1', title: '键盘', icon: '⌨️', category: '生活', url: 'https://www.soundjay.com/communication/sounds/typewriter-key-1.mp3' },
  { id: 'u2', title: '咖啡馆', icon: '☕', category: '生活', url: 'https://assets.mixkit.co/sfx/preview/mixkit-coffee-shop-ambience-1205.mp3' },
  { id: 'u3', title: '火车', icon: '🚂', category: '生活', url: 'https://www.soundjay.com/transportation/sounds/train-ride-1.mp3' },
  { id: 'u4', title: '风扇', icon: '🌀', category: '生活', url: 'https://assets.mixkit.co/sfx/preview/mixkit-electric-fan-humming-loop-1259.mp3' },
  { id: 'u5', title: '闹市', icon: '🏙️', category: '生活', url: 'https://assets.mixkit.co/sfx/preview/mixkit-city-traffic-ambience-1211.mp3' },
  { id: 'u6', title: '钟摆', icon: '🕰️', category: '生活', url: 'https://www.soundjay.com/clock/sounds/clock-ticking-2.mp3' },
  { id: 'u7', title: '机舱', icon: '✈️', category: '生活', url: 'https://assets.mixkit.co/sfx/preview/mixkit-airplane-cabin-humming-loop-1261.mp3' },
  { id: 'u8', title: '猫咪', icon: '🐱', category: '生活', url: 'https://assets.mixkit.co/sfx/preview/mixkit-cat-purring-loop-1254.mp3' },
  // ASMR
  { id: 'a1', title: '翻书', icon: '📖', category: 'ASMR', url: 'https://www.soundjay.com/misc/sounds/page-flip-01.mp3' },
  { id: 'a2', title: '耳语', icon: '👂', category: 'ASMR', url: 'https://assets.mixkit.co/sfx/preview/mixkit-whispering-voices-1223.mp3' },
  { id: 'a3', title: '敲击', icon: '🔨', category: 'ASMR', url: 'https://assets.mixkit.co/sfx/preview/mixkit-tapping-on-wood-1224.mp3' },
  { id: 'a4', title: '梳理', icon: '🪮', category: 'ASMR', url: 'https://assets.mixkit.co/sfx/preview/mixkit-hair-brushing-1225.mp3' },
  { id: 'a5', title: '剪纸', icon: '✂️', category: 'ASMR', url: 'https://www.soundjay.com/household/sounds/scissors-1.mp3' },
  // Brainwave
  { id: 'b1', title: 'Alpha波', icon: '🧠', category: '脑波', url: 'https://assets.mixkit.co/sfx/preview/mixkit-meditation-bowl-single-hit-2097.mp3' },
  { id: 'b2', title: 'Delta波', icon: '💤', category: '脑波', url: 'https://assets.mixkit.co/sfx/preview/mixkit-deep-hum-ambience-1262.mp3' },
  { id: 'b3', title: '白噪音', icon: '⚪', category: '脑波', url: 'https://assets.mixkit.co/sfx/preview/mixkit-white-noise-loop-1263.mp3' },
  { id: 'b4', title: '粉红噪音', icon: '🌸', category: '脑波', url: 'https://assets.mixkit.co/sfx/preview/mixkit-pink-noise-loop-1264.mp3' },
  { id: 'b5', title: '褐噪音', icon: '🟤', category: '脑波', url: 'https://assets.mixkit.co/sfx/preview/mixkit-brown-noise-loop-1265.mp3' },
];

type Tab = 'sleep' | 'stats' | 'discover' | 'profile';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('sleep');
  const [activeSounds, setActiveSounds] = useState<Map<string, number>>(new Map());
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [sleepState, setSleepState] = useState<SleepState>('IDLE');
  const [showCBTAlert, setShowCBTAlert] = useState(false);
  const howlsRef = useRef<Map<string, Howl>>(new Map());

  // Global click listener to unlock audio
  useEffect(() => {
    const unlock = () => {
      if (Howler.ctx && Howler.ctx.state === 'suspended') {
        Howler.ctx.resume().then(() => {
          console.log('AudioContext resumed via global click');
          setUserInteracted(true);
        });
      } else {
        setUserInteracted(true);
      }
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('click', unlock);
    window.addEventListener('touchstart', unlock);
    return () => {
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
    };
  }, []);

  // Audio Engine with Howler
  useEffect(() => {
    if (!isAuthReady) return;

    console.log('Audio Engine Update:', { isPlaying, userInteracted, activeSounds: Array.from(activeSounds.keys()) });

    // Global volume control
    Howler.volume(isPlaying ? 1 : 0);

    // Remove inactive sounds
    howlsRef.current.forEach((howl, id) => {
      if (!activeSounds.has(id)) {
        howl.stop();
        howl.unload();
        howlsRef.current.delete(id);
      }
    });

    // Add new sounds or update volumes
    activeSounds.forEach((volume, id) => {
      let howl = howlsRef.current.get(id);
      if (!howl) {
        const sound = SOUND_LIBRARY.find(s => s.id === id);
        if (sound && sound.url !== '#') {
          howl = new Howl({
            src: [sound.url],
            loop: true,
            volume: volume / 100,
            autoplay: false,
            html5: true, // Use HTML5 Audio for better CORS compatibility
            onload: () => console.log(`Howl loaded: ${id}`),
            onloaderror: (id, err) => console.error(`Howl load error for ${id}:`, err),
            onplayerror: (id, err) => {
              console.error(`Howl play error for ${id}:`, err);
              howl?.once('unlock', () => howl?.play());
            }
          });
          howlsRef.current.set(id, howl);
        }
      }
      
      if (howl) {
        howl.volume(volume / 100);
        if (isPlaying && userInteracted) {
          if (!howl.playing()) {
            console.log(`Attempting to play: ${id}`);
            howl.play();
          }
        } else {
          if (howl.playing()) {
            howl.pause();
          }
        }
      }
    });

    return () => {
      if (!isAuthReady) {
        howlsRef.current.forEach(howl => {
          howl.stop();
          howl.unload();
        });
        howlsRef.current.clear();
      }
    };
  }, [activeSounds, isPlaying, isAuthReady, userInteracted]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Sync data from Firestore on login
  useEffect(() => {
    if (!user || !isAuthReady) return;

    const userDocRef = doc(db, 'users', user.uid);
    
    // Initialize user doc if it doesn't exist
    const initUser = async () => {
      try {
        const snapshot = await getDoc(userDocRef);
        if (!snapshot.exists()) {
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            phoneNumber: user.phoneNumber,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            activeSounds: [],
            soundVolumes: {}
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
      }
    };
    initUser();

    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.activeSounds && data.soundVolumes) {
          const newActive = new Map<string, number>();
          data.activeSounds.forEach((id: string) => {
            newActive.set(id, data.soundVolumes[id] || 50);
          });
          setActiveSounds(newActive);
          setIsPlaying(newActive.size > 0);
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
    });

    return () => unsubscribe();
  }, [user, isAuthReady]);

  // Sync data to Firestore on change
  const syncToFirestore = useCallback(async (sounds: Map<string, number>) => {
    if (!user || !isAuthReady) return;

    const userDocRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userDocRef, {
        activeSounds: Array.from(sounds.keys()),
        soundVolumes: Object.fromEntries(sounds),
        lastUpdated: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  }, [user, isAuthReady]);

  // Simulate AI Sleep State changes
  useEffect(() => {
    if (!isPlaying || activeSounds.size === 0) {
      setSleepState('IDLE');
      setShowCBTAlert(false);
      return;
    }

    const states: SleepState[] = ['LATENCY', 'DEEP_SLEEP', 'SNORING', 'WAKE_UP_PHASE'];
    let index = 0;
    setSleepState(states[0]);

    const interval = setInterval(() => {
      index = (index + 1) % states.length;
      setSleepState(states[index]);
      if (states[index] === 'LATENCY' && Math.random() > 0.8) setShowCBTAlert(true);
      else setShowCBTAlert(false);
    }, 10000);

    return () => clearInterval(interval);
  }, [isPlaying, activeSounds.size]);

  const toggleSound = (sound: SoundElement) => {
    if (!userInteracted) {
      setUserInteracted(true);
      if (Howler.ctx && Howler.ctx.state === 'suspended') {
        Howler.ctx.resume();
      }
    }
    const newActive = new Map(activeSounds);
    if (newActive.has(sound.id)) {
      newActive.delete(sound.id);
    } else {
      if (newActive.size >= 5) return; // Limit to 5 layers
      newActive.set(sound.id, 50); // Default 50% volume
    }
    setActiveSounds(newActive);
    setIsPlaying(newActive.size > 0);
    syncToFirestore(newActive);
  };

  const updateVolume = (id: string, volume: number) => {
    const newActive = new Map(activeSounds);
    newActive.set(id, volume);
    setActiveSounds(newActive);
    syncToFirestore(newActive);
  };

  const removeSound = (id: string) => {
    const newActive = new Map(activeSounds);
    newActive.delete(id);
    setActiveSounds(newActive);
    setIsPlaying(newActive.size > 0);
    syncToFirestore(newActive);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setActiveSounds(new Map());
      setIsPlaying(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="atmosphere" />
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <Moon size={48} className="text-indigo-400/20" />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'stats': return <StatsView />;
      case 'discover': return <DiscoveryView />;
      case 'profile': return (
        <div className="flex flex-col items-center justify-center pt-20 space-y-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-indigo-500/20 p-1">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <User size={48} />
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg">
              <Sparkles size={18} className="text-white" />
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-serif font-light">{user.displayName || '睡眠探索者'}</h2>
            <p className="text-white/20 text-sm font-light tracking-widest uppercase">{user.email || user.phoneNumber || '未绑定联系方式'}</p>
          </div>

          <div className="w-full max-w-sm space-y-4">
            <div className="glass-panel p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400"><Moon size={20} /></div>
                <div>
                  <p className="text-xs text-white/20 uppercase tracking-widest">睡眠守护</p>
                  <p className="text-lg font-serif">128 天</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full py-4 bg-white/5 border border-white/5 rounded-full text-xs font-mono uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-500 transition-silky"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      );
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div className="glass-panel p-10 flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent animate-pulse" />
                </div>
                
                <div className="relative z-10 text-center space-y-6">
                  <div className="w-48 h-48 rounded-full border border-white/5 p-4 flex items-center justify-center relative">
                    <AnimatePresence>
                      {isPlaying && (
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1.2, opacity: 0.2 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-full bg-indigo-500"
                        />
                      )}
                    </AnimatePresence>
                    <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center">
                      {isPlaying ? <Music size={48} className="text-indigo-400 animate-bounce" /> : <Moon size={48} className="text-white/10" />}
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-serif font-light opacity-90">
                      {activeSounds.size > 0 ? `正在混音 (${activeSounds.size} 层)` : '选择声音开始混音'}
                    </h2>
                    <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] mt-2">
                      {isPlaying ? 'Acoustic Sanctuary Active' : 'System Standby'}
                    </p>
                  </div>

                  <button 
                    onClick={() => {
                      if (!userInteracted) {
                        setUserInteracted(true);
                        if (Howler.ctx && Howler.ctx.state === 'suspended') {
                          Howler.ctx.resume();
                        }
                      }
                      setIsPlaying(!isPlaying);
                    }}
                    disabled={activeSounds.size === 0}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-silky mx-auto ${
                      activeSounds.size === 0 ? 'opacity-20 cursor-not-allowed' : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {isPlaying ? <X size={24} /> : <SlidersHorizontal size={24} />}
                  </button>
                </div>
              </div>

              <MixerPanel 
                activeSounds={activeSounds} 
                soundLibrary={SOUND_LIBRARY} 
                onVolumeChange={updateVolume}
                onRemove={removeSound}
              />

              <AnimatePresence>
                {showCBTAlert && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="p-6 glass-panel border-indigo-500/20">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400"><Activity size={20} /></div>
                      <div className="flex-1">
                        <h4 className="font-serif text-lg mb-2">入睡困难？</h4>
                        <p className="text-sm text-white/40 leading-relaxed mb-6">AI 检测到您入睡时间较长，建议尝试“脑波同步”系列。</p>
                        <button onClick={() => setShowCBTAlert(false)} className="px-6 py-2 bg-indigo-500 text-white text-xs rounded-full">了解更多</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-10">
              <AISleepMonitor currentState={sleepState} />
              
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-serif font-light opacity-80">声学矩阵</h3>
                  <span className="text-[10px] text-white/20 font-mono tracking-widest uppercase">Max 5 Layers</span>
                </div>
                <CategoryGrid 
                  sounds={SOUND_LIBRARY} 
                  activeIds={Array.from(activeSounds.keys())}
                  onToggle={toggleSound}
                />
              </section>
            </div>
          </div>
        );
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen relative font-sans text-white pb-32">
        <div className="atmosphere" />
        
        <header className="flex items-center justify-between p-8 mb-4 max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-indigo-400 shadow-2xl">
              <Moon size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-light tracking-tight opacity-90">DeepSleep AI</h1>
              <p className="text-[9px] text-white/20 font-mono tracking-[0.3em] uppercase">Acoustic Sanctuary</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-white/20">
            <button className="hover:text-white/60 transition-silky"><Bell size={22} strokeWidth={1.5} /></button>
            <button className="hover:text-white/60 transition-silky"><Settings size={22} strokeWidth={1.5} /></button>
          </div>
        </header>

        <main className="px-8 max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        <nav className="fixed bottom-0 left-0 w-full glass-panel rounded-none border-t border-white/5 py-6 px-12 flex justify-between items-center z-50">
          <button onClick={() => setActiveTab('sleep')} className={`flex flex-col items-center gap-2 transition-silky ${activeTab === 'sleep' ? 'text-indigo-400' : 'text-white/10 hover:text-white/30'}`}>
            <Moon size={22} strokeWidth={1.5} /><span className="text-[9px] font-mono tracking-widest uppercase">Sleep</span>
          </button>
          <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center gap-2 transition-silky ${activeTab === 'stats' ? 'text-indigo-400' : 'text-white/10 hover:text-white/30'}`}>
            <Activity size={22} strokeWidth={1.5} /><span className="text-[9px] font-mono tracking-widest uppercase">Stats</span>
          </button>
          <button onClick={() => setActiveTab('discover')} className={`flex flex-col items-center gap-2 transition-silky ${activeTab === 'discover' ? 'text-indigo-400' : 'text-white/10 hover:text-white/30'}`}>
            <Search size={22} strokeWidth={1.5} /><span className="text-[9px] font-mono tracking-widest uppercase">Explore</span>
          </button>
          <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-2 transition-silky ${activeTab === 'profile' ? 'text-indigo-400' : 'text-white/10 hover:text-white/30'}`}>
            <User size={22} strokeWidth={1.5} /><span className="text-[9px] font-mono tracking-widest uppercase">Me</span>
          </button>
        </nav>
      </div>
    </ErrorBoundary>
  );
}
