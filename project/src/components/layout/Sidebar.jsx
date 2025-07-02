import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { 
  Home, 
  Wrench, 
  ShoppingCart, 
  BarChart3, 
  Users, 
  Settings,
  LogOut,
  Store,
  Eye,
  Play,
  Building,
  AlertTriangle
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [activeInstances, setActiveInstances] = useState([]);
  const [loading, setLoading] = useState(false);

  // Check for active tool instances if user is operator
  useEffect(() => {
    if (user?.role === 'operator') {
      checkActiveInstances();
    }
  }, [user]);

  const checkActiveInstances = async () => {
    try {
      const response = await axios.get('https://tool-managemnt.onrender.com/api/tools/operator-tools');
      setActiveInstances(response.data.activeInstances || []);
    } catch (error) {
      console.error('Error checking active instances:', error);
    }
  };

  const handleLogout = async () => {
    // Check if operator has active tools
    if (user?.role === 'operator' && activeInstances.length > 0) {
      alert(`You cannot logout while using tools. Please stop using the following tools first:\n\n${activeInstances.map(tool => `• ${tool.name} (Instance #${tool.instanceNumber})`).join('\n')}`);
      return;
    }

    if (window.confirm('Are you sure you want to logout?')) {
      setLoading(true);
      logout();
    }
  };

  const getMenuItems = () => {
    const baseItems = [
      { icon: Home, label: 'Dashboard', href: '#' }
    ];

    if (user?.role === 'shopkeeper') {
      return [
        ...baseItems,
        { icon: Wrench, label: 'Manage Tools', href: '#' },
        { icon: ShoppingCart, label: 'Orders', href: '#' },
        { icon: BarChart3, label: 'Analytics', href: '#' }
      ];
    }

    if (user?.role === 'supervisor') {
      return [
        ...baseItems,
        { icon: Store, label: 'All Shops', href: '#' },
        { icon: ShoppingCart, label: 'My Orders', href: '#' },
        { icon: Eye, label: 'Tool Monitor', href: '#' },
        { icon: BarChart3, label: 'Reports', href: '#' }
      ];
    }

    if (user?.role === 'operator') {
      return [
        ...baseItems,
        { icon: Wrench, label: 'Available Tools', href: '#' },
        { icon: Play, label: 'Active Usage', href: '#' },
        { icon: BarChart3, label: 'My Usage', href: '#' }
      ];
    }

    return baseItems;
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'shopkeeper':
        return 'from-blue-600 to-blue-700';
      case 'supervisor':
        return 'from-green-600 to-green-700';
      case 'operator':
        return 'from-orange-600 to-orange-700';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200">
      {/* Logo & User Info */}
      <div className={`bg-gradient-to-r ${getRoleColor()} text-white p-6`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg">ToolManager</h1>
            <p className="text-xs opacity-80">Pro System</p>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-4">
          <p className="font-medium">{user?.name}</p>
          <p className="text-sm opacity-80 capitalize">{user?.role}</p>
          {user?.shopName && (
            <div className="flex items-center gap-1 text-xs opacity-70 mt-1">
              <Store className="w-3 h-3" />
              <span>Shop: {user.shopName}</span>
            </div>
          )}
          {user?.companyName && (
            <div className="flex items-center gap-1 text-xs opacity-70 mt-1">
              <Building className="w-3 h-3" />
              <span>Company: {user.companyName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <li key={index}>
                <a
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <IconComponent className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
                  <span className="font-medium">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Active Tools Warning for Operators */}
      {user?.role === 'operator' && activeInstances.length > 0 && (
        <div className="mx-4 mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 text-orange-700 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">Active Tools</span>
          </div>
          <div className="space-y-1">
            {activeInstances.slice(0, 2).map((tool) => (
              <p key={tool._id} className="text-xs text-orange-600">
                • {tool.name} #{tool.instanceNumber}
              </p>
            ))}
            {activeInstances.length > 2 && (
              <p className="text-xs text-orange-600">
                • +{activeInstances.length - 2} more tools
              </p>
            )}
          </div>
          <p className="text-xs text-orange-500 mt-2">
            Stop all tools before logout
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          disabled={loading}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${
            user?.role === 'operator' && activeInstances.length > 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
          }`}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
          ) : (
            <LogOut className="w-5 h-5" />
          )}
          <span className="font-medium">
            {user?.role === 'operator' && activeInstances.length > 0 ? 'Stop Tools First' : 'Logout'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;