import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { 
  X, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Clock,
  Bell,
  ChevronRight,
  Minimize2,
  Maximize2
} from 'lucide-react';

const NotificationPanel = () => {
  const { notifications, removeNotification, markAsRead } = useNotifications();
  const [isMinimized, setIsMinimized] = useState(false);
  const [hoveredNotification, setHoveredNotification] = useState(null);

  useEffect(() => {
    // Auto-remove notifications after a certain time based on type
    notifications.forEach((notification) => {
      if (!notification.persistent) {
        const timeout = notification.type === 'error' ? 8000 : 
                       notification.type === 'warning' ? 6000 : 4000;
        
        setTimeout(() => {
          removeNotification(notification.id);
        }, timeout);
      }
    });
  }, [notifications, removeNotification]);

  const getNotificationIcon = (type) => {
    const iconClass = "w-5 h-5";
    
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-600`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClass} text-yellow-600`} />;
      case 'error':
        return <AlertCircle className={`${iconClass} text-red-600`} />;
      case 'critical':
        return <Zap className={`${iconClass} text-red-700`} />;
      case 'system':
        return <Bell className={`${iconClass} text-blue-600`} />;
      default:
        return <Info className={`${iconClass} text-blue-600`} />;
    }
  };

  const getNotificationConfig = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'from-green-50 to-emerald-50',
          border: 'border-green-200',
          shadow: 'shadow-green-200/50',
          accent: 'bg-green-500',
          textPrimary: 'text-green-900',
          textSecondary: 'text-green-700',
          textMuted: 'text-green-600',
          closeHover: 'hover:text-green-800 hover:bg-green-100'
        };
      case 'warning':
        return {
          bg: 'from-yellow-50 to-amber-50',
          border: 'border-yellow-200',
          shadow: 'shadow-yellow-200/50',
          accent: 'bg-yellow-500',
          textPrimary: 'text-yellow-900',
          textSecondary: 'text-yellow-800',
          textMuted: 'text-yellow-700',
          closeHover: 'hover:text-yellow-900 hover:bg-yellow-100'
        };
      case 'error':
      case 'critical':
        return {
          bg: 'from-red-50 to-pink-50',
          border: 'border-red-200',
          shadow: 'shadow-red-200/50',
          accent: 'bg-red-500',
          textPrimary: 'text-red-900',
          textSecondary: 'text-red-800',
          textMuted: 'text-red-700',
          closeHover: 'hover:text-red-900 hover:bg-red-100'
        };
      case 'system':
        return {
          bg: 'from-purple-50 to-indigo-50',
          border: 'border-purple-200',
          shadow: 'shadow-purple-200/50',
          accent: 'bg-purple-500',
          textPrimary: 'text-purple-900',
          textSecondary: 'text-purple-800',
          textMuted: 'text-purple-700',
          closeHover: 'hover:text-purple-900 hover:bg-purple-100'
        };
      default:
        return {
          bg: 'from-blue-50 to-indigo-50',
          border: 'border-blue-200',
          shadow: 'shadow-blue-200/50',
          accent: 'bg-blue-500',
          textPrimary: 'text-blue-900',
          textSecondary: 'text-blue-800',
          textMuted: 'text-blue-700',
          closeHover: 'hover:text-blue-900 hover:bg-blue-100'
        };
    }
  };

  const getPriorityOrder = (type) => {
    const order = { critical: 0, error: 1, warning: 2, system: 3, info: 4, success: 5 };
    return order[type] || 6;
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return timestamp.toLocaleDateString();
  };

  const sortedNotifications = [...notifications].sort((a, b) => 
    getPriorityOrder(a.type) - getPriorityOrder(b.type)
  );

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-50 max-w-sm">
      {/* Panel Header (when multiple notifications) */}
      {notifications.length > 1 && (
        <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-t-2xl px-4 py-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-2 rounded-lg">
                <Bell className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">System Notifications</h3>
                <p className="text-xs text-slate-600">{notifications.length} active alerts</p>
              </div>
            </div>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Notifications Container */}
      <div className={`space-y-3 ${notifications.length > 1 ? (isMinimized ? 'hidden' : 'pt-0') : ''}`}>
        {sortedNotifications.map((notification, index) => {
          const config = getNotificationConfig(notification.type);
          const isCritical = notification.type === 'critical';
          
          return (
            <div
              key={notification.id}
              className={`relative overflow-hidden rounded-2xl border ${config.border} bg-gradient-to-br ${config.bg} shadow-xl ${config.shadow} backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                isCritical ? 'animate-pulse' : ''
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
              onMouseEnter={() => setHoveredNotification(notification.id)}
              onMouseLeave={() => setHoveredNotification(null)}
            >
              {/* Accent Bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.accent}`}></div>
              
              {/* Critical Alert Indicator */}
              {isCritical && (
                <div className="absolute top-2 right-2">
                  <div className="bg-red-500 rounded-full p-1">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}

              <div className="p-5 pl-6">
                <div className="flex items-start gap-4">
                  {/* Icon Container */}
                  <div className="flex-shrink-0 mt-0.5">
                    <div className={`p-2 rounded-xl bg-white/50 border border-white/20 shadow-sm`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`font-bold text-sm leading-tight ${config.textPrimary}`}>
                          {notification.title}
                        </h4>
                        
                        {notification.subtitle && (
                          <p className={`text-xs font-medium mt-1 ${config.textSecondary}`}>
                            {notification.subtitle}
                          </p>
                        )}
                        
                        <p className={`text-sm mt-2 leading-relaxed ${config.textSecondary}`}>
                          {notification.message}
                        </p>

                        {/* Action Button */}
                        {notification.action && (
                          <button
                            onClick={notification.action.onClick}
                            className={`inline-flex items-center gap-2 mt-3 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/80 ${config.textPrimary} hover:bg-white transition-colors shadow-sm border border-white/20`}
                          >
                            {notification.action.label}
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Close Button */}
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className={`p-1.5 text-slate-400 ${config.closeHover} rounded-lg transition-colors ml-2 flex-shrink-0`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20">
                      <div className="flex items-center gap-2">
                        <Clock className={`w-3 h-3 ${config.textMuted}`} />
                        <span className={`text-xs ${config.textMuted}`}>
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      
                      {notification.category && (
                        <span className={`text-xs px-2 py-1 rounded-full bg-white/40 ${config.textMuted} font-medium`}>
                          {notification.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar for Auto-dismiss */}
                {!notification.persistent && hoveredNotification !== notification.id && (
                  <div className="absolute bottom-0 left-0 right-0">
                    <div className="h-1 bg-white/20 overflow-hidden">
                      <div 
                        className={`h-full ${config.accent} transition-all duration-100`}
                        style={{
                          animation: `shrink ${notification.type === 'error' ? '8s' : notification.type === 'warning' ? '6s' : '4s'} linear forwards`
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Clear All Button (when multiple notifications) */}
      {notifications.length > 2 && !isMinimized && (
        <div className="mt-3">
          <button
            onClick={() => notifications.forEach(n => removeNotification(n.id))}
            className="w-full bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white hover:text-slate-900 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Clear All Notifications
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default NotificationPanel;
