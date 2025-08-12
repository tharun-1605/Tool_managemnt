import React, { useState } from 'react';
import { CSVLink } from 'react-csv';
import { 
  Check, 
  X, 
  Clock, 
  Package, 
  User,
  Calendar,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Timer,
  Building,
  Hash,
  TrendingUp,
  Eye,
  Edit3,
  MoreVertical,
  Filter,
  Search,
  Download,
  RefreshCw
} from 'lucide-react';

const OrdersList = ({ orders, onStatusUpdate, userRole }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          bg: 'from-yellow-50 to-amber-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Timer,
          label: 'Pending Review',
          description: 'Awaiting approval'
        };
      case 'approved':
        return {
          bg: 'from-green-50 to-emerald-50',
          border: 'border-green-200',
          text: 'text-green-800',
          badge: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          label: 'Approved',
          description: 'Ready for fulfillment'
        };
      case 'fulfilled':
        return {
          bg: 'from-blue-50 to-indigo-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: Package,
          label: 'Fulfilled',
          description: 'Order completed'
        };
      case 'rejected':
        return {
          bg: 'from-red-50 to-pink-50',
          border: 'border-red-200',
          text: 'text-red-800',
          badge: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircle,
          label: 'Rejected',
          description: 'Request denied'
        };
      default:
        return {
          bg: 'from-slate-50 to-slate-100',
          border: 'border-slate-200',
          text: 'text-slate-800',
          badge: 'bg-slate-100 text-slate-800 border-slate-200',
          icon: Clock,
          label: 'Unknown',
          description: 'Status unknown'
        };
    }
  };

  const getRoleBadgeColor = () => {
    switch (userRole) {
      case 'shopkeeper':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'supervisor':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPriorityLevel = (order) => {
    const daysOld = Math.floor((new Date() - new Date(order.createdAt)) / (1000 * 60 * 60 * 24));
    if (daysOld > 7) return 'high';
    if (daysOld > 3) return 'medium';
    return 'low';
  };

  const toggleDetails = (orderId) => {
    setShowDetails(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      order.tool?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tool?.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getOrderStats = () => {
    const stats = {
      pending: orders.filter(o => o.status === 'pending').length,
      approved: orders.filter(o => o.status === 'approved').length,
      fulfilled: orders.filter(o => o.status === 'fulfilled').length,
      rejected: orders.filter(o => o.status === 'rejected').length
    };
    return stats;
  };

  const stats = getOrderStats();

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Controls */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Order Management</h2>
            <p className="text-slate-600 mt-1">Track and manage tool requests</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative w-full sm:w-auto">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="rejected">Rejected</option>
            </select>

            <CSVLink
              data={filteredOrders.map(order => ({
                ToolName: order.tool?.name,
                Category: order.tool?.category,
                Quantity: order.quantity,
                Status: order.status,
                OrderDate: new Date(order.createdAt).toLocaleDateString(),
                Shop: order.shopkeeper?.shopName,
                Supervisor: order.supervisor?.name,
              }))}
              headers={[
                { label: "Tool Name", key: "ToolName" },
                { label: "Category", key: "Category" },
                { label: "Quantity", key: "Quantity" },
                { label: "Status", key: "Status" },
                { label: "Order Date", key: "OrderDate" },
                { label: "Shop", key: "Shop" },
                { label: "Supervisor", key: "Supervisor" },
              ]}
              filename={"orders_list.csv"}
              className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              target="_blank"
            >
              <Download className="w-5 h-5" />
            </CSVLink>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-200">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Timer className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-yellow-700 font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-800">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-700 font-medium">Approved</p>
                <p className="text-2xl font-bold text-green-800">{stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Fulfilled</p>
                <p className="text-2xl font-bold text-blue-800">{stats.fulfilled}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border border-red-200">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-red-700 font-medium">Rejected</p>
                <p className="text-2xl font-bold text-red-800">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const statusConfig = getStatusConfig(order.status);
          const StatusIcon = statusConfig.icon;
          const priority = getPriorityLevel(order);
          const isExpanded = showDetails[order._id];

          return (
            <div
              key={order._id}
              className={`bg-gradient-to-br ${statusConfig.bg} rounded-2xl shadow-lg border ${statusConfig.border} overflow-hidden hover:shadow-xl transition-all duration-300`}
            >
              {/* Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-slate-900 text-lg">{order.tool?.name}</h3>
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200">
                        {order.tool?.category}
                      </span>
                      {priority === 'high' && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          HIGH PRIORITY
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Hash className="w-4 h-4" />
                        <span>Order #{order._id.slice(-6)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`px-4 py-2 rounded-xl border font-bold flex items-center gap-2 ${statusConfig.badge}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-sm">{statusConfig.label}</span>
                    </div>

                    <button
                      onClick={() => toggleDetails(order._id)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-lg transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 font-medium">Quantity</p>
                        <p className="text-xl font-bold text-slate-900">{order.quantity}</p>
                      </div>
                    </div>
                  </div>

                  {userRole === 'shopkeeper' && order.supervisor && (
                    <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <User className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 font-medium">Supervisor</p>
                          <p className="text-lg font-bold text-slate-900">{order.supervisor.name}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {userRole === 'supervisor' && order.shopkeeper && (
                    <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <Building className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 font-medium">Shop</p>
                          <p className="text-lg font-bold text-slate-900">{order.shopkeeper.shopName}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className={`${statusConfig.text === 'text-yellow-800' ? 'bg-yellow-100' : 
                                      statusConfig.text === 'text-green-800' ? 'bg-green-100' :
                                      statusConfig.text === 'text-blue-800' ? 'bg-blue-100' : 'bg-red-100'} p-2 rounded-lg`}>
                        <TrendingUp className={`w-5 h-5 ${statusConfig.text === 'text-yellow-800' ? 'text-yellow-600' :
                                               statusConfig.text === 'text-green-800' ? 'text-green-600' :
                                               statusConfig.text === 'text-blue-800' ? 'text-blue-600' : 'text-red-600'}`} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 font-medium">Status</p>
                        <p className={`text-lg font-bold ${statusConfig.text}`}>{statusConfig.description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/20 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-900">Timeline</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            <span className="text-slate-600">Created:</span>
                            <span className="font-medium">{new Date(order.createdAt).toLocaleString()}</span>
                          </div>
                          {order.approvedAt && (
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-slate-600">Approved:</span>
                              <span className="font-medium">{new Date(order.approvedAt).toLocaleString()}</span>
                            </div>
                          )}
                          {order.fulfilledAt && (
                            <div className="flex items-center gap-2 text-sm">
                              <Package className="w-4 h-4 text-blue-600" />
                              <span className="text-slate-600">Fulfilled:</span>
                              <span className="font-medium">{new Date(order.fulfilledAt).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-900">Tool Details</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-slate-600">Category:</span>
                            <span className="font-medium ml-2">{order.tool?.category}</span>
                          </div>
                          <div>
                            <span className="text-slate-600">Description:</span>
                            <span className="font-medium ml-2">{order.tool?.description}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="bg-slate-50/80 p-4 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-slate-600" />
                          <span className="font-semibold text-slate-700">Notes</span>
                        </div>
                        <p className="text-sm text-slate-600">{order.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons for Shopkeeper */}
                {userRole === 'shopkeeper' && order.status === 'pending' && onStatusUpdate && (
                  <div className="flex gap-3 pt-4 border-t border-white/20">
                    <button
                      onClick={() => onStatusUpdate(order._id, 'approved')}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve Order
                    </button>
                    <button
                      onClick={() => {
                        const notes = prompt('Reason for rejection (optional):');
                        onStatusUpdate(order._id, 'rejected', notes || '');
                      }}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject Order
                    </button>
                  </div>
                )}

                {userRole === 'shopkeeper' && order.status === 'approved' && onStatusUpdate && (
                  <div className="pt-4 border-t border-white/20">
                    <button
                      onClick={() => onStatusUpdate(order._id, 'fulfilled')}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl"
                    >
                      <Package className="w-5 h-5" />
                      Mark as Fulfilled
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12">
              <div className="bg-slate-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Package className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Orders Found</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                {searchQuery || filterStatus !== 'all' 
                  ? 'No orders match your current search or filter criteria. Try adjusting your filters.'
                  : userRole === 'supervisor' 
                    ? 'You haven\'t placed any orders yet. Start by requesting tools from available shops.'
                    : 'No orders have been placed yet. Orders will appear here once supervisors start requesting tools.'
                }
              </p>
              {(searchQuery || filterStatus !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterStatus('all');
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersList;
