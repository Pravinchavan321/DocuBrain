import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import { extractError } from '../utils/error';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const emailStr = formData.email?.trim();
    const passwordStr = formData.password?.trim();
    if (!emailStr || !passwordStr) {
      setError('Email and password required.');
      return;
    }
    setLoading(true);
    try {
      await login({ email: emailStr, password: passwordStr });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="SIGN IN" subtitle="Intelligence Vault">
      {error && (
        <div className="mb-4 p-3 rounded-xl text-xs font-bold bg-red-500/10 border border-red-500/50 text-red-200 animate-shake">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <InputField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          required
        />
        <InputField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />

        <div className="pt-2">
          <Button type="submit" disabled={loading} styleType="primary">
            {loading ? 'WAITING...' : 'SIGN IN →'}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <Link to="/register" className="text-xs font-bold text-cyan-400 uppercase tracking-widest hover:underline">
          Create New Profile
        </Link>
      </div>

      <style>{`
        @keyframes animateShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: animateShake 0.4s ease-in-out; }
      `}</style>
    </AuthLayout>
  );
};

export default LoginPage;
