import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { getDashboardSummary } from '../api/dashboard.api';
import Skeleton from '../components/common/Skeleton';
import PremiumThemePortalToggle from '../components/common/PremiumThemePortalToggle';
import AnimatedBrain3D from '../components/common/AnimatedBrain3D';
import AnimatedProjectBackground from '../components/common/AnimatedProjectBackground';
import ThemeTransitionOverlay from '../components/common/ThemeTransitionOverlay';

const NavItem = ({ icon, label, active, onClick, fixedColor }) => (
  <div
    onClick={onClick}
    className={`relative flex items-center gap-4 px-8 py-4 cursor-pointer transition-all duration-500 group overflow-hidden ${
      active 
        ? fixedColor ? 'bg-white/10' : 'bg-gradient-to-r from-[var(--fx-primary)]/10 to-transparent' 
        : fixedColor ? 'text-white/50 hover:bg-white/5' : 'text-slate-500 hover:bg-white/5'
    } rounded-xl mx-2`}
  >
    {/* Sidebar Vertical Light Strip */}
    {active && (
      <div className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full shadow-[0_0_15px_rgba(34,211,238,0.6)] ${
        fixedColor ? 'bg-cyan-400' : 'bg-gradient-to-b from-[var(--fx-primary)] via-[var(--fx-accent)] to-[var(--fx-primary)]'
      }`} />
    )}
    
    <div className={`transition-all duration-500 ${
      active 
        ? fixedColor ? 'text-cyan-400 scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]' : 'text-[var(--fx-primary)] scale-110 drop-shadow-[0_0_8px_var(--fx-primary)]' 
        : fixedColor ? 'text-white/40 group-hover:text-white group-hover:scale-105' : 'text-slate-400 group-hover:text-slate-100 group-hover:scale-105'
    }`}>
      {icon}
    </div>
    <span className={`text-sm font-black tracking-widest uppercase transition-colors ${
      active 
        ? 'text-white' 
        : fixedColor ? 'text-white/60 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-300'
    }`}>
      {label}
    </span>

    {/* Subtle Glow on Hover */}
    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
  </div>
);

const CountUp = ({ value, duration = 1500 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;
    let totalMiliseconds = duration;
    let incrementTime = (totalMiliseconds / end);
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span className="font-black tabular-nums">{count}</span>;
};

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches));
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [portalFlash, setPortalFlash] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await getDashboardSummary();
        if (response.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const toggleTheme = () => {
    setPortalFlash(true);
    setTimeout(() => {
      setIsDark(!isDark);
    }, 100); 
    setTimeout(() => {
      setPortalFlash(false);
    }, 400);
  };

  const stats = data?.stats || { documents: 0, chats: 0, queries: 0 };
  const workspace = data?.workspace || { aiAccuracy: 0, knowledgeBaseUtilization: 0 };
  const recentActivity = data?.recentActivity || [];

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden font-sans select-none relative">
      <ThemeTransitionOverlay isDark={isDark} />
      <AnimatedProjectBackground variant="dashboard" />
      {portalFlash && <div className="fixed inset-0 z-[9999] portal-flash pointer-events-none" />}

      <aside className="w-72 flex-shrink-0 bg-[#1e1b4b] border-r border-white/5 flex flex-col z-[60] transition-none">
        <div className="p-10 flex items-center justify-center gap-4 group cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="relative">
             <div className="absolute -inset-3 bg-cyan-500/10 rounded-full blur-2xl animate-pulse" />
             <svg className="w-11 h-11 animate-neural-pulse relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21C12 21 4 18 4 11C4 4 12 2 12 2C12 2 20 4 20 11C20 18 12 21 12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 21V11M12 11L4 11M12 11L20 11M12 2V11" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2"/>
                <path d="M9 7C9 7 10 5 12 5C14 5 15 7 15 7M9 15C9 15 10 17 12 17C14 17 15 15 15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="11" r="3" fill="currentColor" fillOpacity="0.2" />
                <circle cx="12" cy="11" r="1" fill="white" />
             </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-white">DocuBrain</h1>
        </div>

        <nav className="flex-1 mt-2 space-y-2 overflow-y-auto no-scrollbar px-4">
          <NavItem active={location.pathname === '/dashboard'} label="Dashboard" fixedColor onClick={() => navigate('/dashboard')} icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          } />
          <NavItem active={location.pathname.startsWith('/chat')} label="AI Chat" fixedColor onClick={() => navigate('/chat')} icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          } />
          <NavItem active={location.pathname === '/knowledge'} label="Knowledge" fixedColor onClick={() => navigate('/knowledge')} icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          } />
          <NavItem active={location.pathname === '/analytics'} label="Analytics" fixedColor onClick={() => navigate('/analytics')} icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
          } />
        </nav>

        <div className="p-8 border-t border-white/5">
          <div className="group relative bg-white/5 rounded-2xl p-5 cursor-pointer overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:bg-white/10" onClick={() => navigate('/settings')}>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-4 relative z-10">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-lg animate-float-slow">
                 {(user?.full_name || 'U')[0].toUpperCase()}
               </div>
               <div className="flex-1 overflow-hidden">
                 <p className="font-black text-sm tracking-tight truncate text-white">{user?.full_name || 'Enterprise User'}</p>
                 <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest truncate">{user?.email}</p>
               </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="h-20 flex-shrink-0 flex items-center justify-between px-8 bg-transparent border-b border-white/5 backdrop-blur-2xl">
          <div className="flex-1 max-w-2xl relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-[var(--fx-primary)] to-[var(--fx-accent)] rounded-2xl blur opacity-0 group-focus-within:opacity-20 transition-all duration-700" />
             <div className="relative flex items-center bg-white/5 dark:bg-black/20 border border-white/10 rounded-2xl overflow-hidden focus-within:border-[var(--fx-accent)]/30 transition-all">
                <svg className="ml-5 w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-[var(--fx-accent)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  type="text"
                  placeholder="Ask intelligence search..."
                  className="w-full bg-transparent border-none py-4 px-5 text-sm font-bold outline-none placeholder:text-[var(--text-secondary)] text-[var(--text-primary)]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="mr-5 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black text-[var(--text-secondary)] tracking-tighter uppercase">CTRL + /</div>
             </div>
          </div>

          <div className="flex items-center gap-10">
             <PremiumThemePortalToggle isDark={isDark} onToggle={toggleTheme} />
             <div className="relative group cursor-pointer" onClick={() => setShowNotifications(!showNotifications)}>
                <div className="absolute -inset-2 bg-[var(--fx-primary)] rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
                <svg className="w-7 h-7 text-[var(--text-secondary)] group-hover:text-[var(--fx-primary)] transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[var(--fx-primary)] rounded-full border-2 border-[var(--bg-primary)] shadow-[0_0_10px_var(--fx-primary)]"></span>
             </div>
             <button onClick={logout} className="group relative px-8 py-3 rounded-2xl border border-white/10 bg-white/5 font-black text-xs uppercase tracking-widest overflow-hidden hover:border-[var(--fx-primary)]/50 transition-all text-[var(--text-primary)]">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--fx-primary)] to-[var(--fx-accent)] opacity-0 group-hover:opacity-10 transition-opacity" />
                <span className="relative z-10 group-hover:text-[var(--fx-primary)] transition-colors">Sign Out</span>
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 no-scrollbar custom-scrollbar">
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-1000">
            <h1 className="text-4xl font-black tracking-tighter mb-3 text-[var(--text-primary)]">
              Intelligence <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--fx-primary)] via-[var(--fx-accent)] to-[var(--fx-primary)]">Dashboard</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] font-bold max-w-2xl">
              Verified access to enterprise RAG systems. Monitor document ingestion and semantic search accuracy in real-time.
            </p>
          </div>

          <div className="dashboard-grid mb-16">
            <div className="dashboard-card dashboard-animated-border group rounded-[48px] overflow-hidden cursor-pointer" onClick={() => navigate('/chat')}>
                <div className="relative z-10 flex flex-col h-full p-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--fx-primary)]/20 to-transparent border border-white/5 flex items-center justify-center text-[var(--fx-primary)] mb-6 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                  </div>
                  <h2 className="text-2xl font-black tracking-tight mb-4 group-hover:translate-x-2 transition-transform duration-500 text-[var(--text-primary)]">DocuBrain <br/>AI Chat</h2>
                  <p className="text-base text-[var(--text-secondary)] font-medium leading-relaxed max-w-[240px] mb-8">
                    Interact with enterprise knowledge via specialized RAG pipelines. Verified contextual accuracy.
                  </p>
                  <div className="mt-auto">
                     <span className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[var(--fx-primary)] text-white font-black text-sm shadow-2xl shadow-[var(--fx-primary)]/20 hover:scale-105 transition-all">
                        Initialize Session <span className="animate-pulse">→</span>
                     </span>
                  </div>
               </div>
               <div className="absolute right-0 bottom-0 w-1/2 h-full pointer-events-none flex items-center justify-center translate-y-10 group-hover:translate-y-0 transition-transform duration-1000 scale-75 origin-bottom-right opacity-80 group-hover:opacity-100">
                  <div className="relative w-64 h-64">
                     <div className="absolute inset-0 bg-gradient-to-br from-[var(--fx-primary)] to-[var(--fx-accent)] rounded-[60px] shadow-2xl animate-float-slow" style={{ perspective: '1000px' }}>
                        <div className="absolute top-6 left-6 right-6 h-28 bg-slate-900/90 rounded-[40px] border border-white/10 flex items-center justify-center gap-4">
                           <div className="w-5 h-5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                           <div className="w-5 h-5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(34,211,238,0.8)]" style={{ animationDelay: '0.5s' }} />
                        </div>
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-white/10 rounded-full" />
                     </div>
                  </div>
               </div>
            </div>

            <div className="dashboard-card dashboard-animated-border border-reverse group rounded-[32px] overflow-hidden cursor-pointer" onClick={() => navigate('/knowledge')}>
               <div className="relative z-10 flex flex-col h-full p-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--fx-accent)]/20 to-transparent border border-white/5 flex items-center justify-center text-[var(--fx-accent)] mb-6 shadow-inner group-hover:scale-110 group-hover:rotate-[-6deg] transition-transform duration-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                  <h2 className="text-2xl font-black tracking-tight mb-4 group-hover:translate-x-2 transition-transform duration-500 text-[var(--text-primary)]">Knowledge <br/>Management</h2>
                  <p className="text-base text-[var(--text-secondary)] font-medium leading-relaxed max-w-[240px] mb-8">
                    Build your semantic database. Document ingestion and vector space optimization.
                  </p>
                  <div className="mt-auto">
                     <span className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[var(--fx-accent)] text-white font-black text-sm shadow-2xl shadow-[var(--fx-accent)]/20 hover:scale-105 transition-all">
                        Scale Knowledge <span className="animate-pulse">→</span>
                     </span>
                  </div>
               </div>
               <div className="absolute right-[-20px] bottom-[-20px] w-1/2 h-full pointer-events-none flex items-center justify-center opacity-70 group-hover:opacity-100 transition-all duration-1000 scale-75 origin-bottom-right">
                  <div className="relative w-64 h-64 translate-y-10 group-hover:translate-y-0 group-hover:rotate-6 transition-all duration-1000">
                     {[0, 1, 2].map(i => (
                        <div 
                          key={i} 
                          className="absolute bg-white/95 dark:bg-slate-800 rounded-3xl shadow-2xl border border-white/10" 
                          style={{ 
                            width: '180px', height: '240px', 
                            top: `${i * 15}px`, left: `${i * 20}px`,
                            zIndex: 10 - i,
                            transform: `rotateX(45deg) rotateZ(-15deg)`
                          }}
                        >
                           <div className="p-6 space-y-3">
                              <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
                              <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-700/50 rounded-full" />
                              <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-700/50 rounded-full" />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>

          <div className="dashboard-animated-border rounded-[32px] p-8 flex flex-wrap items-center justify-between gap-8 mb-12 relative overflow-hidden animate-in slide-in-from-bottom-2 duration-1000" style={{ animationDelay: '0.4s' }}>
             <div className="flex items-center gap-6 relative z-10">
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--fx-primary)] to-[var(--fx-accent)] flex items-center justify-center text-white font-black text-2xl shadow-2xl animate-float-slow">
                 {(user?.full_name || 'E')[0].toUpperCase()}
               </div>
               <div>
                 <h3 className="text-xl font-black tracking-tight mb-0.5 text-[var(--text-primary)]">{user?.full_name || 'Enterprise Analyst'}</h3>
                 <p className="text-sm text-[var(--text-secondary)] font-bold uppercase tracking-[0.2em]">{user?.email}</p>
                 <div className="mt-4 inline-flex items-center gap-2.5 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Active System Connection</span>
                 </div>
               </div>
             </div>
             <div className="flex items-center gap-12 relative z-10">
               <div className="group text-center">
                  <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-2 group-hover:text-[var(--fx-primary)] transition-colors opacity-60">Documents</p>
                  <div className="text-3xl font-black tabular-nums text-[var(--text-primary)]">
                    {isLoading ? <Skeleton className="w-12 h-8 mx-auto" /> : <CountUp value={stats.documents} />}
                  </div>
               </div>
               <div className="w-px h-10 bg-white/10" />
               <div className="group text-center">
                  <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-2 group-hover:text-[var(--fx-accent)] transition-colors opacity-60">AI Chats</p>
                  <div className="text-3xl font-black tabular-nums text-[var(--text-primary)]">
                    {isLoading ? <Skeleton className="w-12 h-8 mx-auto" /> : <CountUp value={stats.chats} />}
                  </div>
               </div>
               <div className="w-px h-10 bg-white/10" />
               <div className="group text-center">
                  <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-2 group-hover:text-[var(--fx-primary)] transition-colors opacity-60">Queries</p>
                  <div className="text-3xl font-black tabular-nums text-[var(--text-primary)]">
                    {isLoading ? <Skeleton className="w-12 h-8 mx-auto" /> : <CountUp value={stats.queries} />}
                  </div>
               </div>
             </div>
          </div>

          <div className="dashboard-grid items-start">
             <div className="dashboard-card dashboard-animated-border border-reverse rounded-[32px] overflow-hidden animate-in slide-in-from-bottom-2 duration-1000" style={{ animationDelay: '0.6s' }}>
                <div className="relative z-10 flex flex-col h-full p-10">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-black tracking-tight flex items-center gap-3 text-[var(--text-primary)]">
                         <span className="w-1.5 h-6 bg-[var(--fx-primary)] rounded-full" />
                         Recent Activity
                      </h3>
                      <button onClick={() => navigate('/knowledge')} className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--fx-primary)] transition-colors opacity-60">Audit All</button>
                   </div>
                   <div className="space-y-6">
                      {recentActivity.length > 0 ? recentActivity.map((item, i) => (
                         <div key={i} className="group flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/10 transition-all duration-500">
                            <div className="flex items-center gap-5">
                               <div className="w-12 h-12 rounded-2xl bg-white/5 dark:bg-black/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <svg className="w-6 h-6 text-red-500/80 group-hover:text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                               </div>
                               <div className="overflow-hidden">
                                  <p className="font-bold text-sm truncate max-w-[200px] mb-1 text-[var(--text-primary)]">{item.title}</p>
                                  <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest">{item.subtitle}</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-6">
                               <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                                  item.status === 'Processed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                  item.status === 'Processing' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                  'bg-red-500/10 text-red-500 border-red-500/20'
                               }`}>{item.status}</span>
                            </div>
                         </div>
                      )) : (
                         <div className="py-20 text-center opacity-40">
                            <p className="text-sm font-black uppercase tracking-[0.4em]">Intelligence Logs Clear</p>
                         </div>
                      )}
                   </div>
                </div>
             </div>

             <div className="dashboard-card dashboard-animated-border rounded-[32px] overflow-hidden relative animate-in slide-in-from-bottom-2 duration-1000" style={{ animationDelay: '0.8s' }}>
                <div className="relative z-10 flex flex-col h-full p-10">
                   <div className="flex items-center gap-3 mb-8">
                      <div className="w-1.5 h-6 bg-[var(--fx-accent)] rounded-full shadow-[0_0_15px_var(--fx-accent)]" />
                      <h3 className="text-xl font-black tracking-tight uppercase text-[var(--text-primary)]">Intelligence Health</h3>
                   </div>
                   <div className="space-y-10 mb-16">
                      <div className="space-y-4 group">
                         <div className="flex justify-between text-xs font-black uppercase tracking-[0.3em] mb-2">
                            <span className="text-slate-400 group-hover:text-[var(--fx-primary)] transition-colors">Semantic Accuracy</span>
                            <span className="text-[var(--fx-primary)] font-bold">{workspace.aiAccuracy}%</span>
                         </div>
                         <div className="h-2.5 w-full bg-white/5 dark:bg-black/20 rounded-full overflow-hidden border border-white/5 p-[1px]">
                            <div className="h-full bg-gradient-to-r from-[var(--fx-primary)] to-[var(--fx-accent)] rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_var(--fx-primary)]" style={{ width: `${workspace.aiAccuracy}%` }}></div>
                         </div>
                      </div>
                      <div className="space-y-4 group">
                         <div className="flex justify-between text-xs font-black uppercase tracking-[0.3em] mb-2">
                            <span className="text-slate-400 group-hover:text-[var(--fx-accent)] transition-colors">RAG Optimization</span>
                            <span className="text-[var(--fx-accent)] font-bold">{workspace.knowledgeBaseUtilization}%</span>
                         </div>
                         <div className="h-2.5 w-full bg-white/5 dark:bg-black/20 rounded-full overflow-hidden border border-white/5 p-[1px]">
                            <div className="h-full bg-gradient-to-r from-[var(--fx-accent)] to-[var(--fx-primary)] rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_var(--fx-accent)]" style={{ width: `${workspace.knowledgeBaseUtilization}%` }}></div>
                         </div>
                      </div>
                   </div>
                   <div className="mt-auto flex flex-col items-center">
                      <div className="relative w-64 h-40 group cursor-help">
                         {[0, 1, 2, 3].map((i) => (
                            <div 
                              key={i} 
                              className="absolute left-1/2 -translate-x-1/2 w-48 h-8 bg-gradient-to-tr from-slate-800 to-slate-900 border border-white/10 rounded-xl transition-all duration-700"
                              style={{ 
                                 bottom: `${i * 16}px`, 
                                 zIndex: 10 - i,
                                 transform: `translateX(-50%) perspective(600px) rotateX(45deg) scale(${1 - i * 0.05}) translateY(${i * -4}px)`,
                                 boxShadow: i === 3 ? '0 -10px 40px -10px var(--fx-accent)' : 'none',
                                 opacity: 1 - i * 0.15
                              }}
                            >
                               {i === 3 && (
                                 <div className="absolute inset-0 flex items-center justify-center opacity-40 animate-pulse">
                                   <div className="w-12 h-0.5 bg-[var(--fx-accent)] blur-[2px] animate-shimmer" />
                                 </div>
                               )}
                               <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1500ms]" />
                            </div>
                         ))}
                         <div className="absolute inset-x-0 h-1 bg-[var(--fx-accent)]/30 blur-sm animate-scanner-sweep pointer-events-none" />
                      </div>
                      <p className="mt-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] opacity-60">System Optimized</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
