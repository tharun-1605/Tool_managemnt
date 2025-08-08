import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Bell, 
  Search, 
  Menu, 
  Settings, 
  User, 
  ChevronDown, 
  LogOut, 
  Shield,
  Building,
  Store,
  Activity,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { notifications, removeNotification, clearAllNotifications } = useNotifications();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const unreadCount = notifications.length;

  const getRoleConfig = () => {
    switch (user?.role) {
      case 'shopkeeper':
        return {
          color: 'text-blue-600',
          bgColor: 'from-blue-600 to-indigo-600',
          badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: Store,
          title: 'Shopkeeper Control Center'
        };
      case 'supervisor':
        return {
          color: 'text-green-600',
          bgColor: 'from-green-600 to-emerald-600',
          badgeColor: 'bg-green-100 text-green-800 border-green-200',
          icon: Shield,
          title: 'Supervisor Command Center'
        };
      case 'operator':
        return {
          color: 'text-orange-600',
          bgColor: 'from-orange-600 to-red-600',
          badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: Activity,
          title: 'Operator Interface'
        };
      default:
        return {
          color: 'text-slate-600',
          bgColor: 'from-slate-600 to-slate-700',
          badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
          icon: User,
          title: 'Dashboard'
        };
    }
  };

  const roleConfig = getRoleConfig();
  const RoleIcon = roleConfig.icon;

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality
    console.log('Searching for:', searchQuery);
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <header className="bg-white shadow-lg border-b border-slate-200">
      {/* Top Status Bar */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-2">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              <span>{user?.companyName || 'Industrial Operations'}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span>{getCurrentDate()}</span>
            <span className="font-mono">{getCurrentTime()}</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Title & User Info */}
          <div className="flex items-center gap-4">
            <div className={`bg-gradient-to-r ${roleConfig.bgColor} p-3 rounded-xl shadow-lg`}>
              <RoleIcon className="w-6 h-6 text-white" />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                {roleConfig.title}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-slate-600">
                  Welcome back, <span className={`font-semibold ${roleConfig.color}`}>{user?.name}</span>
                </span>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${roleConfig.badgeColor}`}>
                  {user?.role?.toUpperCase()}
                </div>
                {user?.shopName && (
                  <span className="text-sm text-slate-500">• Shop: <span className="font-medium">{user.shopName}</span></span>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-4">
            {/* Enhanced Search Bar */}
            <form onSubmit={handleSearch} className="relative hidden lg:block">
              <div className="flex items-center">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search equipment, orders, reports..."
                    className="pl-12 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80 bg-slate-50 hover:bg-white transition-colors text-slate-700 font-medium"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button className="p-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-200 group">
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              </button>

              <button className="p-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">
                <Settings className="w-5 h-5" />
              </button>

              {/* Enhanced Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifMenu((v) => !v)}
                  className="relative p-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors group"
                >
                  <Bell className="w-5 h-5 group-hover:animate-bounce" />
                  {unreadCount > 0 && (
                    <>
                      <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-400 rounded-full animate-ping opacity-20"></div>
                    </>
                  )}
                </button>

                {showNotifMenu && (
                  <div className="absolute right-0 top-full mt-2 w-96 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-semibold text-slate-800">Notifications</span>
                      </div>
                      {notifications.length > 0 && (
                        <button
                          onClick={() => clearAllNotifications()}
                          className="text-xs text-slate-500 hover:text-slate-700"
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    <div className="max-h-96 overflow-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-slate-500 text-sm">No notifications</div>
                      ) : (
                        notifications.slice(0, 8).map((n) => (
                          <div key={n.id} className="px-4 py-3 border-b border-slate-100 last:border-b-0">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-slate-900 truncate">{n.title}</div>
                                <div className="text-sm text-slate-600 mt-1 break-words">{n.message}</div>
                                <div className="text-xs text-slate-500 mt-1">
                                  {n.timestamp ? new Date(n.timestamp).toLocaleString() : ''}
                                </div>
                              </div>
                              <button
                                onClick={() => removeNotification(n.id)}
                                className="text-xs text-slate-400 hover:text-slate-600"
                              >
                                Dismiss
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 transition-colors group"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${roleConfig.bgColor} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <span className="text-white text-lg font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-semibold text-slate-900">{user?.name}</div>
                  <div className="text-xs text-slate-500 capitalize">{user?.role} Account</div>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${roleConfig.bgColor} rounded-lg flex items-center justify-center`}>
                        <span className="text-white font-bold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{user?.name}</div>
                        <div className="text-sm text-slate-500">{user?.email}</div>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors">
                      <User className="w-5 h-5" />
                      <span>Profile Settings</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors">
                      <Settings className="w-5 h-5" />
                      <span>Preferences</span>
                    </button>
                    <div className="border-t border-slate-100 my-2"></div>
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="lg:hidden px-6 pb-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search equipment, orders..."
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 hover:bg-white transition-colors"
          />
        </form>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;
  