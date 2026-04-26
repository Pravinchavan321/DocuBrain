import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import InputField from '../components/common/InputField';
import Button from '../components/common/Button';
import { extractError } from '../utils/error';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const nameStr = formData.name?.trim();
    const emailStr = formData.email?.trim();
    const passwordStr = formData.password?.trim();
    const confirmStr = formData.confirmPassword?.trim();
    if (!nameStr || !emailStr || !passwordStr || !confirmStr) {
      setError('All fields required.');
      return;
    }
    if (passwordStr.length < 8) {
      setError('Password too short.');
      return;
    }
    if (passwordStr !== confirmStr) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await register({ full_name: nameStr, email: emailStr, password: passwordStr });
      setSuccess('Profile Ready!');
      setTimeout(() => navigate('/login', { replace: true }), 1500);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="SIGN UP" subtitle="Knowledge Network" mode="signup">
      {error && (
        <div className="mb-4 p-3 rounded-xl text-xs font-bold bg-red-500/10 border border-red-500/50 text-red-200 animate-shake">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded-xl text-xs font-bold bg-emerald-500/10 border border-emerald-500/50 text-emerald-200">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <InputField
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
        />
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
        <InputField
          label="Confirm"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />

        <div className="pt-2">
          <Button type="submit" disabled={loading} styleType="primary">
            {loading ? 'WAITING...' : 'JOIN NOW →'}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <Link to="/login" className="text-xs font-bold text-cyan-400 uppercase tracking-widest hover:underline">
          Back to Login
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

export default RegisterPage;
