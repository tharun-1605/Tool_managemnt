import React, { useState } from 'react';
import { 
  Store, 
  Wrench, 
  ShoppingCart, 
  AlertTriangle,
  CheckCircle,
  Package,
  Building,
  User,
  Star,
  Clock,
  TrendingUp,
  Filter,
  Search,
  MapPin,
  Phone,
  Mail,
  Eye,
  Plus,
  Minus,
  X,
  Award,
  Target,
  Activity
} from 'lucide-react';

const ShopsList = ({ shops, onPlaceOrder }) => {
  const [selectedTool, setSelectedTool] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderNotes, setOrderNotes] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [expandedShops, setExpandedShops] = useState({});

  const handlePlaceOrder = () => {
    if (selectedTool && orderQuantity > 0) {
      onPlaceOrder(selectedTool._id, orderQuantity, orderNotes);
      setShowOrderModal(false);
      setSelectedTool(null);
      setOrderQuantity(1);
      setOrderNotes('');
    }
  };

  const getToolStatusConfig = (tool) => {
    if (tool.remainingLife <= tool.thresholdLimit) {
      return {
        border: 'border-red-200',
        bg: 'from-red-50 to-pink-50',
        status: 'critical',
        statusColor: 'text-red-600',
        statusBg: 'bg-red-100 text-red-800 border-red-200'
      };
    }
    return {
      border: 'border-green-200',
      bg: 'from-green-50 to-emerald-50',
      status: 'good',
      statusColor: 'text-green-600',
      statusBg: 'bg-green-100 text-green-800 border-green-200'
    };
  };

  const getShopRating = (shop) => {
    // Mock rating calculation based on tools and orders
    const avgRating = 4.2 + (Math.random() * 0.8);
    return Math.round(avgRating * 10) / 10;
  };

  const toggleShopExpansion = (shopName) => {
    setExpandedShops(prev => ({
      ...prev,
      [shopName]: !prev[shopName]
    }));
  };

  const filteredShops = shops.filter(shop => {
    const matchesSearch = searchQuery === '' || 
      shop.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.shopkeeper?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const hasMatchingTools = selectedCategory === 'all' || 
      shop.tools.some(tool => tool.category === selectedCategory);
    
    return matchesSearch && hasMatchingTools;
  });

  const getAllCategories = () => {
    const categories = new Set();
    shops.forEach(shop => {
      shop.tools.forEach(tool => {
        categories.add(tool.category);
      });
    });
    return Array.from(categories);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Industrial Equipment Suppliers</h2>
            <p className="text-slate-600 mt-1">Browse and order tools from certified shops</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search shops, tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-64"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-auto"
            >
              <option value="all">All Categories</option>
              {getAllCategories().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Store className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Total Shops</p>
                <p className="text-2xl font-bold text-blue-800">{shops.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Wrench className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-700 font-medium">Available Tools</p>
                <p className="text-2xl font-bold text-green-800">
                  {shops.reduce((sum, shop) => sum + shop.tools.length, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-purple-700 font-medium">Categories</p>
                <p className="text-2xl font-bold text-purple-800">{getAllCategories().length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-orange-700 font-medium">Avg Rating</p>
                <p className="text-2xl font-bold text-orange-800">4.6</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shops List */}
      <div className="space-y-6">
        {filteredShops.map((shop) => {
          const isExpanded = expandedShops[shop.shopName];
          const shopRating = getShopRating(shop);
          const totalStock = shop.tools.reduce((sum, tool) => sum + (tool.stock || 0), 0);
          const totalOrders = shop.tools.reduce((sum, tool) => sum + (tool.orderedByCompanies?.length || 0), 0);

          return (
            <div key={shop.shopName} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
              {/* Shop Header */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Store className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{shop.shopName}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4 text-slate-600" />
                          <span className="text-sm text-slate-600">Managed by <span className="font-medium">{shop.shopkeeper?.name}</span></span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-slate-900">{shopRating}</span>
                          <span className="text-xs text-slate-500">(4.8k reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-slate-600 font-medium">Available Tools</p>
                      <p className="text-3xl font-bold text-slate-900">{shop.tools.length}</p>
                    </div>
                    
                    <button
                      onClick={() => toggleShopExpansion(shop.shopName)}
                      className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      <Eye className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Shop Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 font-medium">Available</p>
                        <p className="text-xl font-bold text-green-600">{shop.tools.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Wrench className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 font-medium">Categories</p>
                        <p className="text-xl font-bold text-blue-600">
                          {new Set(shop.tools.map(tool => tool.category)).size}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Package className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 font-medium">Total Stock</p>
                        <p className="text-xl font-bold text-purple-600">{totalStock}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <Activity className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 font-medium">Orders</p>
                        <p className="text-xl font-bold text-orange-600">{totalOrders}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tools Grid - Always show first 6, expand for more */}
              <div className="p-6">
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${!isExpanded && shop.tools.length > 6 ? 'max-h-96 overflow-hidden' : ''}`}>
                  {(isExpanded ? shop.tools : shop.tools.slice(0, 6)).map((tool) => {
                    const statusConfig = getToolStatusConfig(tool);
                    
                    return (
                      <div 
                        key={tool._id} 
                        className={`bg-gradient-to-br ${statusConfig.bg} border ${statusConfig.border} rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:scale-105 group`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-900 text-lg group-hover:text-green-600 transition-colors">{tool.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm bg-white/60 px-2 py-1 rounded-full text-slate-600 font-medium capitalize">
                                {tool.category}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full border font-bold ${statusConfig.statusBg}`}>
                                {statusConfig.status === 'critical' ? 'LOW LIFE' : 'GOOD'}
                              </span>
                            </div>
                          </div>
                          <div className="bg-white/60 backdrop-blur-sm p-2 rounded-lg">
                            <Target className={`w-5 h-5 ${statusConfig.statusColor}`} />
                          </div>
                        </div>

                        <p className="text-sm text-slate-700 mb-4 line-clamp-2 leading-relaxed">{tool.description}</p>

                        {/* Tool Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-white/40 backdrop-blur-sm p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-blue-600" />
                              <div>
                                <p className="text-xs text-slate-600">Life Limit</p>
                                <p className="font-bold text-blue-800">{tool.lifeLimit}h</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white/40 backdrop-blur-sm p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-purple-600" />
                              <div>
                                <p className="text-xs text-slate-600">Stock</p>
                                <p className="font-bold text-purple-800">{tool.stock || 0}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Threshold Info */}
                        <div className="bg-white/30 backdrop-blur-sm p-3 rounded-lg mb-4">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600 font-medium">Alert Threshold</span>
                            <span className="font-bold text-slate-800">{tool.thresholdLimit}h</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedTool(tool);
                            setShowOrderModal(true);
                          }}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl group-hover:scale-105"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          Request Tool
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Show More Button */}
                {shop.tools.length > 6 && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => toggleShopExpansion(shop.shopName)}
                      className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
                    >
                      {isExpanded ? `Show Less` : `Show ${shop.tools.length - 6} More Tools`}
                    </button>
                  </div>
                )}

                {shop.tools.length === 0 && (
                  <div className="text-center py-12">
                    <div className="bg-slate-50 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                      <Wrench className="w-12 h-12 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">No Tools Available</h3>
                    <p className="text-slate-500">This shop currently has no tools in inventory</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Order Modal */}
      {showOrderModal && selectedTool && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-slate-200 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <ShoppingCart className="w-6 h-6 text-green-600" />
                  </div>
                  Place Order Request
                </h2>
                <button
                  onClick={() => {
                    setShowOrderModal(false);
                    setSelectedTool(null);
                    setOrderQuantity(1);
                    setOrderNotes('');
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Tool Info */}
              <div className="bg-slate-50 p-4 rounded-xl mb-6">
                <h3 className="font-bold text-slate-900 text-lg">{selectedTool.name}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="bg-slate-200 px-2 py-1 rounded-full text-slate-700 font-medium capitalize">
                    {selectedTool.category}
                  </span>
                  <div className="flex items-center gap-1 text-blue-600">
                    <Store className="w-4 h-4" />
                    <span className="font-medium">{selectedTool.shopkeeper?.shopName}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mt-2">{selectedTool.description}</p>
              </div>

              <div className="space-y-6">
                {/* Quantity Selector */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Quantity Required
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                      className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    
                    <input
                      type="number"
                      min="1"
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 1)}
                      className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-xl font-bold"
                    />
                    
                    <button
                      onClick={() => setOrderQuantity(orderQuantity + 1)}
                      className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Special Instructions <span className="text-slate-500 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Add any special requirements, preferred delivery time, or additional notes..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 font-bold text-lg shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Submit Request
                </button>
                <button
                  onClick={() => {
                    setShowOrderModal(false);
                    setSelectedTool(null);
                    setOrderQuantity(1);
                    setOrderNotes('');
                  }}
                  className="px-6 py-4 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Empty State */}
      {filteredShops.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12">
            <div className="bg-slate-100 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <Store className="w-16 h-16 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">No Shops Found</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              {searchQuery || selectedCategory !== 'all' 
                ? 'No shops match your current search or filter criteria. Try adjusting your filters to find more options.'
                : 'No equipment suppliers are currently available. New shops will appear here once they register and add their tool inventory.'
              }
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopsList;
