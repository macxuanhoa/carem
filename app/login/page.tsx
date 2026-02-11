'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useActionState, useState, useEffect } from 'react';
import { authenticate } from '@/app/lib/actions';
import { Lock, User, Loader2, AlertCircle, Eye, EyeOff, ShieldCheck, Phone, MapPin } from 'lucide-react';
import { LazyMotion, domAnimation, m, AnimatePresence, useAnimation } from 'framer-motion';
import Image from 'next/image';
import logoImg from '../assets/logo.jpg';

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const controls = useAnimation();

  // Reset dirty state when error message changes (new submission)
  useEffect(() => {
    setIsDirty(false);
    if (errorMessage) {
        controls.start({ 
            x: [0, -10, 10, -10, 10, 0],
            transition: { duration: 0.4, ease: "easeInOut" }
        });
    }
  }, [errorMessage, controls]);

  const handleInputChange = () => {
    if (errorMessage && !isDirty) {
        setIsDirty(true);
    }
  };

  // Prevent scroll bounce on mobile
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
        document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="flex min-h-dvh w-full items-start md:items-center justify-center bg-[#f8fafc] p-2 pt-4 md:p-4 font-sans relative overflow-y-auto selection:bg-blue-100 selection:text-blue-900">
      
      {/* Background Pattern - Modern Grid with Vignette */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
          <div className="absolute inset-0 bg-galaxy-gradient opacity-20" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-5" />
      </div>

      <LazyMotion features={domAnimation}>
      <m.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[400px] relative z-20 flex flex-col items-center justify-center"
      >
          {/* MAIN LOGIN CARD */}
          <m.div 
            animate={controls}
            className="bg-slate-900/60 backdrop-blur-2xl w-full rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.5)] border border-white/10 p-6 sm:p-8 relative overflow-hidden flex flex-col justify-center ring-1 ring-white/5"
          >
            
            {/* Header: Logo & System Name */}
            <div className="flex flex-col items-center mb-6 sm:mb-8">
                <m.div 
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative mb-4 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl shadow-2xl ring-2 ring-white/20 overflow-hidden bg-black"
                >
                     <Image 
                        src={logoImg}
                        alt="Logo Cà Rem" 
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 80px, 96px"
                        priority
                        placeholder="blur"
                    />
                </m.div>
                <h1 className="text-2xl font-black text-white uppercase tracking-tighter text-center leading-none max-w-[300px] mb-2">
                    XE MÁY <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-fuchsia-400">CÀ REM</span>
                </h1>
                <div className="flex flex-col items-center gap-1">
                    <span className="bg-white/5 text-violet-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 shadow-sm backdrop-blur-md">
                        Premium Dashboard
                    </span>
                </div>
            </div>

            {/* FORM SECTION */}
            <form action={formAction} className="space-y-4">
                <div className="space-y-3">
                    {/* Username */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider ml-1">Tài khoản</label>
                        <div className={`relative group transition-all duration-300 ${focusedInput === 'username' ? 'scale-[1.01]' : ''}`}>
                            <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10 transition-colors duration-300 ${focusedInput === 'username' ? 'text-violet-400' : 'text-slate-500'}`}>
                                <User size={18} strokeWidth={2.5} />
                            </div>
                            <Input
                                name="username"
                                type="text"
                                required
                                placeholder="Nhập tài khoản"
                                onFocus={() => setFocusedInput('username')}
                                onBlur={() => setFocusedInput(null)}
                                onChange={handleInputChange}
                                className={`pl-10 h-11 bg-slate-950/50 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-violet-500/50 focus-visible:border-violet-500/50 transition-all ${
                                    focusedInput === 'username' ? 'shadow-[0_0_20px_rgba(139,92,246,0.15)]' : ''
                                } ${errorMessage && !isDirty ? 'border-red-500/50 ring-1 ring-red-500/20' : ''}`}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider ml-1">Mật khẩu</label>
                        <div className={`relative group transition-all duration-300 ${focusedInput === 'password' ? 'scale-[1.01]' : ''}`}>
                            <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10 transition-colors duration-300 ${focusedInput === 'password' ? 'text-violet-400' : 'text-slate-500'}`}>
                                <Lock size={18} strokeWidth={2.5} />
                            </div>
                            <Input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="••••••••"
                                onFocus={() => setFocusedInput('password')}
                                onBlur={() => setFocusedInput(null)}
                                onChange={handleInputChange}
                                className={`pl-10 pr-10 h-11 bg-slate-950/50 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-violet-500/50 focus-visible:border-violet-500/50 transition-all ${
                                    focusedInput === 'password' ? 'shadow-[0_0_20px_rgba(139,92,246,0.15)]' : ''
                                } ${errorMessage && !isDirty ? 'border-red-500/50 ring-1 ring-red-500/20' : ''}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-violet-400 transition-colors z-10"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {errorMessage && !isDirty && (
                        <m.div 
                            initial={{ opacity: 0, height: 0, scale: 0.95 }}
                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.95 }}
                            className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-xs text-red-200 font-medium shadow-sm backdrop-blur-md"
                        >
                            <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
                            <span>{errorMessage}</span>
                        </m.div>
                    )}
                </AnimatePresence>

                <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-11 mt-4 bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 text-xs uppercase tracking-widest transition-all active:scale-[0.98]"
                >
                    {isPending ? (
                        <>
                            <Loader2 size={18} className="animate-spin text-white/90 mr-2" />
                            <span>Đang xử lý...</span>
                        </>
                    ) : (
                        <>
                            <span>Đăng Nhập</span>
                            <m.div 
                                animate={{ x: [0, 4, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 3 }}
                            >
                                <ShieldCheck size={16} className="ml-2 text-white/80 group-hover:text-white transition-colors" />
                            </m.div>
                        </>
                    )}
                </Button>
            </form>
            
            {/* Footer - Technical */}
            <div className="mt-6 pt-6 border-t border-white/5 w-full">
                 <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-center gap-2 text-xs font-medium bg-white/5 px-4 py-2 rounded-lg border border-white/5 text-slate-400">
                        <Phone size={14} className="text-violet-400" />
                        <span>Hotline: <span className="font-bold text-white">0914.92.92.92</span></span>
                    </div>
                 </div>
            </div>

          </m.div>
          
          {/* Bottom Copyright */}
          <div className="text-center mt-6">
             <p className="text-[10px] text-slate-600 font-medium flex items-center gap-1.5 justify-center">
                <span>&copy; 2026 Cà Rem System.</span>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                <span>v2.0 Galaxy Edition</span>
             </p>
          </div>
      </m.div>
      </LazyMotion>
    </div>
  );
}
