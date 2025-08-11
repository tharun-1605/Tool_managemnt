import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Play,
  Square,
  Clock,
  TrendingUp, 
  Wrench,
  BarChart3,
  CheckCircle,
  Package,
  AlertTriangle,
  Hash,
  RotateCcw,
  Activity,
  Settings,
  Bell,
  RefreshCw,
  Filter,
  Search,
  Download,
  Zap,
  Target,
  Timer
} from 'lucide-react';
import StatsCard from '../common/StatsCard';
import UsageChart from '../charts/UsageChart';

const OperatorDashboard = ({ defaultTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [stats, setStats] = useState({});
  const [parentTools, setParentTools] = useState([]);
  const [activeInstances, setActiveInstances] = useState([]);
  const [availableInstances, setAvailableInstances] = useState([]);
  const [usage, setUsage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (defaultTab && defaultTab !== activeTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const base = import.meta?.env?.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : 'https://tool-managemnt.onrender.com');
      const [statsRes, toolsRes, usageRes] = await Promise.all([
        axios.get(`${base}/api/dashboard/stats`),
        axios.get(`${base}/api/tools/operator-tools`),
        axios.get(`${base}/api/usage`)
      ]);

      setStats(statsRes.data);
      setParentTools(toolsRes.data.parentTools || []);
      setActiveInstances(toolsRes.data.activeInstances || []);
      setAvailableInstances(toolsRes.data.availableInstances || []);
      setUsage(usageRes.data);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleStartUsage = async (toolId) => {
    try {
      const base = import.meta?.env?.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : 'https://tool-managemnt.onrender.com');
      const response = await axios.post(`${base}/api/tools/${toolId}/start-usage`);
      alert(response.data.message);
      await fetchData(); // Refresh data
      // Notify other UI (e.g., sidebar) to refresh active instances immediately
      window.dispatchEvent(new Event('tools-active-changed'));
    } catch (error) {
      console.error('Error starting tool usage:', error);
      alert(error.response?.data?.message || 'Failed to start tool usage');
    }
  };

  const handleStopUsage = async (toolId) => {
    try {
      const base = import.meta?.env?.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : 'https://tool-managemnt.onrender.com');
      const response = await axios.post(`${base}/api/tools/${toolId}/stop-usage`);
      alert(response.data.message);
      await fetchData(); // Refresh data
      // Notify other UI (e.g., sidebar) to refresh active instances immediately
      window.dispatchEvent(new Event('tools-active-changed'));
    } catch (error) {
      console.error('Error stopping tool usage:', error);
      alert(error.response?.data?.message || 'Failed to stop tool usage');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Operations Center', icon: BarChart3, description: 'Real-time dashboard & metrics' },
    { id: 'tools', label: 'Tool Inventory', icon: Wrench, description: 'Available equipment catalog' },
    { id: 'active', label: 'Active Operations', icon: Play, description: 'Tools currently in use' },
    { id: 'reusable', label: 'Ready Tools', icon: RotateCcw, description: 'Pre-used available tools' },
    { id: 'analytics', label: 'Performance Analytics', icon: TrendingUp, description: 'Usage insights & reports' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-4 border-t-orange-600 rounded-full animate-spin"></div>
            <div className="w-12 h-12 border-4 border-slate-100 border-t-4 border-t-blue-500 rounded-full animate-spin absolute top-2 left-2" style={{animationDirection: 'reverse'}}></div>
          </div>
          <p className="text-slate-600 font-medium">Loading operator dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-3 rounded-xl shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Industrial Operations Center</h1>
                <p className="text-slate-600 mt-1">Operator Control Interface</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fetchData()}
                disabled={refreshing}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border border-slate-300"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Sync Data
              </button>
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg transition-colors border border-slate-300">
                <Bell className="w-5 h-5" />
              </button>
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-lg transition-colors border border-slate-300">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available Tools</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{parentTools.length || 0}</div>
                <p className="text-sm text-slate-600">Ready for operation</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-green-600 font-medium">Operational</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Sessions</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stats.totalUsage || 0}</div>
                <p className="text-sm text-slate-600">Usage sessions logged</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-orange-600 font-medium">Tracked</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Play className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Tools</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{activeInstances.length || 0}</div>
                <p className="text-sm text-slate-600">Currently in operation</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-blue-600 font-medium">Running</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <RotateCcw className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ready Tools</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{availableInstances.length || 0}</div>
                <p className="text-sm text-slate-600">Pre-used & available</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-purple-600 font-medium">Standby</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-8 overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50">
            <nav className="flex overflow-x-auto no-scrollbar">
              {tabs.map((tab, index) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`min-w-[12rem] shrink-0 flex flex-col items-center gap-3 py-6 px-6 font-medium text-sm transition-all duration-300 relative ${
                      activeTab === tab.id
                        ? 'bg-white text-orange-600 shadow-sm border-b-2 border-orange-600'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                    <div className="text-center">
                      <div className="font-semibold">{tab.label}</div>
                      <div className="text-xs text-slate-500 mt-1">{tab.description}</div>
                    </div>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-t"></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Available Tools Summary Enhanced */}
                  <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200 shadow-sm">
                    <div className="p-6 border-b border-slate-200 bg-white rounded-t-xl">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <Package className="w-5 h-5 text-green-600" />
                          </div>
                          Available Equipment Catalog
                        </h3>
                        <div className="flex gap-2">
                          <button className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100">
                            <Filter className="w-4 h-4" />
                          </button>
                          <button className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100">
                            <Search className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {parentTools.slice(0, 5).map((tool) => (
                          <div key={tool._id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex items-center gap-4">
                              <div className="bg-green-100 p-3 rounded-lg">
                                <Wrench className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">{tool.name}</p>
                                <div className="flex items-center gap-4 mt-1">
                                  <p className="text-sm text-green-600">Available: <span className="font-bold">{tool.availableQuantity}</span> | Total: <span className="font-bold">{tool.companyQuantity}</span></p>
                                </div>
                                <p className="text-xs text-blue-600 mt-1">
                                  Remaining Life: {tool.remainingLife?.toFixed(1)}h
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <button
                                onClick={() => handleStartUsage(tool._id)}
                                disabled={tool.availableQuantity <= 0}
                                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 flex items-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Play className="w-4 h-4" />
                                Start
                              </button>
                            </div>
                          </div>
                        ))}
                        {parentTools.length === 0 && (
                          <div className="text-center py-8 text-slate-500">
                            <Package className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                            <p className="font-medium">No tools available</p>
                            <p className="text-sm mt-1">Contact your supervisor to order tools</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Current Usage & Reusable */}
                  <div className="space-y-6">
                    {/* Current Usage Enhanced */}
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200 shadow-sm">
                      <div className="p-6 border-b border-orange-200 bg-white rounded-t-xl">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                          <div className="bg-orange-100 p-2 rounded-lg">
                            <Play className="w-5 h-5 text-orange-600" />
                          </div>
                          Active Operations
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          {activeInstances.slice(0, 3).map((instance) => (
                            <div key={instance._id} className="flex items-center justify-between p-4 bg-white rounded-xl border-l-4 border-l-orange-500 shadow-sm">
                              <div className="flex items-center gap-4">
                                <div className="bg-orange-100 p-3 rounded-lg">
                                  <Timer className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900 flex items-center gap-2">
                                    {instance.name}
                                    <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                      <Hash className="w-3 h-3" />
                                      {instance.instanceNumber}
                                    </span>
                                  </p>
                                  <p className="text-sm text-orange-700 font-medium">
                                    Started: {new Date(instance.usageStartTime).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <button
                                  onClick={() => handleStopUsage(instance._id)}
                                  className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1 shadow-sm"
                                >
                                  <Square className="w-3 h-3" />
                                  Stop
                                </button>
                              </div>
                            </div>
                          ))}
                          {activeInstances.length === 0 && (
                            <div className="text-center py-6 text-slate-500">
                              <Play className="w-10 h-10 mx-auto mb-2 text-slate-400" />
                              <p className="font-medium">No active operations</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Reusable Tools Enhanced */}
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 shadow-sm">
                      <div className="p-6 border-b border-purple-200 bg-white rounded-t-xl">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <RotateCcw className="w-5 h-5 text-purple-600" />
                          </div>
                          Ready-to-Use Tools
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          {availableInstances.slice(0, 3).map((instance) => (
                            <div key={instance._id} className="flex items-center justify-between p-4 bg-white rounded-xl border-l-4 border-l-purple-500 shadow-sm">
                              <div className="flex items-center gap-4">
                                <div className="bg-purple-100 p-3 rounded-lg">
                                  <Target className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900 flex items-center gap-2">
                                    {instance.name}
                                    <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                      <Hash className="w-3 h-3" />
                                      {instance.instanceNumber}
                                    </span>
                                  </p>
                                  <p className="text-sm text-purple-700 font-medium">
                                    Life: {instance.remainingLife?.toFixed(1)}h remaining
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <button
                                  onClick={() => handleStartUsage(instance._id)}
                                  className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1 shadow-sm"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  Resume
                                </button>
                              </div>
                            </div>
                          ))}
                          {availableInstances.length === 0 && (
                            <div className="text-center py-6 text-slate-500">
                              <RotateCcw className="w-10 h-10 mx-auto mb-2 text-slate-400" />
                              <p className="font-medium">No ready tools</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Status Overview */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-lg">
                  <div className="p-6 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Activity className="w-5 h-5 text-blue-600" />
                      </div>
                      Operations Status Monitor
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-slate-900">System Online</h4>
                        <p className="text-sm text-slate-600 mt-1">All systems operational</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                          <TrendingUp className="w-8 h-8 text-orange-600" />
                        </div>
                        <h4 className="font-semibold text-slate-900">Productivity High</h4>
                        <p className="text-sm text-slate-600 mt-1">Efficiency within targets</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                          <Wrench className="w-8 h-8 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-slate-900">Tools Ready</h4>
                        <p className="text-sm text-slate-600 mt-1">Equipment synchronized</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Equipment Inventory Catalog</h2>
                    <p className="text-slate-600 mt-1">Available tools ordered by your supervisor</p>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <div className="relative">
                      <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search equipment..."
                        className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent w-full md:w-auto"
                      />
                    </div>
                    <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border border-slate-300">
                      <Filter className="w-4 h-4" />
                      Filter
                    </button>
                  </div>
                </div>
                
                {parentTools.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {parentTools.map((tool) => (
                      <div key={tool._id} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 overflow-hidden">
                        {/* Header with Status Badge */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-900 text-lg">{tool.name}</h3>
                            <p className="text-sm text-slate-600 capitalize">{tool.category}</p>
                            <p className="text-xs text-blue-600 mt-1">Shop: {tool.shopkeeper?.shopName}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                            tool.availableQuantity > 0 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {tool.availableQuantity > 0 ? 'AVAILABLE' : 'UNAVAILABLE'}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{tool.description}</p>

                        {/* Company Quantities - Enhanced */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                            <Package className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                            <p className="text-xs text-slate-600 font-medium">Total</p>
                            <p className="font-bold text-blue-600 text-lg">{tool.companyQuantity}</p>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-xl border border-green-200">
                            <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                            <p className="text-xs text-slate-600 font-medium">Available</p>
                            <p className="font-bold text-green-600 text-lg">{tool.availableQuantity}</p>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded-xl border border-orange-200">
                            <Play className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                            <p className="text-xs text-slate-600 font-medium">In Use</p>
                            <p className="font-bold text-orange-600 text-lg">{tool.inUseQuantity}</p>
                          </div>
                        </div>

                        {/* Life Progress - Enhanced */}
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-semibold text-slate-700">Equipment Life</span>
                            <span className="text-sm font-bold text-slate-600">
                              {tool.remainingLife?.toFixed(1) || tool.lifeLimit}h / {tool.lifeLimit}h
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                            <div
                              className="h-3 rounded-full bg-gradient-to-r from-green-500 to-orange-500 transition-all duration-500"
                              style={{ width: `${Math.max(0, ((tool.remainingLife || tool.lifeLimit) / tool.lifeLimit) * 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>New</span>
                            <span>{(((tool.remainingLife || tool.lifeLimit) / tool.lifeLimit) * 100).toFixed(1)}% remaining</span>
                          </div>
                        </div>

                        {/* Action Button - Enhanced */}
                        {tool.availableQuantity > 0 ? (
                          <button
                            onClick={() => handleStartUsage(tool._id)}
                            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-4 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl"
                          >
                            <Play className="w-5 h-5" />
                            Start Operation (#{tool.inUseQuantity + 1})
                          </button>
                        ) : (
                          <div className="w-full bg-slate-100 text-slate-600 py-3 px-4 rounded-xl text-sm text-center font-medium border-2 border-dashed border-slate-300">
                            No Available Units
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Package className="w-20 h-20 mx-auto mb-6 text-slate-400" />
                    <div className="text-slate-500 text-xl font-semibold mb-2">No Equipment Available</div>
                    <p className="text-slate-400 text-sm max-w-md mx-auto">
                      Your supervisor needs to order tools from shops first. Contact them to request necessary equipment for operations.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Continue with other tabs following the same enhanced design pattern... */}
            {activeTab === 'active' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Active Operations Monitor</h2>
                    <p className="text-slate-600 mt-1">Real-time tracking of equipment in use</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border border-slate-300">
                      <Download className="w-4 h-4" />
                      Export Log
                    </button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {activeInstances.map((instance) => (
                    <div key={instance._id} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 text-xl flex items-center gap-3">
                            {instance.name}
                            <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 border border-blue-200">
                              <Hash className="w-4 h-4" />
                              Instance #{instance.instanceNumber}
                            </span>
                          </h3>
                          <p className="text-sm text-slate-600 capitalize mt-1">{instance.category}</p>
                          <p className="text-xs text-blue-600 mt-1">Shop: {instance.shopkeeper?.shopName}</p>
                        </div>
                        <div className="text-right">
                          <span className="px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 text-sm font-bold rounded-full border border-orange-200">
                            ACTIVE OPERATION
                          </span>
                        </div>
                      </div>

                      {/* Enhanced Status Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-3">
                            <Clock className="w-6 h-6 text-slate-600" />
                            <div>
                              <p className="text-sm text-slate-600 font-medium">Operation Started</p>
                              <p className="font-bold text-slate-900">{new Date(instance.usageStartTime).toLocaleTimeString()}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                          <div className="flex items-center gap-3">
                            <Timer className="w-6 h-6 text-blue-600" />
                            <div>
                              <p className="text-sm text-slate-600 font-medium">Active Duration</p>
                              <p className="font-bold text-blue-600">
                                {Math.floor((new Date() - new Date(instance.usageStartTime)) / (1000 * 60 * 60))}h {Math.floor(((new Date() - new Date(instance.usageStartTime)) % (1000 * 60 * 60)) / (1000 * 60))}m
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6 text-orange-600" />
                            <div>
                              <p className="text-sm text-slate-600 font-medium">Life Remaining</p>
                              <p className={`font-bold ${instance.remainingLife <= instance.thresholdLimit ? 'text-red-600' : 'text-green-600'}`}>
                                {instance.remainingLife.toFixed(1)}h
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Life Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-semibold text-slate-700">Equipment Life Usage</span>
                          <span className="text-sm text-slate-600 font-medium">
                            {((instance.lifeLimit - instance.remainingLife) / instance.lifeLimit * 100).toFixed(1)}% consumed
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                          <div
                            className="h-4 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full transition-all duration-500"
                            style={{ width: `${((instance.lifeLimit - instance.remainingLife) / instance.lifeLimit) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Warning if low life */}
                      {instance.remainingLife <= instance.thresholdLimit && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-l-red-500 rounded-lg">
                          <div className="flex items-center gap-3 text-red-700">
                            <AlertTriangle className="w-5 h-5" />
                            <span className="text-sm font-bold">CRITICAL: Low Life Warning</span>
                          </div>
                          <p className="text-sm text-red-600 mt-2">
                            This equipment is below the threshold limit of {instance.thresholdLimit} hours. Consider replacing soon.
                          </p>
                        </div>
                      )}

                      <button
                        onClick={() => handleStopUsage(instance._id)}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-lg shadow-lg hover:shadow-xl"
                      >
                        <Square className="w-5 h-5" />
                        Stop Operation - Instance #{instance.instanceNumber}
                      </button>
                    </div>
                  ))}

                  {activeInstances.length === 0 && (
                    <div className="text-center py-16">
                      <Play className="w-20 h-20 mx-auto mb-6 text-slate-400" />
                      <div className="text-slate-500 text-xl font-semibold mb-2">No Active Operations</div>
                      <p className="text-slate-400 text-sm">Start using equipment to monitor active operations here</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Continue with remaining tabs... */}
            {/* Add similar enhanced styling for 'reusable' and 'analytics' tabs following the same pattern */}
            
            {activeTab === 'reusable' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Ready-to-Use Equipment</h2>
                    <p className="text-slate-600 mt-1">Previously used tools available for operation</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {availableInstances.map((instance) => (
                    <div key={instance._id} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-all duration-300">
                      {/* Same enhanced styling as active instances but with purple theme */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 text-xl flex items-center gap-3">
                            {instance.name}
                            <span className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 border border-purple-200">
                              <Hash className="w-4 h-4" />
                              Instance #{instance.instanceNumber}
                            </span>
                          </h3>
                          <p className="text-sm text-slate-600 capitalize mt-1">{instance.category}</p>
                          <p className="text-xs text-blue-600 mt-1">Shop: {instance.shopkeeper?.shopName}</p>
                        </div>
                        <div className="text-right">
                          <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-sm font-bold rounded-full border border-green-200">
                            READY FOR USE
                          </span>
                        </div>
                      </div>

                      {/* Status grid and other components following the same pattern... */}
                      
                      <button
                        onClick={() => handleStartUsage(instance._id)}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-lg shadow-lg hover:shadow-xl"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Resume Operation - Instance #{instance.instanceNumber}
                      </button>
                    </div>
                  ))}

                  {availableInstances.length === 0 && (
                    <div className="text-center py-16">
                      <RotateCcw className="w-20 h-20 mx-auto mb-6 text-slate-400" />
                      <div className="text-slate-500 text-xl font-semibold mb-2">No Ready Equipment</div>
                      <p className="text-slate-400 text-sm">Used equipment will appear here when available for reuse</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Performance Analytics Dashboard</h2>
                    <p className="text-slate-600 mt-1">Usage insights and operational metrics</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                    <UsageChart title="My Usage Pattern" />
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                      </div>
                      Recent Usage History
                    </h3>
                    <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
                      {usage.map((record) => (
                        <div key={record._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                          <div>
                            <p className="font-semibold text-slate-900 flex items-center gap-2">
                              {record.toolName}
                              {record.tool?.instanceNumber && (
                                <span className="bg-slate-200 text-slate-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                  <Hash className="w-3 h-3" />
                                  {record.tool.instanceNumber}
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-slate-600 mt-1">
                              {new Date(record.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-blue-600">{record.duration?.toFixed(1)}h</p>
                            <p className={`text-xs font-medium ${record.isActive ? 'text-green-600' : 'text-slate-500'}`}>
                              {record.isActive ? 'Active' : 'Completed'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorDashboard;
