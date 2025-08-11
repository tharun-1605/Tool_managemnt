import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import NotificationPanel from './NotificationPanel';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Menu, 
  X, 
  ChevronRight, 
  Home,
  Activity,
  AlertTriangle 
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set current path for breadcrumbs
    setCurrentPath(window.location.pathname);
    
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getRoleTheme = () => {
    switch (user?.role) {
      case 'shopkeeper':
        return {
          bgGradient: 'from-blue-50 to-indigo-50',
          accentColor: 'blue-600',
          sidebarBg: 'from-blue-900 to-blue-800'
        };
      case 'supervisor':
        return {
          bgGradient: 'from-green-50 to-emerald-50',
          accentColor: 'green-600',
          sidebarBg: 'from-green-900 to-green-800'
        };
      case 'operator':
        return {
          bgGradient: 'from-orange-50 to-red-50',
          accentColor: 'orange-600',
          sidebarBg: 'from-orange-900 to-red-800'
        };
      default:
        return {
          bgGradient: 'from-slate-50 to-slate-100',
          accentColor: 'slate-600',
          sidebarBg: 'from-slate-900 to-slate-800'
        };
    }
  };

  const theme = getRoleTheme();

  const getBreadcrumbs = () => {
    const path = currentPath.split('/').filter(Boolean);
    const breadcrumbs = [
      { label: 'Dashboard', path: '/', icon: Home }
    ];

    if (path.length > 0) {
      path.forEach((segment, index) => {
        const formattedSegment = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
        breadcrumbs.push({
          label: formattedSegment,
          path: '/' + path.slice(0, index + 1).join('/'),
          icon: Activity
        });
      });
    }

    return breadcrumbs;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-slate-600 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="w-16 h-16 border-4 border-slate-500 border-t-4 border-t-orange-500 rounded-full animate-spin absolute top-4 left-4" style={{animationDirection: 'reverse'}}></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Industrial Management System</h2>
          <p className="text-slate-300">Initializing workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bgGradient} relative`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.3) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <Sidebar 
          onClose={() => setSidebarOpen(false)} 
          isMinimized={isSidebarMinimized}
          setIsMinimized={setIsSidebarMinimized}
        />
      </div>

      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${isSidebarMinimized ? 'lg:ml-20' : 'lg:ml-72'}`}>
        {/* Mobile Header with Menu Toggle */}
        <div className="lg:hidden bg-white shadow-sm border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-slate-900">
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Dashboard
            </h1>
            <div className="w-10"></div> {/* Spacer for balance */}
          </div>
        </div>

        {/* Header */}
        <div className="hidden lg:block">
          <Header />
        </div>

        {/* Breadcrumb Navigation */}
        <div className="bg-white/70 backdrop-blur-sm border-b border-slate-200/50 px-6 py-3 hidden lg:block">
          <nav className="flex items-center space-x-2 text-sm">
            {getBreadcrumbs().map((crumb, index) => {
              const IconComponent = crumb.icon;
              return (
                <React.Fragment key={crumb.path}>
                  {index > 0 && (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                    index === getBreadcrumbs().length - 1 
                      ? `bg-${theme.accentColor.split('-')[0]}-100 text-${theme.accentColor} font-medium` 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}>
                    <IconComponent className="w-4 h-4" />
                    <span>{crumb.label}</span>
                  </div>
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <main className="relative z-10">
          {/* Content Container */}
          <div className="px-6 py-8 lg:px-8">
            {/* Content Background */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl p-8 min-h-[calc(100vh-12rem)]">
              {children}
            </div>
          </div>

          {/* Footer */}
          <footer className="px-6 py-4 lg:px-8">
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">System Status: Operational</span>
                  </div>
                  <div className="hidden lg:block w-px h-4 bg-slate-300"></div>
                  <span className="text-sm">Industrial Management System v2.1</span>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-slate-500">
                  <span>© 2025 Industrial Operations</span>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    <span>Performance: Optimal</span>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Notification Panel */}
      <NotificationPanel />

      {/* System Status Indicator */}
      <div className="fixed bottom-6 right-6 z-30">
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
            </div>
            <div className="text-sm">
              <div className="font-semibold text-slate-900">System Online</div>
              <div className="text-slate-500">All services operational</div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Monitoring (Development Mode) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-6 right-6 z-30 lg:top-auto lg:bottom-24">
          <div className="bg-slate-900/90 backdrop-blur-sm text-white rounded-xl p-3 text-xs font-mono">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-3 h-3 text-yellow-400" />
              <span>DEV MODE</span>
            </div>
            <div>Role: {user?.role}</div>
            <div>User: {user?.name}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
