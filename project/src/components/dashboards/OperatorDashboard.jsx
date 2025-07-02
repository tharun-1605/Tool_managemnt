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
  RotateCcw
} from 'lucide-react';
import StatsCard from '../common/StatsCard';
import UsageChart from '../charts/UsageChart';

const OperatorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [parentTools, setParentTools] = useState([]);
  const [activeInstances, setActiveInstances] = useState([]);
  const [availableInstances, setAvailableInstances] = useState([]);
  const [usage, setUsage] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, toolsRes, usageRes] = await Promise.all([
        axios.get('https://tool-managemnt.onrender.com/api/dashboard/stats'),
        axios.get('https://tool-managemnt.onrender.com/api/tools/operator-tools'),
        axios.get('https://tool-managemnt.onrender.com/api/usage')
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
    }
  };

  const handleStartUsage = async (toolId) => {
    try {
      const response = await axios.post(`https://tool-managemnt.onrender.com/api/tools/${toolId}/start-usage`);
      alert(response.data.message);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error starting tool usage:', error);
      alert(error.response?.data?.message || 'Failed to start tool usage');
    }
  };

  const handleStopUsage = async (toolId) => {
    try {
      const response = await axios.post(`https://tool-managemnt.onrender.com/api/tools/${toolId}/stop-usage`);
      alert(response.data.message);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error stopping tool usage:', error);
      alert(error.response?.data?.message || 'Failed to stop tool usage');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'tools', label: 'Available Tools', icon: Wrench },
    { id: 'active', label: 'Active Usage', icon: Play },
    { id: 'reusable', label: 'Reusable Tools', icon: RotateCcw },
    { id: 'analytics', label: 'My Usage', icon: BarChart3 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Available Tools"
          value={parentTools.length || 0}
          icon={Package}
          color="green"
        />
        <StatsCard
          title="Total Usage Sessions"
          value={stats.totalUsage || 0}
          icon={Clock}
          color="orange"
        />
        <StatsCard
          title="Active Instances"
          value={activeInstances.length || 0}
          icon={Play}
          color="blue"
        />
        <StatsCard
          title="Reusable Tools"
          value={availableInstances.length || 0}
          icon={RotateCcw}
          color="purple"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available Tools Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-green-500" />
                Available Company Tools
              </h3>
              <div className="space-y-3">
                {parentTools.slice(0, 5).map((tool) => (
                  <div key={tool._id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <p className="font-medium text-gray-900">{tool.name}</p>
                      <p className="text-sm text-green-600">
                        Available: {tool.availableQuantity} | Total: {tool.companyQuantity}
                      </p>
                      <p className="text-xs text-gray-500">
                        Life: {tool.remainingLife?.toFixed(1)}h remaining
                      </p>
                    </div>
                    <button
                      onClick={() => handleStartUsage(tool._id)}
                      disabled={tool.availableQuantity <= 0}
                      className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm hover:bg-orange-700 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Play className="w-3 h-3" />
                      Start
                    </button>
                  </div>
                ))}
                {parentTools.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <p>No tools available</p>
                    <p className="text-sm">Your supervisor needs to order tools first</p>
                  </div>
                )}
              </div>
            </div>

            {/* Current Usage & Reusable Tools */}
            <div className="space-y-6">
              {/* Current Usage */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5 text-orange-500" />
                  Currently Using
                </h3>
                <div className="space-y-3">
                  {activeInstances.slice(0, 3).map((instance) => (
                    <div key={instance._id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div>
                        <p className="font-medium text-gray-900 flex items-center gap-2">
                          {instance.name}
                          <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            {instance.instanceNumber}
                          </span>
                        </p>
                        <p className="text-sm text-orange-600">
                          Started: {new Date(instance.usageStartTime).toLocaleTimeString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleStopUsage(instance._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-full text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
                      >
                        <Square className="w-3 h-3" />
                        Stop
                      </button>
                    </div>
                  ))}
                  {activeInstances.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <p>No tools currently in use</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Reusable Tools */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-purple-500" />
                  Reusable Tools
                </h3>
                <div className="space-y-3">
                  {availableInstances.slice(0, 3).map((instance) => (
                    <div key={instance._id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div>
                        <p className="font-medium text-gray-900 flex items-center gap-2">
                          {instance.name}
                          <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            {instance.instanceNumber}
                          </span>
                        </p>
                        <p className="text-sm text-purple-600">
                          Life: {instance.remainingLife?.toFixed(1)}h remaining
                        </p>
                      </div>
                      <button
                        onClick={() => handleStartUsage(instance._id)}
                        className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm hover:bg-purple-700 transition-colors flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reuse
                      </button>
                    </div>
                  ))}
                  {availableInstances.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <p>No reusable tools</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Available Company Tools</h2>
              <div className="text-sm text-gray-600">
                Showing tools ordered by your supervisor
              </div>
            </div>
            
            {parentTools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {parentTools.map((tool) => (
                  <div key={tool._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{tool.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{tool.category}</p>
                        <p className="text-xs text-blue-600">Shop: {tool.shopkeeper?.shopName}</p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4">{tool.description}</p>

                    {/* Company Quantities */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <Package className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Total</p>
                        <p className="font-bold text-blue-600">{tool.companyQuantity}</p>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Available</p>
                        <p className="font-bold text-green-600">{tool.availableQuantity}</p>
                      </div>
                      <div className="text-center p-2 bg-orange-50 rounded-lg">
                        <Play className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">In Use</p>
                        <p className="font-bold text-orange-600">{tool.inUseQuantity}</p>
                      </div>
                    </div>

                    {/* Life Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Tool Life</span>
                        <span className="text-sm font-bold text-gray-600">
                          {tool.remainingLife?.toFixed(1) || tool.lifeLimit}h / {tool.lifeLimit}h
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-green-500 transition-all"
                          style={{ width: `${Math.max(0, ((tool.remainingLife || tool.lifeLimit) / tool.lifeLimit) * 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Action Button */}
                    {tool.availableQuantity > 0 ? (
                      <button
                        onClick={() => handleStartUsage(tool._id)}
                        className="w-full bg-orange-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-orange-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <Play className="w-4 h-4" />
                        Start Using (Next: #{tool.inUseQuantity + 1})
                      </button>
                    ) : (
                      <div className="w-full bg-gray-100 text-gray-600 py-2 px-3 rounded-lg text-sm text-center">
                        No available quantity
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <div className="text-gray-500 text-lg">No tools available</div>
                <p className="text-gray-400 text-sm mt-2">
                  Your supervisor needs to order tools from shops first
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'active' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Tool Usage</h2>
            <div className="space-y-4">
              {activeInstances.map((instance) => (
                <div key={instance._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                        {instance.name}
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          Instance #{instance.instanceNumber}
                        </span>
                      </h3>
                      <p className="text-sm text-gray-600 capitalize">{instance.category}</p>
                      <p className="text-xs text-blue-600">Shop: {instance.shopkeeper?.shopName}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                        Active
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Started</p>
                        <p className="font-medium">{new Date(instance.usageStartTime).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-medium text-blue-600">
                          {Math.floor((new Date() - new Date(instance.usageStartTime)) / (1000 * 60 * 60))}h {Math.floor(((new Date() - new Date(instance.usageStartTime)) % (1000 * 60 * 60)) / (1000 * 60))}m
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <div>
                        <p className="text-sm text-gray-600">Remaining Life</p>
                        <p className={`font-medium ${instance.remainingLife <= instance.thresholdLimit ? 'text-red-600' : 'text-green-600'}`}>
                          {instance.remainingLife.toFixed(1)}h
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Life Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Tool Life Progress</span>
                      <span className="text-sm text-gray-600">
                        {((instance.lifeLimit - instance.remainingLife) / instance.lifeLimit * 100).toFixed(1)}% used
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 bg-gradient-to-r from-green-500 to-orange-500 rounded-full transition-all"
                        style={{ width: `${((instance.lifeLimit - instance.remainingLife) / instance.lifeLimit) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Warning if low life */}
                  {instance.remainingLife <= instance.thresholdLimit && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">Low Life Warning</span>
                      </div>
                      <p className="text-sm text-red-600 mt-1">
                        This tool is below the threshold limit of {instance.thresholdLimit} hours
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => handleStopUsage(instance._id)}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <Square className="w-4 h-4" />
                    Stop Usage - Instance #{instance.instanceNumber}
                  </button>
                </div>
              ))}

              {activeInstances.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg">No active tool usage</div>
                  <p className="text-gray-400 text-sm mt-2">Start using a tool to see it here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reusable' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Reusable Tool Instances</h2>
            <div className="space-y-4">
              {availableInstances.map((instance) => (
                <div key={instance._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                        {instance.name}
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          Instance #{instance.instanceNumber}
                        </span>
                      </h3>
                      <p className="text-sm text-gray-600 capitalize">{instance.category}</p>
                      <p className="text-xs text-blue-600">Shop: {instance.shopkeeper?.shopName}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        Available
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Remaining Life</p>
                        <p className={`font-medium ${instance.remainingLife <= instance.thresholdLimit ? 'text-red-600' : 'text-green-600'}`}>
                          {instance.remainingLife.toFixed(1)}h
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Total Usage</p>
                        <p className="font-medium text-blue-600">
                          {instance.totalUsageHours?.toFixed(1) || 0}h
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      <div>
                        <p className="text-sm text-gray-600">Usage %</p>
                        <p className="font-medium text-purple-600">
                          {((instance.totalUsageHours || 0) / instance.lifeLimit * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Life Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Tool Life Remaining</span>
                      <span className="text-sm text-gray-600">
                        {(instance.remainingLife / instance.lifeLimit * 100).toFixed(1)}% remaining
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          instance.remainingLife <= instance.thresholdLimit ? 'bg-red-500' :
                          instance.remainingLife <= instance.lifeLimit * 0.3 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${(instance.remainingLife / instance.lifeLimit) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Warning if low life */}
                  {instance.remainingLife <= instance.thresholdLimit && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-700">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">Low Life Warning</span>
                      </div>
                      <p className="text-sm text-yellow-600 mt-1">
                        This tool is below the threshold limit of {instance.thresholdLimit} hours
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => handleStartUsage(instance._id)}
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Resume Using Instance #{instance.instanceNumber}
                  </button>
                </div>
              ))}

              {availableInstances.length === 0 && (
                <div className="text-center py-12">
                  <RotateCcw className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <div className="text-gray-500 text-lg">No reusable tool instances</div>
                  <p className="text-gray-400 text-sm mt-2">
                    Tool instances will appear here after you stop using them (if they have remaining life)
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Usage Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UsageChart title="My Usage Pattern" />
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Usage</h3>
                <div className="space-y-3">
                  {usage.slice(0, 8).map((record) => (
                    <div key={record._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 flex items-center gap-2">
                          {record.toolName}
                          {record.tool?.instanceNumber && (
                            <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                              <Hash className="w-3 h-3" />
                              {record.tool.instanceNumber}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(record.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{record.duration?.toFixed(1)}h</p>
                        <p className="text-xs text-gray-500">
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
  );
};

export default OperatorDashboard;