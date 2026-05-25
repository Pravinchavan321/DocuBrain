import { useState } from 'react';

const InputField = ({ label, type = 'text', name, value, onChange, required = false, placeholder, autoComplete }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="mb-6 relative group">
      {label && (
        <label
          htmlFor={name}
          className="block text-base font-bold mb-2 transition-all duration-300 tracking-wide text-[var(--text-primary)]"
          style={{ 
             color: focused ? 'var(--text-primary)' : 'var(--text-secondary)'
          }}
        >
          {label}
        </label>
      )}
      
      <div className={`relative transition-all duration-500 ${focused ? 'translate-y-[-2px]' : 'translate-y-0'}`}>
        
        {/* Accent Glow Ring */}
        <div
          className="absolute -inset-[2px] rounded-2xl transition-all duration-700 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
            opacity: focused ? 1 : 0,
            boxShadow: focused ? '0 0 20px rgba(168, 85, 247, 0.2)' : 'none',
            zIndex: 0
          }}
        />
        
        {/* Input Container */}
        <div className={`relative z-10 rounded-2xl overflow-hidden p-[1.5px] transition-all duration-500 ${focused ? 'bg-transparent' : 'bg-transparent border border-slate-300 dark:border-white/10 group-hover:border-slate-400 dark:group-hover:border-white/20'}`}>
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            autoComplete={autoComplete}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full px-5 py-4 bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm rounded-[15px] outline-none font-medium text-base text-[var(--text-primary)] placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all shadow-inner dark:shadow-none"
          />
        </div>

        {/* Dynamic Bottom Accent Line */}
        <div className={`absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent transition-all duration-700 ${focused ? 'opacity-100 scale-x-110' : 'opacity-0 scale-x-50'}`} />
      </div>

      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: var(--text-primary);
          -webkit-box-shadow: 0 0 0px 1000px transparent inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
};

export default InputField;
