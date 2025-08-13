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

  Clock,

  RefreshCw,

  XCircle,

  Activity,

  Settings,

  Bell,

  Filter,

  Download

} from 'lucide-react';

import StatsCard from '../common/StatsCard';
import { useNotifications } from '../../contexts/NotificationContext';

import ShopsList from '../shops/ShopsList';

import OrdersList from '../orders/OrdersList';

import ToolMonitor from '../tools/ToolMonitor';

import UsageChart from '../charts/UsageChart';

import MyToolsList from '../tools/MyToolsList';



const SupervisorDashboard = () => {
  const { notifications, addNotification } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);

  const [activeTab, setActiveTab] = useState('overview');

  const [stats, setStats] = useState({});

  const [tools, setTools] = useState([]);
  const [monitorTools, setMonitorTools] = useState([]);

  const [myTools, setMyTools] = useState([]);

  const [orders, setOrders] = useState([]);

  const [shops, setShops] = useState([]);

  const [analytics, setAnalytics] = useState({});

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [loadingProgress, setLoadingProgress] = useState('');

  // Tool Requests State
  const [toolRequests, setToolRequests] = useState([]);
  const [toolRequestsLoading, setToolRequestsLoading] = useState(false);
  const [toolRequestsError, setToolRequestsError] = useState(null);



  useEffect(() => {
    fetchData();
    fetchToolRequests();
  }, []);

  // Notify supervisor about all tools already below threshold on dashboard load
  useEffect(() => {
    const fetchLowLifeTools = async () => {
      try {
        const base = import.meta?.env?.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : 'https://tool-managemnt.onrender.com');
        const res = await axios.get(`${base}/api/tools/low-life`);
        const lowLifeTools = res.data;
        if (lowLifeTools && lowLifeTools.length > 0) {
          const alreadyNotified = notifications.some(
            n => n.type === 'warning' && n.title === 'Tools Below Threshold'
          );
          if (!alreadyNotified) {
            const toolList = lowLifeTools.map(tool =>
              `${tool.name} (${Number(tool.remainingLife).toFixed(1)}h left, threshold: ${tool.thresholdLimit})`
            ).join('\n');
            addNotification({
              id: `tool-threshold-${Date.now()}-${Math.floor(Math.random()*10000)}`,
              type: 'warning',
              title: 'Tools Below Threshold',
              message: `The following tools are below their threshold limit:\n${toolList}`,
              timestamp: new Date()
            });
          }
        }
      } catch (error) {
        console.error('Error fetching low life tools:', error);
      }
    };
    fetchLowLifeTools();
  }, []);



  const fetchData = async () => {

    setLoading(true);

    setError(null);

    

    try {

      setLoadingProgress('Loading dashboard stats...');

      

      const timeout = 30000;

      const axiosConfig = {

        timeout: timeout,

        headers: { 'Content-Type': 'application/json' }

      };



      setLoadingProgress('Fetching data from server...');

      

      const base = import.meta?.env?.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : 'https://tool-managemnt.onrender.com');
      const [statsRes, toolsRes, myToolsRes, ordersRes, analyticsRes, monitorToolsRes] = await Promise.all([

        axios.get(`${base}/api/dashboard/stats`, axiosConfig)
          .catch(err => {

            console.error('Stats API failed:', err);

            return { data: {} };

          }),

        axios.get(`${base}/api/tools`, axiosConfig)
          .catch(err => {

            console.error('Tools API failed:', err);

            return { data: [] };

          }),

        axios.get(`${base}/api/tools/my-tools`, axiosConfig)
          .catch(err => {

            console.error('My Tools API failed:', err);

            return { data: [] };

          }),

        axios.get(`${base}/api/orders`, axiosConfig)
          .catch(err => {

            console.error('Orders API failed:', err);

            return { data: [] };

          }),

        axios.get(`${base}/api/usage/supervisor-analytics`, axiosConfig)
          .catch(err => {

            console.error('Analytics API failed:', err);

            return { data: {} };

          }),
        axios.get(`${base}/api/tools/monitor-instances`, axiosConfig)
          .catch(err => {
            console.error('Monitor Tools API failed:', err);
            return { data: [] };
          })

      ]);



      setLoadingProgress('Processing data...');



      setStats(statsRes.data || {});


  setTools(toolsRes.data || []);
  console.log('Loaded tools:', toolsRes.data || []);

  console.log('My Tools API response:', myToolsRes.data);
  setMyTools(myToolsRes.data || []);

      setOrders(ordersRes.data || []);

      setAnalytics(analyticsRes.data || {});
      setMonitorTools(monitorToolsRes.data || []);

      

      const shopMap = {};

      (toolsRes.data || []).forEach(tool => {

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

      

      setLoadingProgress('Complete!');

      

    } catch (error) {

      console.error('Error fetching data:', error);

      setError(`Failed to load dashboard data: ${error.message || 'Unknown error'}`);

    } finally {

      setLoading(false);

      setLoadingProgress('');

    }

  };



  const fetchToolRequests = async () => {

    setToolRequestsLoading(true);

    setToolRequestsError(null);

    try {

      const base = import.meta?.env?.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : 'https://tool-managemnt.onrender.com');
      const res = await axios.get(`${base}/api/tools/requests`);

      setToolRequests(res.data);

    } catch (err) {

      setToolRequestsError('Failed to load tool requests');

    } finally {

      setToolRequestsLoading(false);

    }

  };



  const handleExport = () => {

    const headers = [

      'Tool Name', 'Tool Category', 'Operator Name', 'Operator Email',

      'Instance Number', 'Start Time', 'End Time', 'Duration (hours)', 'Is Active',

    ];



    const rows = [];

    for (const toolId in analytics.detailedUsage) {

      const toolData = analytics.detailedUsage[toolId];

      for (const operatorId in toolData.operators) {

        const operatorData = toolData.operators[operatorId];

        for (const instance of operatorData.instances) {

          rows.push([

            toolData.toolName, toolData.toolCategory, operatorData.operatorName,

            operatorData.operatorEmail, instance.instanceNumber,

            new Date(instance.startTime).toLocaleString(),

            instance.endTime ? new Date(instance.endTime).toLocaleString() : 'N/A',

            instance.duration ? instance.duration.toFixed(2) : 'N/A',

            instance.isActive ? 'Yes' : 'No',

          ]);

        }

      }

    }



    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');

    if (link.href) URL.revokeObjectURL(link.href);

    const url = URL.createObjectURL(blob);

    link.href = url;

    link.setAttribute('download', 'tool_usage_report.csv');

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

  };



  const handlePlaceOrder = async (toolId, quantity, notes) => {

    try {

      const base = import.meta?.env?.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : 'https://tool-managemnt.onrender.com');
      await axios.post(`${base}/api/orders`, {
        toolId, quantity, notes

      });

      fetchData();

    } catch (error) {

      console.error('Error placing order:', error);

      setError('Failed to place order. Please try again.');

    }

  };



  const tabs = [

    { id: 'overview', label: 'Overview', icon: TrendingUp, color: 'blue' },

    { id: 'my-tools', label: 'My Tools', icon: Package, color: 'green' },

    { id: 'shops', label: 'All Shops', icon: Store, color: 'purple' },

    { id: 'orders', label: 'My Orders', icon: ShoppingCart, color: 'orange' },

    { id: 'monitor', label: 'Tool Monitor', icon: Eye, color: 'red' },

    { id: 'analytics', label: 'Usage Analytics', icon: BarChart3, color: 'indigo' },

    { id: 'requests', label: 'Tool Requests', icon: Plus, color: 'pink' }

  ];



  if (loading) {

    return (

      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">

        <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-200 max-w-md w-full mx-4">

          <div className="flex flex-col items-center space-y-6">

            <div className="relative">

              <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-blue-600"></div>

              <Activity className="absolute inset-6 w-8 h-8 text-blue-600" />

            </div>

            <div className="text-center">

              <h3 className="text-2xl font-bold text-gray-900 mb-2">Loading System</h3>

              <p className="text-gray-600 mb-2">Industrial Tool Management Platform</p>

              {loadingProgress && (

                <div className="mt-4">

                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">

                    <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{width: '60%'}}></div>

                  </div>

                  <p className="text-blue-600 text-sm font-medium">{loadingProgress}</p>

                </div>

              )}

              <button

                onClick={() => { setLoading(false); setError('Loading cancelled by user'); }}

                className="mt-6 text-xs text-gray-500 hover:text-gray-700 underline transition-colors"

              >

                Cancel Loading

              </button>

            </div>

          </div>

        </div>

      </div>

    );

  }



  if (error) {

    return (

      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">

        <div className="bg-white rounded-2xl p-12 shadow-lg border border-red-200 max-w-md w-full mx-4">

          <div className="flex flex-col items-center space-y-6">

            <div className="bg-red-100 p-4 rounded-full">

              <XCircle className="h-12 w-12 text-red-600" />

            </div>

            <div className="text-center">

              <h3 className="text-xl font-bold text-gray-900 mb-2">System Error</h3>

              <p className="text-red-600 mb-6 text-sm">{error}</p>

              <button

                onClick={fetchData}

                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-semibold shadow-md"

              >

                <RefreshCw className="w-4 h-4" />

                Retry Connection

              </button>

            </div>

          </div>

        </div>

      </div>

    );

  }



  return (

    <div className="min-h-screen bg-gray-50">

      {/* Industrial Header */}

      <div className="bg-white border-b border-gray-200 shadow-sm">

        <div className="px-8 py-6">

          <div className="flex items-center justify-between">

            <div className="flex items-center space-x-4">

              <div className="bg-blue-600 p-3 rounded-xl shadow-md">

                <Settings className="w-7 h-7 text-white" />

              </div>

              <div>

                <h1 className="text-2xl font-bold text-gray-900">Industrial Tool Management</h1>

                <p className="text-gray-600 font-medium">Supervisor Control Panel • Production Environment</p>

              </div>

            </div>


            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500 w-3 h-3 rounded-full shadow-lg"></div>
                <span className="text-green-700 font-semibold text-sm tracking-wide">SYSTEM OPERATIONAL</span>
              </div>
              <div className="relative">
                <button
                  className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => setNotifOpen((open) => !open)}
                  aria-label="Show notifications"
                >
                  <Bell className="w-6 h-6" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-96 max-w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Notifications</span>
                      <button className="text-xs text-blue-600 hover:underline" onClick={() => setNotifOpen(false)}>Close</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-gray-500 text-sm">No notifications</div>
                      ) : (
                        notifications.slice().reverse().map((notif, idx) => (
                          <div key={idx} className="p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                            <div>
                              {notif.type === 'warning' ? (
                                <AlertTriangle className="w-5 h-5 text-orange-500 mt-1" />
                              ) : (
                                <Bell className="w-5 h-5 text-blue-500 mt-1" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 text-sm">{notif.title}</div>
                              <div className="text-gray-700 text-sm mt-1">{notif.message}</div>
                              <div className="text-gray-400 text-xs mt-1">{notif.timestamp ? new Date(notif.timestamp).toLocaleString() : ''}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>



      <div className="px-4 sm:px-8 py-8 space-y-8">

        {/* Key Metrics Grid */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">

            <div className="flex items-center justify-between mb-4">

              <div className="bg-blue-50 p-3 rounded-xl">

                <ShoppingCart className="w-7 h-7 text-blue-600" />

              </div>

              <div className="text-right">

                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders || 0}</p>

                <p className="text-gray-600 font-medium text-sm">All-time order count</p>

              </div>

            </div>

            <div>

              <h3 className="text-gray-900 font-semibold text-lg">Total Orders</h3>

              <p className="text-gray-500 text-sm">All-time order count</p>

            </div>

          </div>



          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">

            <div className="flex items-center justify-between mb-4">

              <div className="bg-green-50 p-3 rounded-xl">

                <Package className="w-7 h-7 text-green-600" />

              </div>

              <div className="text-right">

                <p className="text-3xl font-bold text-gray-900">{monitorTools.length || 0}</p>

                <p className="text-gray-600 font-medium text-sm">Total Tools</p>

              </div>

            </div>

            <div>

              <h3 className="text-gray-900 font-semibold text-lg">Total Tools</h3>

              <p className="text-gray-500 text-sm">Currently active tools</p>

            </div>

          </div>



          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">

            <div className="flex items-center justify-between mb-4">

              <div className="bg-orange-50 p-3 rounded-xl">

                <AlertTriangle className="w-7 h-7 text-orange-600" />

              </div>

              <div className="text-right">

                <p className="text-3xl font-bold text-gray-900">{monitorTools.filter(tool => tool.remainingLife <= tool.thresholdLimit).length}</p>

                <p className="text-gray-600 font-medium text-sm">Tools requiring attention</p>

              </div>

            </div>

            <div>

              <h3 className="text-gray-900 font-semibold text-lg">Maintenance Due</h3>

              <p className="text-gray-500 text-sm">Tools requiring immediate attention</p>

            </div>

          </div>



          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">

            <div className="flex items-center justify-between mb-4">

              <div className="bg-purple-50 p-3 rounded-xl">

                <Play className="w-7 h-7 text-purple-600" />

              </div>

              <div className="text-right">

                <p className="text-3xl font-bold text-gray-900">

                  {monitorTools.filter(tool => tool.status === 'in-use').length}

                </p>

                <p className="text-gray-600 font-medium text-sm">Tools currently in operation</p>

              </div>

            </div>

            <div>

              <h3 className="text-gray-900 font-semibold text-lg">Tools in Use</h3>

              <p className="text-gray-500 text-sm">Real-time sessions</p>

            </div>

          </div>

        </div>



        {/* Navigation Tabs */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-2">

          <nav className="flex space-x-1 overflow-x-auto no-scrollbar">

            {tabs.map((tab) => {

              const IconComponent = tab.icon;

              return (

                <button

                  key={tab.id}

                  onClick={() => setActiveTab(tab.id)}

                  className={`min-w-[10rem] sm:min-w-[12rem] shrink-0 flex items-center gap-3 px-4 sm:px-6 py-4 rounded-xl font-semibold text-sm transition-all duration-300 ${

                    activeTab === tab.id

                      ? `bg-${tab.color}-50 text-${tab.color}-700 border border-${tab.color}-200 shadow-sm`

                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'

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

        <div className="space-y-8">

          {activeTab === 'overview' && (

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Recent Orders */}

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

                <div className="p-8 border-b border-gray-100">

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>

                      <p className="text-gray-600 mt-1">Latest order activity and status updates</p>

                    </div>

                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">

                      <Filter className="w-5 h-5" />

                    </button>

                  </div>

                </div>

                <div className="p-8 space-y-4">

                  {orders && orders.length > 0 ? (

                    orders.slice(0, 5).map((order, index) => (

                      <div key={order._id} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">

                        <div className="flex items-center space-x-4">

                          <div className="bg-blue-100 p-2 rounded-lg">

                            <Package className="w-5 h-5 text-blue-600" />

                          </div>

                          <div>

                            <p className="font-semibold text-gray-900 text-lg">{order.tool?.name || 'Unknown Tool'}</p>

                            <p className="text-gray-600">Quantity: {order.quantity} units</p>

                          </div>

                        </div>

                        <div className="text-right">

                          <span className={`px-4 py-2 text-xs font-bold rounded-full border-2 ${

                            order.status === 'pending' ? 'bg-orange-50 text-orange-700 border-orange-200' :

                            order.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :

                            order.status === 'fulfilled' ? 'bg-blue-50 text-blue-700 border-blue-200' :

                            'bg-red-50 text-red-700 border-red-200'

                          }`}>

                            {order.status.toUpperCase()}

                          </span>

                        </div>

                      </div>

                    ))

                  ) : (

                    <div className="text-center py-16">

                      <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">

                        <ShoppingCart className="w-8 h-8 text-gray-400" />

                      </div>

                      <p className="text-gray-500 text-lg font-medium">No orders found</p>

                      <p className="text-gray-400 text-sm mt-1">New orders will appear here</p>

                    </div>

                  )}

                </div>

              </div>



              {/* My Tools Summary */}

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

                <div className="p-8 border-b border-gray-100">

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">

                        <Package className="w-6 h-6 text-green-600" />

                        My Tools Inventory

                      </h3>

                      <p className="text-gray-600 mt-1">Tool availability and usage status</p>

                    </div>

                  </div>

                </div>

                <div className="p-8 space-y-4">

                  {myTools && myTools.length > 0 ? (

                    myTools.slice(0, 5).map((tool) => (

                      <div key={tool._id} className="p-6 bg-green-50 rounded-xl border border-green-200">

                        <div className="flex items-center justify-between">

                          <div className="flex-1">

                            <p className="font-bold text-gray-900 text-lg mb-3">{tool.name}</p>

                            <div className="grid grid-cols-3 gap-4">

                              <div className="text-center">

                                <p className="text-2xl font-bold text-blue-600">{tool.companyQuantity || 0}</p>

                                <p className="text-xs text-gray-600 font-medium">ORDERED</p>

                              </div>

                              <div className="text-center">

                                <p className="text-2xl font-bold text-green-600">{tool.availableQuantity || 0}</p>

                                <p className="text-xs text-gray-600 font-medium">AVAILABLE</p>

                              </div>

                              <div className="text-center">

                                <p className="text-2xl font-bold text-orange-600">{tool.inUseQuantity || 0}</p>

                                <p className="text-xs text-gray-600 font-medium">IN USE</p>

                              </div>

                            </div>

                            {tool.reusable && tool.availableQuantity > 0 && (

                              <div className="mt-3">

                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold border border-blue-200">

                                  REUSABLE TOOL

                                </span>

                              </div>

                            )}

                          </div>

                          <div className="flex flex-col items-center space-y-2 ml-6">

                            {(tool.availableQuantity || 0) > 0 && 

                              <div className="bg-green-100 p-2 rounded-full">

                                <CheckCircle className="w-6 h-6 text-green-600" />

                              </div>

                            }

                            {(tool.inUseQuantity || 0) > 0 && 

                              <div className="bg-orange-100 p-2 rounded-full">

                                <Play className="w-6 h-6 text-orange-600" />

                              </div>

                            }

                          </div>

                        </div>

                      </div>

                    ))

                  ) : (

                    <div className="text-center py-16">

                      <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">

                        <Package className="w-8 h-8 text-gray-400" />

                      </div>

                      <p className="text-gray-500 text-lg font-medium">No tools found</p>

                      <p className="text-gray-400 text-sm mt-1">Your tools will appear here</p>

                    </div>

                  )}

                </div>

              </div>

            </div>

          )}



          {activeTab === 'my-tools' && (

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

              <div className="p-8 border-b border-gray-100">

                <h2 className="text-2xl font-bold text-gray-900">My Company's Tools</h2>

                <p className="text-gray-600 mt-2">Manage and monitor your complete tool inventory</p>

              </div>

              <div className="p-8">

                <MyToolsList tools={myTools} />

              </div>

            </div>

          )}



          {activeTab === 'shops' && (

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

              <div className="p-8 border-b border-gray-100">

                <h2 className="text-2xl font-bold text-gray-900">All Shops & Tools</h2>

                <p className="text-gray-600 mt-2">Browse available tools from all registered shops</p>

              </div>

              <div className="p-8">

                <ShopsList shops={shops} onPlaceOrder={handlePlaceOrder} />

              </div>

            </div>

          )}



          {activeTab === 'orders' && (

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

              <div className="p-8 border-b border-gray-100">

                <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>

                <p className="text-gray-600 mt-2">Track and manage your order history and status</p>

              </div>

              <div className="p-8">

                <OrdersList orders={orders} userRole="supervisor" />

              </div>

            </div>

          )}



          {activeTab === 'monitor' && (

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

              <div className="p-8 border-b border-gray-100">

                <h2 className="text-2xl font-bold text-gray-900">Tool Monitor</h2>

                <p className="text-gray-600 mt-2">Real-time monitoring of tool usage and performance</p>

              </div>

              <div className="p-8">

                {(() => {

                  return <ToolMonitor tools={monitorTools} detailedUsage={analytics.detailedUsage} />;

                })()}

              </div>

            </div>

          )}



          {activeTab === 'analytics' && (

            <div className="space-y-8">

              {/* Tool Usage Summary */}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

                  <div className="p-8 border-b border-gray-100">

                    <h3 className="text-xl font-bold text-gray-900">Tool Usage Summary</h3>

                    <p className="text-gray-600 mt-1">Performance metrics and usage statistics</p>

                  </div>

                  <div className="p-8 space-y-4">

                    {analytics.toolSummary && analytics.toolSummary.length > 0 ? (

                      analytics.toolSummary.slice(0, 5).map((tool) => (

                        <div key={tool._id} className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">

                          <div className="flex items-center justify-between">

                            <div>

                              <p className="font-bold text-gray-900 text-lg">{tool.toolName}</p>

                              <p className="text-gray-600 capitalize font-medium">{tool.toolCategory}</p>

                            </div>

                            <div className="text-right">

                              <p className="text-2xl font-bold text-blue-600">{tool.totalUsage?.toFixed(1)}h</p>

                              <p className="text-xs text-gray-500 font-medium">

                                {tool.operatorCount} operators • {tool.instanceCount} instances

                              </p>

                            </div>

                          </div>

                        </div>

                      ))

                    ) : (

                      <div className="text-center py-16">

                        <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">

                          <BarChart3 className="w-8 h-8 text-gray-400" />

                        </div>

                        <p className="text-gray-500 text-lg font-medium">No usage data available</p>

                        <p className="text-gray-400 text-sm mt-1">Data will appear here once tools are used</p>

                      </div>

                    )}

                  </div>

                </div>



                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

                  <UsageChart title="Company Usage Overview" />

                </div>

              </div>



              {/* Detailed Usage Analytics */}

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

                <div className="p-8 border-b border-gray-100 flex items-center justify-between">

                  <div>

                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">

                      <Users className="w-6 h-6 text-indigo-600" />

                      Detailed Usage Analytics

                    </h3>

                    <p className="text-gray-600 mt-1">Comprehensive tool and operator performance breakdown</p>

                  </div>

                  <button

                    onClick={handleExport}

                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors font-semibold shadow-md"

                  >

                    <Download className="w-5 h-5" />

                    Export Report

                  </button>

                </div>

                

                <div className="p-8">

                  {analytics.detailedUsage && Object.keys(analytics.detailedUsage).length > 0 ? (

                    <div className="space-y-8 max-h-[600px] overflow-y-auto pr-1">

                      {Object.entries(analytics.detailedUsage).map(([toolId, toolData]) => (

                        <div key={toolId} className="bg-gray-50 rounded-2xl p-8 border border-gray-200">

                        <h4 className="font-bold text-gray-900 text-xl mb-6 flex items-center gap-3">

                          <div className="bg-green-100 p-2 rounded-xl">

                            <Package className="w-6 h-6 text-green-600" />

                          </div>

                          {toolData.toolName}

                          <span className="text-base text-gray-600 capitalize bg-gray-200 px-3 py-1 rounded-full">

                            {toolData.toolCategory}

                          </span>

                        </h4>

                        

                        <div className="space-y-6">

                          {Object.entries(toolData.operators).map(([operatorId, operatorData]) => (

                            <div key={operatorId} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">

                              <div className="flex items-center justify-between mb-4">

                                <div>

                                  <p className="font-bold text-gray-900 text-lg">{operatorData.operatorName}</p>

                                  <p className="text-gray-600">{operatorData.operatorEmail}</p>

                                </div>

                                <div className="text-right">

                                  <p className="text-2xl font-bold text-indigo-600">{operatorData.totalDuration.toFixed(1)}h</p>

                                  <p className="text-sm text-gray-500 font-medium">{operatorData.totalSessions} sessions total</p>

                                </div>

                              </div>

                              

                              {/* Instance Details */}

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                {operatorData.instances.map((instance, index) => (

                                  <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">

                                    <div className="flex items-center justify-between mb-3">

                                      <span className="text-sm font-bold text-indigo-600 flex items-center gap-2">

                                        <Hash className="w-4 h-4" />

                                        Instance {instance.instanceNumber}

                                      </span>

                                      <span className={`text-xs px-3 py-1 font-bold rounded-full border-2 ${
                                        instance.status === 'broken' ? 'bg-red-50 text-red-700 border-red-200' :
                                        instance.isActive 
                                          ? 'bg-orange-50 text-orange-700 border-orange-200' 
                                          : 'bg-green-50 text-green-700 border-green-200'
                                      }`}>{
                                        instance.status === 'broken' ? 'BROKEN' :
                                        instance.isActive ? 'ACTIVE' : 'COMPLETED'
                                      }</span>

                                    </div>

                                    <div className="space-y-2">

                                      <p className="text-sm text-gray-700 flex items-center gap-2 font-medium">

                                        <Clock className="w-4 h-4" />

                                        {instance.duration ? `${instance.duration.toFixed(1)} hours` : 'In progress'}

                                      </p>

                                      <p className="text-xs text-gray-500">

                                        Started {new Date(instance.startTime).toLocaleDateString()}

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

                    </div>

                  ) : (

                    <div className="text-center py-20">

                      <div className="bg-gray-100 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">

                        <BarChart3 className="w-10 h-10 text-gray-400" />

                      </div>

                      <p className="text-gray-500 text-xl font-medium">No usage data available</p>

                      <p className="text-gray-400 mt-2">Detailed analytics will appear here once operators start using tools</p>

                    </div>

                  )}

                </div>

              </div>

            </div>

          )}



          {activeTab === 'requests' && (

            <div className="bg-white rounded-2xl border border-pink-200 shadow-sm">

              <div className="p-8 border-b border-pink-100 flex items-center justify-between">

                <h2 className="text-2xl font-bold text-pink-700 flex items-center gap-3">

                  <Plus className="w-6 h-6 text-pink-600" />

                  Tool Requests

                </h2>

                <button

                  onClick={fetchToolRequests}

                  className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2 rounded-lg font-semibold border border-pink-300"

                >

                  Refresh

                </button>

              </div>

              <div className="p-8">

                {toolRequestsLoading ? (

                  <div className="text-center text-pink-600">Loading requests...</div>

                ) : toolRequestsError ? (

                  <div className="text-center text-red-500">{toolRequestsError}</div>

                ) : toolRequests.length === 0 ? (

                  <div className="text-center text-gray-500 py-12">

                    <Plus className="w-10 h-10 mx-auto mb-3 text-pink-300" />

                    <p className="font-medium">No tool requests found</p>

                    <p className="text-sm mt-1">Operator requests will appear here</p>

                  </div>

                ) : (

                  <div className="space-y-6">

                    {toolRequests.map((req) => (

                      <div key={req._id} className="p-6 bg-pink-50 rounded-xl border border-pink-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        <div>

                          <div className="font-bold text-pink-800 text-lg">{req.toolName}</div>

                          <div className="text-sm text-pink-600">Category: {req.category}</div>

                          <div className="text-xs text-gray-500 mt-1">Requested by: {req.operator?.name} ({req.operator?.email})</div>

                          <div className="text-xs text-gray-500 mt-1">Reason: {req.reason}</div>

                        </div>

                        <div className="text-right">

                          <span className={`px-4 py-2 rounded-full text-xs font-bold border-2 ${
                            req.status === 'pending' ? 'bg-pink-100 text-pink-700 border-pink-300' :
                            req.status === 'approved' ? 'bg-green-100 text-green-700 border-green-300' :
                            'bg-red-100 text-red-700 border-red-300'
                          }`}>

                            {req.status.toUpperCase()}

                          </span>

                        </div>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            </div>

          )}

        </div>

      </div>

    </div>

  );

};



export default SupervisorDashboard;

