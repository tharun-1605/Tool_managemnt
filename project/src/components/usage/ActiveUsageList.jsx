import React, { useState, useEffect } from 'react';
import { 
  Square, 
  Clock, 
  AlertTriangle, 
  Activity,
  Timer,
  Zap,
  Target,
  TrendingUp,
  Hash,
  Play,
  Pause,
  Building,
  User,
  RefreshCw,
  Download,
  Filter,
  Search
} from 'lucide-react';

const ActiveUsageList = ({ tools, onStopUsage }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('duration');

  // Update current time every minute for live duration calculation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const calculateUsageDuration = (startTime) => {
    const now = currentTime;
    const start = new Date(startTime);
    const durationMs = now - start;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return {
      display: `${hours}h ${minutes}m`,
      totalMinutes: Math.floor(durationMs / (1000 * 60)),
      totalHours: durationMs / (1000 * 60 * 60)
    };
  };

  const getLifeConfig = (tool) => {
    const percentage = (tool.remainingLife / tool.lifeLimit) * 100;
    const thresholdPercentage = (tool.thresholdLimit / tool.lifeLimit) * 100;
    
    if (percentage <= thresholdPercentage) {
      return {
        color: 'text-red-600',
        bgColor: 'from-red-500 to-pink-600',
        status: 'critical',
        cardBg: 'from-red-50 to-pink-50',
        cardBorder: 'border-red-200'
      };
    }
    if (percentage <= 30) {
      return {
        color: 'text-yellow-600',
        bgColor: 'from-yellow-500 to-orange-500',
        status: 'warning',
        cardBg: 'from-yellow-50 to-amber-50',
        cardBorder: 'border-yellow-200'
      };
    }
    return {
      color: 'text-green-600',
      bgColor: 'from-green-500 to-blue-500',
      status: 'good',
      cardBg: 'from-blue-50 to-indigo-50',
      cardBorder: 'border-blue-200'
    };
  };

  const filteredAndSortedTools = tools
    .filter(tool => {
      const matchesSearch = searchQuery === '' || 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const lifeConfig = getLifeConfig(tool);
      const matchesFilter = filterStatus === 'all' || 
        (filterStatus === 'critical' && lifeConfig.status === 'critical') ||
        (filterStatus === 'warning' && lifeConfig.status === 'warning') ||
        (filterStatus === 'good' && lifeConfig.status === 'good');
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'duration':
          return calculateUsageDuration(b.usageStartTime).totalMinutes - calculateUsageDuration(a.usageStartTime).totalMinutes;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'life':
          return a.remainingLife - b.remainingLife;
        case 'started':
          return new Date(b.usageStartTime) - new Date(a.usageStartTime);
        default:
          return 0;
      }
    });

  const getUsageStats = () => {
    return {
      total: tools.length,
      critical: tools.filter(t => t.remainingLife <= t.thresholdLimit).length,
      warning: tools.filter(t => {
        const percentage = (t.remainingLife / t.lifeLimit) * 100;
        return percentage > (t.thresholdLimit / t.lifeLimit) * 100 && percentage <= 30;
      }).length,
      totalHours: tools.reduce((sum, tool) => sum + calculateUsageDuration(tool.usageStartTime).totalHours, 0)
    };
  };

  const stats = getUsageStats();

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Controls */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              Active Tool Operations
            </h2>
            <p className="text-slate-600 mt-1">Monitor and control currently active equipment usage</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search active tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="critical">Critical Life</option>
              <option value="warning">Warning</option>
              <option value="good">Good Condition</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="duration">Sort by Duration</option>
              <option value="name">Sort by Name</option>
              <option value="life">Sort by Life</option>
              <option value="started">Sort by Start Time</option>
            </select>

            <button className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Activity className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-orange-700 font-medium">Active Tools</p>
                <p className="text-2xl font-bold text-orange-800">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border border-red-200">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-red-700 font-medium">Critical Life</p>
                <p className="text-2xl font-bold text-red-800">{stats.critical}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-200">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Timer className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-yellow-700 font-medium">Warning</p>
                <p className="text-2xl font-bold text-yellow-800">{stats.warning}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Total Hours</p>
                <p className="text-2xl font-bold text-blue-800">{stats.totalHours.toFixed(1)}h</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools List */}
      {filteredAndSortedTools.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12">
            <div className="bg-slate-100 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <Activity className="w-16 h-16 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">No Active Operations</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              {searchQuery || filterStatus !== 'all' 
                ? 'No active tools match your current search or filter criteria. Try adjusting your filters.'
                : 'No tools are currently in active use. Start using equipment to monitor operations here.'
              }
            </p>
            {(searchQuery || filterStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                }}
                className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-semibold"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedTools.map((tool) => {
            const duration = calculateUsageDuration(tool.usageStartTime);
            const lifeConfig = getLifeConfig(tool);
            const usedPercentage = ((tool.lifeLimit - tool.remainingLife) / tool.lifeLimit) * 100;
            const remainingPercentage = (tool.remainingLife / tool.lifeLimit) * 100;

            return (
              <div 
                key={tool._id} 
                className={`bg-gradient-to-br ${lifeConfig.cardBg} rounded-2xl shadow-lg border ${lifeConfig.cardBorder} p-6 hover:shadow-xl transition-all duration-300`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-slate-900 text-xl">{tool.name}</h3>
                      {tool.instanceNumber && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          Instance #{tool.instanceNumber}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full font-medium text-slate-700 capitalize">
                        {tool.category}
                      </span>
                      {tool.shopkeeper?.shopId && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <Building className="w-3 h-3" />
                          <span>Shop: {tool.shopkeeper.shopId}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 text-sm font-bold rounded-xl border border-orange-200 flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      ACTIVE
                    </span>
                    <p className="text-xs text-slate-500 mt-1">Real-time monitoring</p>
                  </div>
                </div>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 p-2 rounded-lg">
                        <Play className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 font-medium">Started</p>
                        <p className="font-bold text-slate-900">{new Date(tool.usageStartTime).toLocaleTimeString()}</p>
                        <p className="text-xs text-slate-500">{new Date(tool.usageStartTime).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Timer className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 font-medium">Duration</p>
                        <p className="font-bold text-blue-700 text-lg">{duration.display}</p>
                        <p className="text-xs text-blue-600">{duration.totalHours.toFixed(2)} hours</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className={`${lifeConfig.status === 'critical' ? 'bg-red-100' : lifeConfig.status === 'warning' ? 'bg-yellow-100' : 'bg-green-100'} p-2 rounded-lg`}>
                        <Target className={`w-5 h-5 ${lifeConfig.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 font-medium">Remaining Life</p>
                        <p className={`font-bold text-lg ${lifeConfig.color}`}>
                          {tool.remainingLife.toFixed(1)}h
                        </p>
                        <p className="text-xs text-slate-500">of {tool.lifeLimit}h total</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Life Progress Bar */}
                <div className="mb-6">
                  <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-bold text-slate-700">Equipment Life Status</span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-slate-600">
                          {usedPercentage.toFixed(1)}% utilized
                        </span>
                        <p className="text-xs text-slate-500">
                          {remainingPercentage.toFixed(1)}% remaining
                        </p>
                      </div>
                    </div>
                    
                    <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-4 rounded-full bg-gradient-to-r ${lifeConfig.bgColor} transition-all duration-500 relative`}
                        style={{ width: `${Math.max(5, usedPercentage)}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-slate-600 mt-2">
                      <span>0h (Start)</span>
                      <span className="font-medium">Current: {(tool.lifeLimit - tool.remainingLife).toFixed(1)}h</span>
                      <span>{tool.lifeLimit}h (End)</span>
                    </div>
                  </div>
                </div>

                {/* Critical Warning */}
                {tool.remainingLife <= tool.thresholdLimit && (
                  <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-red-800">Critical Life Alert</h4>
                        <p className="text-red-700 text-sm">Immediate attention required</p>
                      </div>
                    </div>
                    <div className="bg-red-100/50 rounded-lg p-3 mt-3">
                      <p className="text-sm text-red-700 font-medium">
                        ⚠️ Tool life is below threshold limit of {tool.thresholdLimit} hours. 
                        Consider stopping usage and scheduling replacement.
                      </p>
                    </div>
                  </div>
                )}

                {/* Enhanced Stop Button */}
                <div className="flex gap-3">
                  <button
                    onClick={() => onStopUsage(tool._id)}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center gap-3 font-bold text-lg shadow-lg hover:shadow-xl"
                  >
                    <Square className="w-5 h-5" />
                    Stop Operation
                    {tool.instanceNumber && <span className="text-red-200">#{tool.instanceNumber}</span>}
                  </button>
                  
                  <button
                    className="px-4 py-4 bg-white/60 hover:bg-white/80 text-slate-700 rounded-xl transition-colors border border-white/40"
                    title="Refresh data"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>

                {/* Live Status Indicator */}
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live monitoring • Updated {currentTime.toLocaleTimeString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActiveUsageList;
