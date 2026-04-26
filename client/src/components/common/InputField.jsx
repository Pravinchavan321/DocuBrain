import { useState } from 'react';

const InputField = ({ label, type = 'text', name, value, onChange, required = false, placeholder, autoComplete }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="mb-5 relative group">
      {label && (
        <label
          htmlFor={name}
          className="block text-[10px] font-black mb-2 transition-all duration-300 uppercase tracking-[0.3em]"
          style={{ 
             color: focused ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
             textShadow: focused ? '0 0 15px rgba(168, 85, 247, 0.6)' : '0 2px 4px rgba(0,0,0,0.5)'
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
            background: 'linear-gradient(135deg, #a855f7, #6366f1)',
            opacity: focused ? 1 : 0,
            boxShadow: focused ? '0 0 30px rgba(168, 85, 247, 0.3)' : 'none',
            zIndex: 0
          }}
        />
        
        {/* Input Container */}
        <div className={`relative z-10 rounded-2xl overflow-hidden p-[1.5px] transition-all duration-500 ${focused ? 'bg-transparent' : 'bg-transparent border border-white/10 group-hover:border-white/20'}`}>
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder?.toUpperCase()}
            autoComplete={autoComplete}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full px-6 py-4 bg-[#030816]/30 backdrop-blur-sm rounded-[15px] outline-none font-black text-xs tracking-[0.05em] text-white placeholder:text-slate-500 transition-all"
            style={{
               boxShadow: focused ? 'inset 0 4px 15px rgba(0,0,0,0.8)' : 'none',
               textShadow: '0 0 5px rgba(0,0,0,0.5)'
            }}
          />
        </div>




        {/* Dynamic Bottom Accent Line */}
        <div className={`absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent transition-all duration-700 ${focused ? 'opacity-100 scale-x-110' : 'opacity-0 scale-x-50'}`} />
      </div>

      <style>{`
        input::placeholder {
          font-size: 10px;
          letter-spacing: 0.3em;
          font-weight: 900;
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: white;
          -webkit-box-shadow: 0 0 0px 1000px #0f172a inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
};

export default InputField;
