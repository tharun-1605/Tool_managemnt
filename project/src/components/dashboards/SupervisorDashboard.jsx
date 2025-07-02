import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Store,
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle,
  Eye,
  Plus,
  BarChart3,
  Package,
  Play,
  CheckCircle,
  Users,
  Hash,
  Clock
} from 'lucide-react';
import StatsCard from '../common/StatsCard';
import ShopsList from '../shops/ShopsList';
import OrdersList from '../orders/OrdersList';
import ToolMonitor from '../tools/ToolMonitor';
import UsageChart from '../charts/UsageChart';
import MyToolsList from '../tools/MyToolsList';

const SupervisorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [tools, setTools] = useState([]);
  const [myTools, setMyTools] = useState([]);
  const [orders, setOrders] = useState([]);
  const [shops, setShops] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, toolsRes, myToolsRes, ordersRes, analyticsRes] = await Promise.all([
        axios.get('https://tool-managemnt.onrender.com/api/dashboard/stats'),
        axios.get('https://tool-managemnt.onrender.com/api/tools'),
        axios.get('https://tool-managemnt.onrender.com/api/tools/my-tools'),
        axios.get('https://tool-managemnt.onrender.com/api/orders'),
        axios.get('https://tool-managemnt.onrender.com/api/usage/supervisor-analytics')
      ]);

      setStats(statsRes.data);
      setTools(toolsRes.data);
      setMyTools(myToolsRes.data);
      setOrders(ordersRes.data);
      setAnalytics(analyticsRes.data);
      
      // Group tools by shop
      const shopMap = {};
      toolsRes.data.forEach(tool => {
        const shopName = tool.shopkeeper?.shopName || 'Unknown';
        if (!shopMap[shopName]) {
          shopMap[shopName] = {
            shopName,
            shopkeeper: tool.shopkeeper,
            tools: []
          };
        }
        shopMap[shopName].tools.push(tool);
      });
      setShops(Object.values(shopMap));
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (toolId, quantity, notes) => {
    try {
      await axios.post('https://tool-managemnt.onrender.com/api/orders', {
        toolId,
        quantity,
        notes
      });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'my-tools', label: 'My Tools', icon: Package },
    { id: 'shops', label: 'All Shops', icon: Store },
    { id: 'orders', label: 'My Orders', icon: ShoppingCart },
    { id: 'monitor', label: 'Tool Monitor', icon: Eye },
    { id: 'analytics', label: 'Usage Analytics', icon: BarChart3 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders || 0}
          icon={ShoppingCart}
          color="green"
        />
        <StatsCard
          title="My Tools"
          value={myTools.length || 0}
          icon={Package}
          color="blue"
        />
        <StatsCard
          title="Pending Orders"
          value={stats.pendingOrders || 0}
          icon={AlertTriangle}
          color="yellow"
        />
        <StatsCard
          title="Active Usage"
          value={analytics.toolSummary?.reduce((sum, tool) => sum + (tool.instanceCount || 0), 0) || 0}
          icon={Play}
          color="orange"
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
                    ? 'border-green-500 text-green-600'
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
            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{order.tool?.name}</p>
                      <p className="text-sm text-gray-600">Qty: {order.quantity}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'approved' ? 'bg-green-100 text-green-800' :
                      order.status === 'fulfilled' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* My Tools Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-green-500" />
                My Tools Summary
              </h3>
              <div className="space-y-3">
                {myTools.slice(0, 5).map((tool) => (
                  <div key={tool._id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <p className="font-medium text-gray-900">{tool.name}</p>
                      <p className="text-sm text-green-600">
                        Ordered: {tool.companyQuantity} | Available: {tool.availableQuantity} | In Use: {tool.inUseQuantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        {tool.availableQuantity > 0 && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {tool.inUseQuantity > 0 && <Play className="w-4 h-4 text-blue-500" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'my-tools' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">My Company's Tools</h2>
            <MyToolsList tools={myTools} />
          </div>
        )}

        {activeTab === 'shops' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">All Shops & Tools</h2>
            <ShopsList 
              shops={shops}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">My Orders</h2>
            <OrdersList 
              orders={orders}
              userRole="supervisor"
            />
          </div>
        )}

        {activeTab === 'monitor' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Tool Monitor</h2>
            <ToolMonitor tools={tools} />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Usage Analytics</h2>
            
            {/* Tool Usage Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tool Usage Summary</h3>
                <div className="space-y-4">
                  {analytics.toolSummary?.slice(0, 5).map((tool) => (
                    <div key={tool._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{tool.toolName}</p>
                        <p className="text-sm text-gray-600 capitalize">{tool.toolCategory}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{tool.totalUsage?.toFixed(1)}h</p>
                        <p className="text-xs text-gray-500">
                          {tool.operatorCount} operators, {tool.instanceCount} instances
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <UsageChart title="Company Usage Overview" />
            </div>

            {/* Detailed Usage Analytics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Detailed Usage by Tool & Operator
              </h3>
              
              <div className="space-y-6">
                {Object.entries(analytics.detailedUsage || {}).map(([toolId, toolData]) => (
                  <div key={toolId} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4 text-green-500" />
                      {toolData.toolName}
                      <span className="text-sm text-gray-500 capitalize">({toolData.toolCategory})</span>
                    </h4>
                    
                    <div className="space-y-3">
                      {Object.entries(toolData.operators).map(([operatorId, operatorData]) => (
                        <div key={operatorId} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium text-gray-900">{operatorData.operatorName}</p>
                              <p className="text-sm text-gray-600">{operatorData.operatorEmail}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{operatorData.totalDuration.toFixed(1)}h total</p>
                              <p className="text-xs text-gray-500">{operatorData.totalSessions} sessions</p>
                            </div>
                          </div>
                          
                          {/* Instance Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                            {operatorData.instances.map((instance, index) => (
                              <div key={index} className="bg-white rounded p-2 border border-gray-200">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-blue-600 flex items-center gap-1">
                                    <Hash className="w-3 h-3" />
                                    Instance #{instance.instanceNumber}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    instance.isActive ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                                  }`}>
                                    {instance.isActive ? 'Active' : 'Completed'}
                                  </span>
                                </div>
                                <div className="mt-1">
                                  <p className="text-xs text-gray-600">
                                    <Clock className="w-3 h-3 inline mr-1" />
                                    {instance.duration ? `${instance.duration.toFixed(1)}h` : 'In progress'}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(instance.startTime).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {Object.keys(analytics.detailedUsage || {}).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No usage data available</p>
                    <p className="text-sm mt-1">Data will appear here once operators start using tools</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupervisorDashboard;