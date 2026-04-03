import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, AtSign, Mail, Phone, MapPin, Lock, Train, Bus, Car, Footprints, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    city: "Mumbai, Maharashtra",
    password: "",
    confirm: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [prefs, setPrefs] = useState<string[]>(['metro', 'bus']);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    let newErrors: Record<string, string> = {};
    if (!formData.name || formData.name.length < 2) newErrors.name = "Name is required";
    if (!formData.username || formData.username.length < 3 || formData.username.includes(" ")) newErrors.username = "Valid username required (no spaces)";
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Valid email required";
    if (!formData.password || formData.password.length < 8) newErrors.password = "Min 8 characters required";
    if (formData.password !== formData.confirm) newErrors.confirm = "Passwords must match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = () => {
    // Optionally trigger validation on blur
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500));
    
    signup({
      name: formData.name,
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      transportPrefs: prefs
    });
    
    navigate("/dashboard");
  };

  const togglePref = (mode: string) => {
    setPrefs(p => p.includes(mode) ? p.filter(x => x !== mode) : [...p, mode]);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex font-sans w-full">
      {/* Left Column - Brand Panel */}
      <div className="hidden lg:flex w-1/2 bg-[#1b3a2a] rounded-r-[40px] flex-col items-center justify-center p-12 relative overflow-hidden">
        <motion.div 
           animate={{ y: [0, -15, 0] }} 
           transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" 
        />
        <motion.div 
           animate={{ y: [0, 15, 0] }} 
           transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
           className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" 
        />
        
        <div className="absolute top-12 left-12 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
            <Train size={20} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">FlowCity</span>
        </div>

        <div className="w-full max-w-sm mt-8 z-10">
           <div className="bg-white/10 backdrop-blur-md rounded-[28px] p-8 border border-white/15 shadow-2xl relative overflow-hidden">
             <div className="bg-white/20 px-3 py-1.5 rounded-xl text-xs font-bold text-white inline-block mb-6 uppercase tracking-wider">Live Route</div>
             <div className="flex items-end justify-between mb-8">
               <div>
                 <p className="text-xl font-bold tracking-tight text-white">Andheri → BKC</p>
                 <p className="text-white/60 font-medium text-sm mt-1">Recommended Route</p>
               </div>
               <p className="text-3xl font-bold text-white">28 <span className="text-sm">min</span></p>
             </div>
             <div className="h-2.5 bg-white/10 rounded-full w-full overflow-hidden flex gap-1 mb-6">
                <div className="bg-blue-400 h-full w-[60%] rounded-full" />
                <div className="bg-amber-400 h-full w-[30%] rounded-full" />
                <div className="bg-emerald-400 h-full w-[10%] rounded-full" />
             </div>
             <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-emerald-50 font-bold text-sm">Confidence Score</span>
                <span className="text-emerald-400 font-bold text-lg">87%</span>
             </div>
           </div>
        </div>

        <div className="absolute bottom-12 left-12 right-12 flex items-center justify-between z-10">
          <p className="text-white/70 font-medium text-sm">Join 12,000+ commuters</p>
          <div className="flex -space-x-3">
             <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-[#1b3a2a] flex items-center justify-center font-bold text-blue-700 text-xs">AK</div>
             <div className="w-10 h-10 rounded-full bg-amber-100 border-2 border-[#1b3a2a] flex items-center justify-center font-bold text-amber-700 text-xs">SR</div>
             <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-[#1b3a2a] flex items-center justify-center font-bold text-emerald-700 text-xs">PM</div>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 h-screen overflow-y-auto hide-scrollbar">
        <div className="max-w-[480px] w-full mt-10 md:mt-0">
          <div className="mb-6 lg:mb-8 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create your account</h1>
            <p className="text-sm text-gray-500 font-medium mt-2">Start your smarter commute today</p>
          </div>

          <motion.form 
            variants={stagger} initial="hidden" animate="show"
            onSubmit={handleSubmit}
            className="bg-white rounded-[28px] p-8 shadow-sm border border-gray-100 w-full"
          >
            <div className="space-y-4">
              <motion.div variants={fadeUp}>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={2.5} />
                  <input type="text" className={`w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border ${errors.name ? 'border-red-300' : 'border-gray-200'} text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all`} placeholder="Rohan Acharya" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} onBlur={handleBlur} />
                </div>
                {errors.name && <p className="text-xs text-red-500 font-medium mt-1.5 px-1">{errors.name}</p>}
              </motion.div>

              <motion.div variants={fadeUp}>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Username</label>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={2.5} />
                  <input type="text" className={`w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border ${errors.username ? 'border-red-300' : 'border-gray-200'} text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all`} placeholder="rohan_acharya" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value.toLowerCase()})} />
                </div>
                {errors.username && <p className="text-xs text-red-500 font-medium mt-1.5 px-1">{errors.username}</p>}
              </motion.div>

              <motion.div variants={fadeUp}>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={2.5} />
                  <input type="email" className={`w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border ${errors.email ? 'border-red-300' : 'border-gray-200'} text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all`} placeholder="rohan@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                {errors.email && <p className="text-xs text-red-500 font-medium mt-1.5 px-1">{errors.email}</p>}
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div variants={fadeUp}>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={2.5} />
                    <input type="tel" className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all" placeholder="+91 98765 43210" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </motion.div>
                <motion.div variants={fadeUp}>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={2.5} />
                    <input type="text" className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all" placeholder="Mumbai" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                  </div>
                </motion.div>
              </div>

              <motion.div variants={fadeUp}>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={2.5} />
                  <input type={showPassword ? "text" : "password"} className={`w-full pl-12 pr-12 py-3 bg-gray-50 rounded-2xl border ${errors.password ? 'border-red-300' : 'border-gray-200'} text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all`} placeholder="Min 8 characters" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 font-medium mt-1.5 px-1">{errors.password}</p>}
              </motion.div>
              
              <motion.div variants={fadeUp}>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={2.5} />
                  <input type={showPassword ? "text" : "password"} className={`w-full pl-12 pr-12 py-3 bg-gray-50 rounded-2xl border ${errors.confirm ? 'border-red-300' : 'border-gray-200'} text-sm font-medium text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all`} placeholder="Re-enter password" value={formData.confirm} onChange={e => setFormData({...formData, confirm: e.target.value})} />
                </div>
                {errors.confirm && <p className="text-xs text-red-500 font-medium mt-1.5 px-1">{errors.confirm}</p>}
              </motion.div>

              <motion.div variants={fadeUp} className="pt-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Preferred Transport</label>
                <div className="flex gap-2 w-full">
                  {[
                    { id: 'metro', icon: Train, label: 'Metro' },
                    { id: 'bus', icon: Bus, label: 'Bus' },
                    { id: 'auto', icon: Car, label: 'Auto' },
                    { id: 'walk', icon: Footprints, label: 'Walk' }
                  ].map(m => {
                    const active = prefs.includes(m.id);
                    return (
                      <button key={m.id} type="button" onClick={() => togglePref(m.id)}
                        className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl border transition-colors ${active ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100'}`}>
                        <m.icon size={18} strokeWidth={2.5} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              <motion.label variants={fadeUp} className="flex items-start gap-3 mt-4 pt-2 cursor-pointer">
                <input type="checkbox" required className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#1b3a2a] focus:ring-[#1b3a2a] accent-[#1b3a2a]" />
                <span className="text-xs text-gray-500 font-medium leading-relaxed">
                  I agree to the <a href="#" className="text-[#1b3a2a] font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-[#1b3a2a] font-bold hover:underline">Privacy Policy</a>
                </span>
              </motion.label>

              <motion.button variants={fadeUp} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className="w-full mt-4 bg-[#1b3a2a] text-white rounded-2xl py-4 font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70 transition-all">
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>Create Account <ArrowRight size={18} /></>}
              </motion.button>
              
              <motion.div variants={fadeUp} className="relative py-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <div className="relative bg-white px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">or continue with</div>
              </motion.div>

              <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
                <button type="button" className="w-full flex items-center justify-center gap-2 bg-white rounded-2xl py-3.5 border border-gray-200 font-bold text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                  Google
                </button>
                <button type="button" className="w-full flex items-center justify-center gap-2 bg-white rounded-2xl py-3.5 border border-gray-200 font-bold text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                  GitHub
                </button>
              </motion.div>
            </div>
          </motion.form>

          <p className="text-center text-sm font-medium text-gray-500 mt-8 mb-8 pb-8">
            Already have an account? <Link to="/login" className="text-[#1b3a2a] font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
