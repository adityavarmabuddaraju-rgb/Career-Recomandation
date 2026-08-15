import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Sparkles, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await signup(formData.name.trim(), formData.email, formData.password);
      showToast('Account created successfully! Welcome to CareerAI.', 'success');
      navigate('/dashboard');
    } catch (error) {
      const msg = typeof error === 'string' ? error : (error?.detail || error?.message || 'Signup failed. Please try again.');
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ name, label, type = 'text', placeholder, icon: Icon, showToggle, onToggle, showState, error }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600 text-gray-400">
          <Icon className="h-5 w-5" />
        </div>
        <input
          name={name}
          type={showToggle ? (showState ? 'text' : 'password') : type}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`block w-full pl-11 ${showToggle ? 'pr-12' : 'pr-4'} py-3 bg-gray-50/50 border rounded-xl text-sm transition-all duration-200 ease-in-out focus:bg-white focus:outline-none focus:ring-4 placeholder-gray-400 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20'
          }`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
          >
            {showState ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen font-sans flex items-center justify-center bg-[#FAFAFA] relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-100/50 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-100/40 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-100/40 blur-3xl rounded-full pointer-events-none" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-[460px]">
        {/* Logo area */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="group flex items-center justify-center w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 transition-all hover:shadow-md hover:border-indigo-100">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Create an account</h2>
          <p className="text-gray-500 text-sm">Join CareerAI and discover your ideal career path.</p>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              name="name" label="Full Name" type="text"
              placeholder="Jane Doe" icon={User} error={errors.name}
            />
            <InputField
              name="email" label="Email address" type="email"
              placeholder="name@example.com" icon={Mail} error={errors.email}
            />
            <InputField
              name="password" label="Password" type="password"
              placeholder="At least 6 characters" icon={Lock}
              showToggle onToggle={() => setShowPassword(!showPassword)} showState={showPassword}
              error={errors.password}
            />
            <InputField
              name="confirmPassword" label="Confirm Password" type="password"
              placeholder="Repeat your password" icon={Lock}
              showToggle onToggle={() => setShowConfirm(!showConfirm)} showState={showConfirm}
              error={errors.confirmPassword}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative flex items-center justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-6 overflow-hidden group shadow-sm shadow-indigo-600/20"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <span className="flex items-center">
                  Create your account
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Sign in to your account &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
