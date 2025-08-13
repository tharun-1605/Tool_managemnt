import React, { useState } from 'react';
import { 
  Package, 
  Play, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  TrendingUp,
  Wrench,
  Activity,
  Target,
  BarChart3,
  Filter,
  Search,
  Eye,
  ArrowUpDown,
  Zap,
  Shield,
  Award,
  Settings,
  RefreshCw,
  Download,
  Calendar,
  User,
  Building
} from 'lucide-react';

const MyToolsList = ({ tools = [], userRole = 'supervisor' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [showDetails, setShowDetails] = useState({});

  const getLifeConfig = (tool) => {
    const percentage = (tool.remainingLife / tool.lifeLimit) * 100;
    const thresholdPercentage = (tool.thresholdLimit / tool.lifeLimit) * 100;

    if (percentage <= thresholdPercentage) {
      return {
        color: 'text-red-600',
        bgColor: 'bg-red-500',
        status: 'critical',
        statusBg: 'bg-red-100 text-red-800 border-red-200',
        cardBg: 'from-red-50 to-pink-50',
        cardBorder: 'border-red-200'
      };
    }
    if (percentage <= 30) {
      return {
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-500',
        status: 'warning',
        statusBg: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        cardBg: 'from-yellow-50 to-amber-50',
        cardBorder: 'border-yellow-200'
      };
    }
    return {
      color: 'text-green-600',
      bgColor: 'bg-green-500',
      status: 'good',
      statusBg: 'bg-green-100 text-green-800 border-green-200',
      cardBg: 'from-green-50 to-emerald-50',
      cardBorder: 'border-green-200'
    };
  };

  const getToolStatus = (tool) => {
    if (tool.availableQuantity > 0 && tool.inUseQuantity > 0) return 'mixed';
    if (tool.inUseQuantity > 0) return 'active';
    if (tool.availableQuantity > 0) return 'available';
    return 'depleted';
  };

  const toggleDetails = (toolId) => {
    setShowDetails(prev => ({
      ...prev,
      [toolId]: !prev[toolId]
    }));
  };

  const filteredAndSortedTools = tools
    .filter(tool => {
      const matchesSearch = searchQuery === '' || 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || getToolStatus(tool) === filterStatus;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'life':
          return a.remainingLife - b.remainingLife;
        case 'usage':
          return (b.totalUsageHours || 0) - (a.totalUsageHours || 0);
        case 'status':
          return getToolStatus(a).localeCompare(getToolStatus(b));
        default:
          return 0;
      }
    });

  const getToolStats = () => {
    return {
      total: tools.length,
      available: tools.filter(t => t.availableQuantity > 0).length,
      active: tools.filter(t => t.inUseQuantity > 0).length,
      critical: tools.filter(t => t.remainingLife <= t.thresholdLimit).length
    };
  };

  const stats = getToolStats();

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Controls */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Company Tool Inventory</h2>
            <p className="text-slate-600 mt-1">Manage and monitor your organization's equipment</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative w-full sm:w-auto">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="active">In Use</option>
              <option value="mixed">Mixed</option>
              <option value="depleted">Depleted</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
            >
              <option value="name">Sort by Name</option>
              <option value="life">Sort by Life</option>
              <option value="usage">Sort by Usage</option>
              <option value="status">Sort by Status</option>
            </select>

            <button className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Total Tools</p>
                <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-700 font-medium">Available</p>
                <p className="text-2xl font-bold text-green-800">{stats.available}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Activity className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-orange-700 font-medium">In Use</p>
                <p className="text-2xl font-bold text-orange-800">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border border-red-200">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-red-700 font-medium">Critical</p>
                <p className="text-2xl font-bold text-red-800">{stats.critical}</p>
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
              <Package className="w-16 h-16 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">No Tools Found</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              {searchQuery || filterStatus !== 'all' 
                ? 'No tools match your current search or filter criteria. Try adjusting your filters to find more tools.'
                : 'Your organization hasn\'t ordered any tools yet. Start by placing orders from available shops to build your equipment inventory.'
              }
            </p>
            {(searchQuery || filterStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAndSortedTools.map((tool) => {
            const lifeConfig = getLifeConfig(tool);
            const toolStatus = getToolStatus(tool);
            const isExpanded = showDetails[tool._id];

            return (
              <div 
                key={tool._id} 
                className={`bg-gradient-to-br ${lifeConfig.cardBg} rounded-2xl shadow-lg border ${lifeConfig.cardBorder} overflow-hidden hover:shadow-xl transition-all duration-300 group`}
              >
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 text-xl group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-slate-700 capitalize">
                          {tool.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full border font-bold ${lifeConfig.statusBg}`}>
                          {lifeConfig.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-white/60 backdrop-blur-sm p-2 rounded-lg">
                        <Wrench className="w-5 h-5 text-slate-600" />
                      </div>
                      <button
                        onClick={() => toggleDetails(tool._id)}
                        className="p-2 bg-white/60 hover:bg-white/80 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>

                  {/* Shop Info */}
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                    <Building className="w-4 h-4" />
                    <span>Supplied by: <span className="font-semibold text-blue-600">{tool.shopkeeper?.shopName}</span></span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-700 mb-4 leading-relaxed">{tool.description}</p>

                  {/* Enhanced Quantity Stats */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="bg-white/50 backdrop-blur-sm p-3 rounded-xl text-center">
                      <Package className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs text-slate-600 font-medium">Ordered</p>
                      <p className="text-lg font-bold text-blue-700">{tool.companyQuantity}</p>
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm p-3 rounded-xl text-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-slate-600 font-medium">Available</p>
                      <p className="text-lg font-bold text-green-700">{tool.availableQuantity}</p>
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm p-3 rounded-xl text-center">
                      <Activity className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                      <p className="text-xs text-slate-600 font-medium">In Use</p>
                      <p className="text-lg font-bold text-orange-700">{tool.inUseQuantity}</p>
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm p-3 rounded-xl text-center">
                      <Target className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-xs text-slate-600 font-medium">Reusable</p>
                      <p className="text-lg font-bold text-purple-700">{tool.reusable ? 'Yes' : 'No'}</p>
                    </div>
                  </div>

                  {/* Life Progress or Reusable Badge */}
                  <div className="mb-4">
                    {tool.reusable ? (
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCw className="w-5 h-5 text-green-600" />
                          <span className="font-bold text-green-700">Unlimited Reusability</span>
                        </div>
                        <p className="text-sm text-slate-600 text-center mt-1">This tool can be reused indefinitely</p>
                      </div>
                    ) : (
                      <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-bold text-slate-700">Equipment Life Status</span>
                          <span className={`text-sm font-bold ${lifeConfig.color}`}>
                            {tool.remainingLife.toFixed(1)}h / {tool.lifeLimit}h
                          </span>
                        </div>
                        
                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-3 rounded-full ${lifeConfig.bgColor} transition-all duration-500`}
                            style={{ width: `${Math.max(5, (tool.remainingLife / tool.lifeLimit) * 100)}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between text-xs text-slate-600 mt-2">
                          <span>Used: {((tool.lifeLimit - tool.remainingLife) / tool.lifeLimit * 100).toFixed(1)}%</span>
                          <span>Remaining: {(tool.remainingLife / tool.lifeLimit * 100).toFixed(1)}%</span>
                        </div>

                        {tool.remainingLife <= tool.thresholdLimit && (
                          <div className="flex items-center gap-2 mt-3 p-2 bg-red-100/80 rounded-lg border border-red-200">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span className="text-xs font-semibold text-red-700">
                              Critical: Below {tool.thresholdLimit}h threshold
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20 mb-4">
                      <h4 className="font-bold text-slate-900 mb-3">Detailed Analytics</h4>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-slate-700">Usage Statistics</span>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Total Usage:</span>
                              <span className="font-bold text-slate-900">{tool.totalUsageHours?.toFixed(1) || 0}h</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Efficiency:</span>
                              <span className="font-bold text-blue-600">
                                {tool.lifeLimit > 0 ? ((tool.totalUsageHours || 0) / tool.lifeLimit * 100).toFixed(1) : 0}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-slate-700">Specifications</span>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Life Limit:</span>
                              <span className="font-bold text-slate-900">{tool.lifeLimit}h</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Threshold:</span>
                              <span className="font-bold text-yellow-600">{tool.thresholdLimit}h</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order History */}
                      <div className="border-t border-white/20 pt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-slate-700">Order Information</span>
                        </div>
                        <div className="text-xs text-slate-600">
                          <p>Ordered from: <span className="font-medium text-purple-600">{tool.shopkeeper?.shopName}</span></p>
                          <p>Supplier: <span className="font-medium">{tool.shopkeeper?.name}</span></p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status Summary */}
                  <div className="bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-700">Current Status:</span>
                      <div className="flex items-center gap-2">
                        {toolStatus === 'available' && (
                          <span className="flex items-center gap-1 text-green-600 font-medium">
                            <CheckCircle className="w-4 h-4" />
                            Available for Use
                          </span>
                        )}
                        {toolStatus === 'active' && (
                          <span className="flex items-center gap-1 text-blue-600 font-medium">
                            <Activity className="w-4 h-4" />
                            Currently Active
                          </span>
                        )}
                        {toolStatus === 'mixed' && (
                          <span className="flex items-center gap-1 text-orange-600 font-medium">
                            <Zap className="w-4 h-4" />
                            Partially In Use
                          </span>
                        )}
                        {toolStatus === 'depleted' && (
                          <span className="flex items-center gap-1 text-red-600 font-medium">
                            <AlertTriangle className="w-4 h-4" />
                            Fully Utilized
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Utilization Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span>Utilization Rate</span>
                        <span>{((tool.inUseQuantity / tool.companyQuantity) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${(tool.inUseQuantity / tool.companyQuantity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyToolsList;
