import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, Mail, Lock, Shield, HardHat } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Professional Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <HardHat className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">INDUSTRIAL CONTROL</h1>
          <p className="text-gray-600 text-sm">Secure access to operations dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          {/* Status Bar */}
          <div className="bg-gray-800 text-white px-4 py-2 text-xs flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
            <span>SECURE CONNECTION ESTABLISHED</span>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm"
              >
                <Shield className="w-4 h-4" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WORK EMAIL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="employee@company.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PASSWORD
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 outline-none transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      AUTHENTICATE
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            <Link 
              to="/forgot-password" 
              className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
            >
              Forgot password?
            </Link>
            <div className="text-xs text-gray-500">
              Need access? <Link to="/register" className="text-blue-600 hover:underline">Request account</Link>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-medium text-gray-800 mb-1">SECURITY NOTICE</h4>
              <p className="text-xs text-gray-600">
                This system contains confidential industrial data. Unauthorized access is prohibited.
                All activities are monitored and recorded.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Access */}
        <div className="mt-4">
          <details className="text-xs text-gray-600">
            <summary className="cursor-pointer text-blue-600 hover:underline">Demo Access Credentials</summary>
            <div className="mt-2 bg-gray-50 p-3 rounded border border-gray-200 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <span className="font-mono">shop@demo.com / password123</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-600"></div>
                <span className="font-mono">supervisor@demo.com / password123</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-600"></div>
                <span className="font-mono">operator@demo.com / password123</span>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default Login;