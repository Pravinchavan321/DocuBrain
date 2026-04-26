import { useNavigate } from 'react-router-dom';
import AnimatedProjectBackground from '../components/common/AnimatedProjectBackground';

const AnalyticsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10 bg-[var(--bg-primary)] text-slate-900 dark:text-slate-100 font-sans relative overflow-hidden">
      <AnimatedProjectBackground variant="dashboard" />
      <div className="glass-card animated-dashboard-border p-12 rounded-[40px] max-w-2xl w-full text-center relative overflow-hidden z-10">

        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[60px] -mr-32 -mt-32" />
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-purple-600/10 rounded-3xl flex items-center justify-center text-purple-600 mx-auto mb-8 shadow-inner">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-black font-display tracking-tight mb-4">Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">
            Advanced usage analytics, document processing metrics, and AI performance insights will appear here after more activity is collected.
          </p>
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-black rounded-2xl shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all hover:scale-105 active:scale-95"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
