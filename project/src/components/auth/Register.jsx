import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus, Mail, Lock, User, Briefcase, Store, AlertCircle, Building, HardHat, Shield, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    shopName: '',
    companyName: '',
    supervisorEmail: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const { register } = useAuth();

  const roles = [
    { value: 'shopkeeper', label: 'Shopkeeper', icon: Store },
    { value: 'supervisor', label: 'Supervisor', icon: Briefcase },
    { value: 'operator', label: 'Operator', icon: HardHat }
  ];

  useEffect(() => {
    if (formData.role === 'operator') {
      fetchCompanies();
    }
  }, [formData.role]);

  useEffect(() => {
    if (formData.role === 'operator' && formData.companyName) {
      fetchSupervisors(formData.companyName);
    }
  }, [formData.companyName]);

  const fetchCompanies = async () => {
    try {
      const base = import.meta?.env?.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : 'https://tool-managemnt.onrender.com');
      const response = await axios.get(`${base}/api/auth/companies`);
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchSupervisors = async (companyName) => {
    try {
      const base = import.meta?.env?.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : 'https://tool-managemnt.onrender.com');
      const response = await axios.get(`${base}/api/auth/supervisors/${companyName}`);
      setSupervisors(response.data);
    } catch (error) {
      console.error('Error fetching supervisors:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(formData);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'role') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        shopName: '',
        companyName: '',
        supervisorEmail: ''
      }));
    }

    if (name === 'companyName') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        supervisorEmail: ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <Shield className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">INDUSTRIAL CONTROL SYSTEM</h1>
          <p className="text-gray-600 text-sm font-medium">Operator Registration Portal</p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          {/* Status Bar */}
          <div className="bg-gray-800 text-white px-4 py-2.5 text-xs font-mono flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
              <span>SECURE REGISTRATION CHANNEL</span>
            </div>
            <div className="text-gray-300">v3.2.1</div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 p-3 mb-4 bg-red-50 border border-red-100 rounded text-red-700 text-sm"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Email Address
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
                      className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                      placeholder="employee@company.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Password
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
                      className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Role
                  </label>
                  <div className="relative">
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all appearance-none"
                      required
                    >
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>

              {formData.role === 'shopkeeper' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Shop Name
                  </label>
                  <div className="relative">
                    <Store className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                      placeholder="Main Workshop"
                      required
                    />
                  </div>
                </div>
              )}

              {formData.role === 'supervisor' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                      placeholder="Industrial Corp"
                      required
                    />
                  </div>
                </div>
              )}

              {formData.role === 'operator' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Company Name
                    </label>
                    <div className="relative">
                      <Building className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 h-4 w-4" />
                      <select
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all appearance-none"
                        required
                      >
                        <option value="">Select Company</option>
                        {companies.map((company) => (
                          <option key={company} value={company}>
                            {company}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 h-4 w-4" />
                    </div>
                  </div>

                  {formData.companyName && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Supervisor
                      </label>
                      <div className="relative">
                        <User className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 h-4 w-4" />
                        <select
                          name="supervisorEmail"
                          value={formData.supervisorEmail}
                          onChange={handleChange}
                          className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all appearance-none"
                          required
                        >
                          <option value="">Select Supervisor</option>
                          {supervisors.map((supervisor) => (
                            <option key={supervisor._id} value={supervisor.email}>
                              {supervisor.name} ({supervisor.email})
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 h-4 w-4" />
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="pt-2">
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 outline-none transition-all disabled:opacity-60 shadow-sm"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      REGISTER ACCOUNT
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3.5 border-t border-gray-200 flex justify-between items-center">
            <Link 
              to="/login" 
              className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium"
            >
              Existing user? Sign in
            </Link>
            <div className="text-xs text-gray-500">
              <Shield className="inline w-3 h-3 mr-1 text-blue-600" />
              <span>ISO 27001 Certified</span>
            </div>
          </div>
        </div>

        {/* Security Compliance */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-1.5 rounded-full">
              <HardHat className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-800 mb-1">SECURITY PROTOCOL</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                All registered personnel will undergo verification before gaining system access. 
                Unauthorized registration attempts will be logged and reported.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;