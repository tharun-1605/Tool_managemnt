import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Plus,
  Wrench,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Edit,
  Trash2,
  Check,
  X,
  Package,
  Clock,
  Activity,
  BarChart3,
  Settings,
  Bell,
  Filter,
  Search,
  Download,
  RefreshCw
} from 'lucide-react';
import StatsCard from '../common/StatsCard';
import ToolForm from '../tools/ToolForm';
import ToolsList from '../tools/ToolsList';
import OrdersList from '../orders/OrdersList';

const ShopkeeperDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [tools, setTools] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToolForm, setShowToolForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [statsRes, toolsRes, ordersRes] = await Promise.all([
        axios.get('https://tool-managemnt.onrender.com/api/dashboard/stats'),
        axios.get('https://tool-managemnt.onrender.com/api/tools'),
        axios.get('https://tool-managemnt.onrender.com/api/orders')
      ]);

      setStats(statsRes.data);
      setTools(toolsRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleOrderStatusUpdate = async (orderId, status, notes = '') => {
    try {
      await axios.put(`https://tool-managemnt.onrender.com/api/orders/${orderId}/status`, {
        status,
        notes
      });
      fetchData();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Dashboard Overview', icon: BarChart3, description: 'System metrics & insights' },
    { id: 'tools', label: 'Tool Management', icon: Wrench, description: 'Inventory & maintenance' },
    { id: 'orders', label: 'Order Processing', icon: ShoppingCart, description: 'Request management' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-4 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="w-12 h-12 border-4 border-slate-100 border-t-4 border-t-orange-500 rounded-full animate-spin absolute top-2 left-2" style={{animationDirection: 'reverse'}}></div>
          </div>
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Industrial Tool Management</h1>
                <p className="text-slate-600 mt-1">Shopkeeper Control Center</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fetchData()}
                disabled={refreshing}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border border-slate-300"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Wrench className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Inventory</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stats.totalTools || 0}</div>
                <p className="text-sm text-slate-600">Active tools in system</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-green-600 font-medium">+12% vs last month</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Critical Tools</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stats.lowLifeTools || 0}</div>
                <p className="text-sm text-slate-600">Require immediate attention</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-red-600 font-medium">Action needed</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Orders</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stats.pendingOrders || 0}</div>
                <p className="text-sm text-slate-600">Awaiting processing</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-yellow-600 font-medium">Review required</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Stock</span>
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stats.totalStock || 0}</div>
                <p className="text-sm text-slate-600">Units available</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-green-600 font-medium">Well stocked</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-8 overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50">
            <nav className="flex">
              {tabs.map((tab, index) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex flex-col items-center gap-3 py-6 px-8 font-medium text-sm transition-all duration-300 relative ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600 shadow-sm border-b-2 border-blue-600'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                    <div className="text-center">
                      <div className="font-semibold">{tab.label}</div>
                      <div className="text-xs text-slate-500 mt-1">{tab.description}</div>
                    </div>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t"></div>
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
                  {/* Recent Orders Enhanced */}
                  <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200 shadow-sm">
                    <div className="p-6 border-b border-slate-200 bg-white rounded-t-xl">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <ShoppingCart className="w-5 h-5 text-blue-600" />
                          </div>
                          Recent Order Activity
                        </h3>
                        <div className="flex gap-2">
                          <button className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100">
                            <Filter className="w-4 h-4" />
                          </button>
                          <button className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {orders.slice(0, 5).map((order, index) => (
                          <div key={order._id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex items-center gap-4">
                              <div className="bg-slate-100 p-3 rounded-lg">
                                <Wrench className="w-5 h-5 text-slate-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">{order.tool?.name}</p>
                                <div className="flex items-center gap-4 mt-1">
                                  <p className="text-sm text-slate-600">Quantity: <span className="font-medium">{order.quantity}</span></p>
                                  <p className="text-xs text-slate-500">#{order._id.slice(-6)}</p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                order.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                                'bg-slate-100 text-slate-800 border border-slate-200'
                              }`}>
                                {order.status.toUpperCase()}
                              </span>
                              <p className="text-xs text-slate-500 mt-1">Order #{index + 1}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Critical Tools Alert Enhanced */}
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-200 shadow-sm">
                    <div className="p-6 border-b border-red-200 bg-white rounded-t-xl">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        Critical Maintenance Alerts
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {tools
                          .filter(tool => tool.remainingLife <= tool.thresholdLimit)
                          .slice(0, 5)
                          .map((tool, index) => (
                            <div key={tool._id} className="flex items-center justify-between p-4 bg-white rounded-xl border-l-4 border-l-red-500 shadow-sm">
                              <div className="flex items-center gap-4">
                                <div className="bg-red-100 p-3 rounded-lg">
                                  <Wrench className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900">{tool.name}</p>
                                  <p className="text-sm text-red-700 font-medium">
                                    {tool.remainingLife.toFixed(1)}h remaining life
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="px-3 py-1 text-xs font-bold bg-red-100 text-red-800 rounded-full border border-red-200">
                                  URGENT
                                </span>
                                <p className="text-xs text-slate-500 mt-1">Priority #{index + 1}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Status Overview */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-lg">
                  <div className="p-6 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Activity className="w-5 h-5 text-green-600" />
                      </div>
                      System Health Monitor
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                          <Check className="w-8 h-8 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-slate-900">System Operational</h4>
                        <p className="text-sm text-slate-600 mt-1">All services running normally</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                          <TrendingUp className="w-8 h-8 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-slate-900">Performance Optimal</h4>
                        <p className="text-sm text-slate-600 mt-1">Response time within limits</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                          <Package className="w-8 h-8 text-purple-600" />
                        </div>
                        <h4 className="font-semibold text-slate-900">Inventory Synced</h4>
                        <p className="text-sm text-slate-600 mt-1">Real-time data accuracy</p>
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
                    <h2 className="text-2xl font-bold text-slate-900">Industrial Tool Management</h2>
                    <p className="text-slate-600 mt-1">Monitor, maintain, and manage your tool inventory</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search tools..."
                        className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border border-slate-300">
                      <Filter className="w-4 h-4" />
                      Filter
                    </button>
                    <button
                      onClick={() => setShowToolForm(true)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      <Plus className="w-5 h-5" />
                      Add New Tool
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                  <ToolsList 
                    tools={tools} 
                    onUpdate={fetchData}
                    userRole="shopkeeper"
                  />
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Order Processing Center</h2>
                    <p className="text-slate-600 mt-1">Review and manage tool requests</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search orders..."
                        className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border border-slate-300">
                      <Filter className="w-4 h-4" />
                      Filter Status
                    </button>
                    <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border border-slate-300">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                  <OrdersList 
                    orders={orders}
                    onStatusUpdate={handleOrderStatusUpdate}
                    userRole="shopkeeper"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {showToolForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100">
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                Add New Industrial Tool
              </h3>
              <p className="text-slate-600 mt-1">Register a new tool in the system</p>
            </div>
            <div className="p-6">
              <ToolForm
                onSubmit={() => {
                  setShowToolForm(false);
                  fetchData();
                }}
                onCancel={() => setShowToolForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopkeeperDashboard;
