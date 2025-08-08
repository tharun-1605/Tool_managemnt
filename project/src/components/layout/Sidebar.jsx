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
  AlertTriangle,
  Activity,
  Shield,
  Zap,
  Clock,
  Bell,
  ChevronDown,
  ChevronRight,
  Minimize2,
  User,
  Target,
  TrendingUp,
  Package
} from 'lucide-react';

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const [activeInstances, setActiveInstances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMinimized, setIsMinimized] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Check for active tool instances if user is operator
  useEffect(() => {
    if (user?.role === 'operator') {
      checkActiveInstances();
      // Check every 30 seconds for active instances
      const interval = setInterval(checkActiveInstances, 30000);
      return () => clearInterval(interval);
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

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getMenuSections = () => {
    const sections = [];

    if (user?.role === 'shopkeeper') {
      sections.push(
        {
          id: 'overview',
          title: 'Overview',
          icon: Home,
          items: [
            { icon: BarChart3, label: 'Dashboard', href: '#', active: true },
            { icon: TrendingUp, label: 'Analytics', href: '#' }
          ]
        },
        {
          id: 'inventory',
          title: 'Inventory Management',
          icon: Package,
          items: [
            { icon: Wrench, label: 'Manage Tools', href: '#' },
            { icon: ShoppingCart, label: 'Orders', href: '#' },
            { icon: Activity, label: 'Tool Status', href: '#' }
          ]
        }
      );
    }

    if (user?.role === 'supervisor') {
      sections.push(
        {
          id: 'overview',
          title: 'Command Center',
          icon: Shield,
          items: [
            { icon: Home, label: 'Dashboard', href: '#', active: true },
            { icon: BarChart3, label: 'Reports', href: '#' }
          ]
        },
        {
          id: 'operations',
          title: 'Operations',
          icon: Building,
          items: [
            { icon: Store, label: 'All Shops', href: '#' },
            { icon: ShoppingCart, label: 'My Orders', href: '#' },
            { icon: Eye, label: 'Tool Monitor', href: '#' },
            { icon: Users, label: 'Team Management', href: '#' }
          ]
        }
      );
    }

    if (user?.role === 'operator') {
      sections.push(
        {
          id: 'operations',
          title: 'Operations',
          icon: Activity,
          items: [
            { icon: Home, label: 'Dashboard', href: '#', active: true },
            { icon: Wrench, label: 'Available Tools', href: '#' },
            { icon: Play, label: 'Active Usage', href: '#', badge: activeInstances.length }
          ]
        },
        {
          id: 'analytics',
          title: 'Performance',
          icon: Target,
          items: [
            { icon: BarChart3, label: 'My Usage', href: '#' },
            { icon: TrendingUp, label: 'Performance', href: '#' }
          ]
        }
      );
    }

    return sections;
  };

  const getRoleConfig = () => {
    switch (user?.role) {
      case 'shopkeeper':
        return {
          gradient: 'from-blue-900 via-blue-800 to-indigo-900',
          accent: 'from-blue-500 to-blue-600',
          icon: Store,
          title: 'Shop Control',
          subtitle: 'Inventory Management'
        };
      case 'supervisor':
        return {
          gradient: 'from-green-900 via-green-800 to-emerald-900',
          accent: 'from-green-500 to-green-600',
          icon: Shield,
          title: 'Command Center',
          subtitle: 'Operations Control'
        };
      case 'operator':
        return {
          gradient: 'from-orange-900 via-red-800 to-red-900',
          accent: 'from-orange-500 to-red-600',
          icon: Zap,
          title: 'Operations',
          subtitle: 'Equipment Interface'
        };
      default:
        return {
          gradient: 'from-slate-900 via-slate-800 to-slate-900',
          accent: 'from-slate-500 to-slate-600',
          icon: User,
          title: 'Dashboard',
          subtitle: 'Control Panel'
        };
    }
  };

  const roleConfig = getRoleConfig();
  const RoleIcon = roleConfig.icon;
  const menuSections = getMenuSections();

  return (
    <div className={`fixed left-0 top-0 h-full bg-gradient-to-b ${roleConfig.gradient} text-white shadow-2xl transition-all duration-300 ${
      isMinimized ? 'w-20' : 'w-72'
    }`}>
      {/* Header Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        <div className="relative z-10 p-6">
          {!isMinimized ? (
            <>
              {/* Logo & Title */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${roleConfig.accent} rounded-xl flex items-center justify-center shadow-lg`}>
                    <RoleIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-xl text-white">Industrial</h1>
                    <p className="text-xs text-white/80">Management System</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>

              {/* User Info */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${roleConfig.accent} rounded-xl flex items-center justify-center shadow-md`}>
                    <span className="text-white font-bold text-lg">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white">{user?.name}</p>
                    <p className="text-sm text-white/80 capitalize flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      {user?.role}
                    </p>
                  </div>
                </div>

                {/* Organization Info */}
                <div className="space-y-2 text-xs">
                  {user?.shopName && (
                    <div className="flex items-center gap-2 text-white/70">
                      <Store className="w-3 h-3" />
                      <span>Shop: {user.shopName}</span>
                    </div>
                  )}
                  {user?.companyName && (
                    <div className="flex items-center gap-2 text-white/70">
                      <Building className="w-3 h-3" />
                      <span>Company: {user.companyName}</span>
                    </div>
                  )}
                </div>

                {/* Current Time */}
                <div className="flex items-center gap-2 text-white/60 text-xs mt-3 pt-3 border-t border-white/20">
                  <Clock className="w-3 h-3" />
                  <span>{currentTime.toLocaleTimeString('en-US', { hour12: false })}</span>
                  <span className="mx-1">•</span>
                  <span>{currentTime.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <button
                onClick={() => setIsMinimized(false)}
                className={`w-12 h-12 bg-gradient-to-r ${roleConfig.accent} rounded-xl flex items-center justify-center shadow-lg mb-4 hover:shadow-xl transition-all`}
              >
                <RoleIcon className="w-6 h-6 text-white" />
              </button>
              {/* Minimized user avatar */}
              <div className={`w-10 h-10 bg-gradient-to-r ${roleConfig.accent} rounded-lg flex items-center justify-center shadow-md`}>
                <span className="text-white font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 px-4 py-2 overflow-y-auto custom-scrollbar">
        {!isMinimized ? (
          <nav className="space-y-4">
            {menuSections.map((section) => {
              const SectionIcon = section.icon;
              const isExpanded = expandedSections[section.id] !== false; // Default to expanded
              
              return (
                <div key={section.id} className="space-y-2">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <SectionIcon className="w-5 h-5" />
                      <span className="font-semibold text-sm">{section.title}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* Section Items */}
                  {isExpanded && (
                    <div className="space-y-1 ml-4">
                      {section.items.map((item, itemIndex) => {
                        const ItemIcon = item.icon;
                        return (
                          <a
                            key={itemIndex}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                              item.active 
                                ? `bg-gradient-to-r ${roleConfig.accent} text-white shadow-lg` 
                                : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <ItemIcon className={`w-4 h-4 ${item.active ? 'text-white' : 'text-white/60 group-hover:text-white'}`} />
                              <span className="font-medium text-sm">{item.label}</span>
                            </div>
                            {item.badge && item.badge > 0 && (
                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold min-w-[1.25rem] text-center">
                                {item.badge}
                              </span>
                            )}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        ) : (
          <nav className="space-y-3">
            {menuSections.map((section) => (
              <div key={section.id} className="space-y-2">
                {section.items.map((item, itemIndex) => {
                  const ItemIcon = item.icon;
                  return (
                    <a
                      key={itemIndex}
                      href={item.href}
                      onClick={onClose}
                      className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group ${
                        item.active 
                          ? `bg-gradient-to-r ${roleConfig.accent} text-white shadow-lg` 
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                      title={item.label}
                    >
                      <ItemIcon className="w-5 h-5" />
                      {item.badge && item.badge > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold min-w-[1rem] text-center">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  );
                })}
              </div>
            ))}
          </nav>
        )}
      </div>

      {/* Active Tools Warning for Operators */}
      {!isMinimized && user?.role === 'operator' && activeInstances.length > 0 && (
        <div className="mx-4 mb-4">
          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-400/30 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-orange-200 font-bold text-sm">Active Operations</p>
                <p className="text-orange-300/80 text-xs">{activeInstances.length} tools running</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-3">
              {activeInstances.slice(0, 2).map((tool) => (
                <div key={tool._id} className="flex items-center gap-2 text-xs text-orange-200">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <span className="font-medium">{tool.name}</span>
                  <span className="text-orange-300/70">#{tool.instanceNumber}</span>
                </div>
              ))}
              {activeInstances.length > 2 && (
                <div className="flex items-center gap-2 text-xs text-orange-300/70">
                  <div className="w-2 h-2 bg-orange-400/50 rounded-full"></div>
                  <span>+{activeInstances.length - 2} more active</span>
                </div>
              )}
            </div>
            
            <p className="text-xs text-orange-300/80 bg-orange-500/10 px-3 py-2 rounded-lg">
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              Stop all operations before logout
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={`p-4 border-t border-white/20 ${isMinimized ? 'px-2' : ''}`}>
        {!isMinimized ? (
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200">
              <Settings className="w-5 h-5" />
              <span className="font-medium text-sm">Settings</span>
            </button>
            
            <button
              onClick={handleLogout}
              disabled={loading || (user?.role === 'operator' && activeInstances.length > 0)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
                user?.role === 'operator' && activeInstances.length > 0
                  ? 'text-white/40 cursor-not-allowed bg-white/5'
                  : 'text-white/70 hover:text-white hover:bg-red-500/20 hover:border-red-400/30'
              }`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <LogOut className="w-5 h-5" />
              )}
              <span>
                {user?.role === 'operator' && activeInstances.length > 0 ? 'Stop Tools First' : 'Sign Out'}
              </span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <button 
              className="w-12 h-12 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              disabled={loading || (user?.role === 'operator' && activeInstances.length > 0)}
              className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                user?.role === 'operator' && activeInstances.length > 0
                  ? 'text-white/40 cursor-not-allowed'
                  : 'text-white/70 hover:text-white hover:bg-red-500/20'
              }`}
              title={user?.role === 'operator' && activeInstances.length > 0 ? 'Stop Tools First' : 'Sign Out'}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <LogOut className="w-5 h-5" />
              )}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
