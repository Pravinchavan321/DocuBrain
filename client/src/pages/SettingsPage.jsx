import React from 'react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10 bg-[var(--bg-primary)] text-slate-900 dark:text-slate-100 font-sans">
      <div className="glass-card p-12 rounded-[40px] max-w-2xl w-full text-center relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[60px] -mr-32 -mt-32" />
        
        <div className="relative z-10">
          <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-8 shadow-inner">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-black font-display tracking-tight mb-4">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">
            Customize your DocuBrain experience. Manage API keys, appearance, notification preferences, and account security.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/30 border border-transparent hover:border-blue-500/20 transition-all cursor-pointer">
              <p className="font-bold text-sm">Account Profile</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/30 border border-transparent hover:border-blue-500/20 transition-all cursor-pointer">
              <p className="font-bold text-sm">API Integration</p>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
