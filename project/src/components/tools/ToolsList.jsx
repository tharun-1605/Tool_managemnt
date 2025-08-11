import React, { useState } from 'react';
import axios from 'axios';
import { 
  Edit, 
  Trash2, 
  AlertTriangle, 
  CheckCircle,
  Settings,
  Package,
  ShoppingCart,
  Search,
  Filter,
  Plus,
  Eye,
  TrendingUp,
  Clock,
  Target,
  Zap,
  Activity,
  Download,
  RefreshCw,
  MoreVertical,
  Building,
  User
} from 'lucide-react';
import ToolForm from './ToolForm';

const ToolsList = ({ tools, onUpdate, userRole }) => {
  const [editingTool, setEditingTool] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [deletingToolId, setDeletingToolId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');

  const handleDelete = async (toolId) => {
    if (window.confirm('Are you sure you want to delete this tool? This action cannot be undone.')) {
      try {
        setDeletingToolId(toolId);
        const base = import.meta?.env?.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : 'https://tool-managemnt.onrender.com');
        await axios.delete(`${base}/api/tools/${toolId}`);
        onUpdate();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete tool');
      } finally {
        setDeletingToolId(null);
      }
    }
  };

  const getStatusConfig = (tool) => {
    switch (tool.status) {
      case 'available':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'from-green-50 to-emerald-50',
          border: 'border-green-200',
          badge: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'maintenance':
        return {
          icon: Settings,
          color: 'text-yellow-600',
          bg: 'from-yellow-50 to-amber-50',
          border: 'border-yellow-200',
          badge: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'in-use':
        return {
          icon: Activity,
          color: 'text-blue-600',
          bg: 'from-blue-50 to-indigo-50',
          border: 'border-blue-200',
          badge: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      default:
        return {
          icon: Package,
          color: 'text-slate-500',
          bg: 'from-slate-50 to-slate-100',
          border: 'border-slate-200',
          badge: 'bg-slate-100 text-slate-800 border-slate-200'
        };
    }
  };

  const getLifeConfig = (tool) => {
    const percentage = (tool.remainingLife / tool.lifeLimit) * 100;
    const thresholdPercentage = (tool.thresholdLimit / tool.lifeLimit) * 100;
    
    if (percentage <= thresholdPercentage) {
      return {
        textColor: 'text-red-600',
        barColor: 'bg-red-500',
        status: 'critical'
      };
    }
    if (percentage <= 30) {
      return {
        textColor: 'text-yellow-600',
        barColor: 'bg-yellow-500',
        status: 'warning'
      };
    }
    return {
      textColor: 'text-green-600',
      barColor: 'bg-green-500',
      status: 'good'
    };
  };

  const filteredAndSortedTools = tools
    .filter(tool => {
      const matchesSearch = searchQuery === '' || 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || 
        (filterStatus === 'low-life' && tool.remainingLife <= tool.thresholdLimit) ||
        (filterStatus === 'available' && tool.status === 'available') ||
        (filterStatus === 'maintenance' && tool.status === 'maintenance');
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'life':
          return a.remainingLife - b.remainingLife;
        case 'status':
          return (a.status || 'available').localeCompare(b.status || 'available');
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  const getToolStats = () => {
    return {
      total: tools.length,
      available: tools.filter(t => (t.status || 'available') === 'available').length,
      maintenance: tools.filter(t => t.status === 'maintenance').length,
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
            <h2 className="text-2xl font-bold text-slate-900">
              {userRole === 'shopkeeper' ? 'Tool Inventory Management' : 'Available Tools Catalog'}
            </h2>
            <p className="text-slate-600 mt-1">
              {userRole === 'shopkeeper' 
                ? 'Manage your shop\'s tool inventory and track performance' 
                : 'Browse and order tools from certified suppliers'
              }
            </p>
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
              <option value="maintenance">Maintenance</option>
              <option value="low-life">Low Life</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
            >
              <option value="name">Sort by Name</option>
              <option value="life">Sort by Life</option>
              <option value="status">Sort by Status</option>
              <option value="category">Sort by Category</option>
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

          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-200">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Settings className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-yellow-700 font-medium">Maintenance</p>
                <p className="text-2xl font-bold text-yellow-800">{stats.maintenance}</p>
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
        </div>
      </div>

      {/* Tools Grid */}
      {filteredAndSortedTools.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12">
            <div className="bg-slate-100 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <Package className="w-16 h-16 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">No Tools Found</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              {searchQuery || filterStatus !== 'all' 
                ? 'No tools match your current search or filter criteria. Try adjusting your filters.'
                : userRole === 'shopkeeper' 
                  ? 'Add your first tool to get started with inventory management.'
                  : 'No tools are available for ordering at this time.'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTools.map((tool) => {
            const statusConfig = getStatusConfig(tool);
            const lifeConfig = getLifeConfig(tool);
            const StatusIcon = statusConfig.icon;
            const lifePercentage = (tool.remainingLife / tool.lifeLimit) * 100;

            return (
              <div 
                key={tool._id} 
                className={`bg-gradient-to-br ${statusConfig.bg} rounded-2xl shadow-lg border ${statusConfig.border} p-6 hover:shadow-xl transition-all duration-300 group overflow-hidden`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-xl group-hover:text-blue-600 transition-colors">
                      {tool.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-slate-700 capitalize">
                        {tool.category}
                      </span>
                    </div>
                    {tool.shopkeeper?.shopName && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-blue-600">
                        <Building className="w-3 h-3" />
                        <span>Shop: {tool.shopkeeper.shopName}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="bg-white/60 backdrop-blur-sm p-2 rounded-lg">
                      <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border font-bold ${statusConfig.badge}`}>
                      {(tool.status || 'available').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-700 mb-4 leading-relaxed line-clamp-2">
                  {tool.description}
                </p>

                {/* Life Progress - Only for Shopkeepers */}
                {userRole === 'shopkeeper' && (
                  <div className="mb-4">
                    <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-slate-700">Equipment Life Status</span>
                        <span className={`text-sm font-bold ${lifeConfig.textColor}`}>
                          {tool.remainingLife.toFixed(1)}h / {tool.lifeLimit}h
                        </span>
                      </div>
                      
                      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full ${lifeConfig.barColor} transition-all duration-500`}
                          style={{ width: `${Math.max(5, lifePercentage)}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-slate-600 mt-2">
                        <span>Used: {(100 - lifePercentage).toFixed(1)}%</span>
                        <span>Remaining: {lifePercentage.toFixed(1)}%</span>
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
                  </div>
                )}

                {/* Enhanced Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {userRole === 'shopkeeper' && (
                    <>
                      <div className="bg-white/50 backdrop-blur-sm p-3 rounded-xl text-center">
                        <Package className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <p className="text-xs text-slate-600 font-medium">Available Stock</p>
                        <p className="text-lg font-bold text-blue-700">{tool.stock || 0}</p>
                      </div>
                      <div className="bg-white/50 backdrop-blur-sm p-3 rounded-xl text-center">
                        <Target className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                        <p className="text-xs text-slate-600 font-medium">Threshold</p>
                        <p className="text-lg font-bold text-yellow-700">{tool.thresholdLimit}h</p>
                      </div>
                    </>
                  )}
                  
                  {userRole === 'supervisor' && (
                    <>
                      <div className="bg-white/50 backdrop-blur-sm p-3 rounded-xl text-center">
                        <Clock className="w-5 h-5 text-green-600 mx-auto mb-1" />
                        <p className="text-xs text-slate-600 font-medium">Life Limit</p>
                        <p className="text-lg font-bold text-green-700">{tool.lifeLimit}h</p>
                      </div>
                      <div className="bg-white/50 backdrop-blur-sm p-3 rounded-xl text-center">
                        <Package className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                        <p className="text-xs text-slate-600 font-medium">Available Stock</p>
                        <p className="text-lg font-bold text-purple-700">{tool.stock || 0}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Total Orders Summary - Only for Shopkeepers */}
                {userRole === 'shopkeeper' && tool.orderedByCompanies && tool.orderedByCompanies.length > 0 && (
                  <div className="mb-4 bg-white/30 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <h4 className="text-sm font-bold text-blue-900">Order Analytics</h4>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {tool.orderedByCompanies.reduce((sum, order) => sum + order.orderedQuantity, 0)}
                      </p>
                      <p className="text-xs text-blue-700 font-medium">Units Ordered by Companies</p>
                    </div>
                  </div>
                )}

                {/* Enhanced Actions */}
                <div className="flex gap-3">
                  {userRole === 'shopkeeper' && (
                    <>
                      <button
                        onClick={() => {
                          setEditingTool(tool);
                          setShowEditForm(true);
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Tool
                      </button>
                      <button
                        onClick={() => handleDelete(tool._id)}
                        disabled={deletingToolId === tool._id}
                        className="px-4 py-3 border-2 border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
                      >
                        {deletingToolId === tool._id ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </>
                  )}

                  {userRole === 'supervisor' && (
                    <div className="w-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 py-3 px-4 rounded-xl text-center flex items-center justify-center gap-2 font-semibold border border-green-200">
                      <ShoppingCart className="w-5 h-5" />
                      Available for Order
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Enhanced Edit Modal */}
      {showEditForm && editingTool && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100">
            <ToolForm
              tool={editingTool}
              onSubmit={() => {
                setShowEditForm(false);
                setEditingTool(null);
                onUpdate();
              }}
              onCancel={() => {
                setShowEditForm(false);
                setEditingTool(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolsList;
