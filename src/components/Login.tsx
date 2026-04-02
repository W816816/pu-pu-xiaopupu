import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, LogIn, Sparkles, Loader2, Mail, Phone, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from '../firebase';
import { ConfirmationResult } from 'firebase/auth';

type LoginMethod = 'phone' | 'wechat';

export const Login: React.FC = () => {
  const [method, setMethod] = useState<LoginMethod>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Phone state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    if (method === 'phone' && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  }, [method]);

  const handleSendCode = async () => {
    if (!phoneNumber) return;
    setLoading(true);
    setError(null);
    try {
      const appVerifier = window.recaptchaVerifier;
      const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+86${phoneNumber.trim()}`;
      const result = await signInWithPhoneNumber(auth, formattedNumber, appVerifier);
      setConfirmationResult(result);
    } catch (err: any) {
      console.error('SMS error detail:', err);
      let msg = '发送验证码失败';
      if (err.code === 'auth/invalid-phone-number') msg = '手机号格式不正确';
      else if (err.code === 'auth/quota-exceeded') msg = '短信额度已用完，请明天再试';
      else if (err.code === 'auth/captcha-check-failed') msg = '人机验证失败，请刷新页面';
      else if (err.code === 'auth/too-many-requests') msg = '请求过于频繁，请稍后再试';
      else if (err.code === 'auth/api-key-not-valid') msg = 'Firebase API 密钥无效，请检查配置';
      else if (err.code === 'auth/unauthorized-domain') msg = '当前域名未在 Firebase 控制台授权';
      
      setError(`${msg} (${err.code || 'unknown'})`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult || !verificationCode) return;
    setLoading(true);
    setError(null);
    try {
      await confirmationResult.confirm(verificationCode);
    } catch (err: any) {
      console.error('Verification error:', err);
      setError('验证码错误');
    } finally {
      setLoading(false);
    }
  };

  const handleWeChatLogin = () => {
    setError('微信登录需要企业认证的公众号，目前处于测试阶段。请优先使用手机号登录。');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="atmosphere" />
      <div id="recaptcha-container"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-10 max-w-md w-full text-center space-y-8 relative z-10"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-2xl animate-float">
            <Moon size={32} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-light tracking-tight opacity-90">DeepSleep AI</h1>
            <p className="text-[9px] text-white/20 font-mono tracking-[0.4em] uppercase mt-1">Acoustic Sanctuary</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/5 p-1 rounded-full border border-white/5">
          {(['phone', 'wechat'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMethod(m); setError(null); }}
              className={`flex-1 py-2 rounded-full text-[10px] uppercase tracking-widest transition-all duration-300 ${
                method === m ? 'bg-white text-black font-medium shadow-lg' : 'text-white/40 hover:text-white/60'
              }`}
            >
              {m === 'phone' ? '手机号登录' : '微信登录'}
            </button>
          ))}
        </div>

        <div className="min-h-[200px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {method === 'phone' && (
              <motion.form 
                key="phone"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={confirmationResult ? handleVerifyCode : (e) => e.preventDefault()}
                className="space-y-4"
              >
                {!confirmationResult ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                      <input 
                        type="tel"
                        placeholder="请输入手机号"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={handleSendCode}
                      disabled={loading || !phoneNumber}
                      className="w-full py-4 bg-white text-black rounded-full font-medium flex items-center justify-center gap-3 hover:bg-white/90 transition-silky disabled:opacity-50"
                    >
                      {loading ? <Loader2 size={20} className="animate-spin" /> : <>获取验证码 <ArrowRight size={16} /></>}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                      <input 
                        type="text"
                        placeholder="请输入验证码"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={loading || !verificationCode}
                      className="w-full py-4 bg-indigo-500 text-white rounded-full font-medium flex items-center justify-center gap-3 hover:bg-indigo-600 transition-silky disabled:opacity-50"
                    >
                      {loading ? <Loader2 size={20} className="animate-spin" /> : '立即登录'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setConfirmationResult(null)}
                      className="text-[10px] text-white/20 uppercase tracking-widest hover:text-white/40"
                    >
                      返回修改手机号
                    </button>
                  </div>
                )}
              </motion.form>
            )}

            {method === 'wechat' && (
              <motion.div 
                key="wechat"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6 flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <MessageCircle size={40} />
                </div>
                <p className="text-xs text-white/40 font-light">点击下方按钮使用微信快捷登录</p>
                <button 
                  onClick={handleWeChatLogin}
                  className="w-full py-4 bg-[#07C160] text-white rounded-full font-medium flex items-center justify-center gap-3 hover:bg-[#06AD56] transition-silky"
                >
                  <MessageCircle size={20} />
                  <span>微信一键登录</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <p className="text-xs text-rose-500 font-light">{error}</p>
        )}

        <div className="pt-6 border-t border-white/5 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-[9px] text-white/10 uppercase tracking-widest">
            <Sparkles size={12} />
            <span>AI Powered Sleep Science</span>
          </div>
          
          <div className="bg-white/5 rounded-xl p-3 border border-white/5 w-full">
            <p className="text-[10px] text-white/40 leading-relaxed">
              💡 提示：点击浏览器菜单中的“添加到主屏幕”，即可像安装包一样在手机桌面直接打开应用。
            </p>
          </div>
        </div>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
};

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}
