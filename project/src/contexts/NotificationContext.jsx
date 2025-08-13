import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  const SOCKET_URL = useMemo(() => {
    const envUrl = import.meta?.env?.VITE_SOCKET_URL;
    if (envUrl) return envUrl;
    // Fallbacks for dev and prod
    if (typeof window !== 'undefined') {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      return isLocal ? 'http://localhost:5000' : 'https://tool-managemnt.onrender.com';
    }
    return 'https://tool-managemnt.onrender.com';
  }, []);

  useEffect(() => {
    if (!user) return;
    const newSocket = io(SOCKET_URL, { transports: ['websocket'] });
    setSocket(newSocket);

    newSocket.emit('join-role', user.role);

    // Listen for notifications based on user role
    if (user.role === 'supervisor') {
      newSocket.on('tool-threshold-alert', (data) => {
        addNotification({
          type: 'warning',
          title: 'Tool Life Low',
          message: `${data.tool} has ${Number(data.remainingLife).toFixed(1)} hours remaining (threshold: ${data.thresholdLimit})`,
          timestamp: new Date()
        });
      });

      newSocket.on('order-status-update', (data) => {
        addNotification({
          type: 'info',
          title: 'Order Update',
          message: `Your order for ${data.tool} has been ${data.status}`,
          timestamp: new Date()
        });
      });
    }

    if (user.role === 'shopkeeper') {
      newSocket.on('new-order', (data) => {
        addNotification({
          type: 'info',
          title: 'New Order',
          message: `${data.supervisor} ordered ${data.quantity}x ${data.tool}`,
          timestamp: new Date()
        });
      });
    }

    return () => {
      newSocket.close();
    };
  }, [user, SOCKET_URL]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [
      ...prev,
      { ...notification, id, read: false, persistent: true }
    ]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAllNotifications,
      markAsRead,
      socket
    }}>
      {children}
    </NotificationContext.Provider>
  );
};