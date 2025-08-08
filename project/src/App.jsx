import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Dashboard Components
import ShopkeeperDashboard from './components/dashboards/ShopkeeperDashboard';
import SupervisorDashboard from './components/dashboards/SupervisorDashboard';
import OperatorDashboard from './components/dashboards/OperatorDashboard';

// Layout
import Layout from './components/layout/Layout';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const AppContent = () => {
  const { user } = useAuth();

  const getDashboardComponent = (tab = 'overview') => {
    switch (user?.role) {
      case 'shopkeeper':
        return <ShopkeeperDashboard defaultTab={tab} />;
      case 'supervisor': {
        // Map generic tabs to supervisor-specific ids
        const map = {
          overview: 'overview',
          tools: 'shops',
          orders: 'orders',
          monitor: 'monitor',
          analytics: 'analytics'
        };
        return <SupervisorDashboard defaultTab={map[tab] || 'overview'} />;
      }
      case 'operator':
        return <OperatorDashboard defaultTab={tab} />;
      default:
        return <Navigate to="/login" replace />;
    }
  };

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            {getDashboardComponent('overview')}
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/tools" element={
        <ProtectedRoute>
          <Layout>
            {getDashboardComponent('tools')}
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/orders" element={
        <ProtectedRoute>
          <Layout>
            {getDashboardComponent('orders')}
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/analytics" element={
        <ProtectedRoute>
          <Layout>
            {getDashboardComponent('analytics')}
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/monitor" element={
        <ProtectedRoute>
          <Layout>
            {getDashboardComponent('monitor')}
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/active" element={
        <ProtectedRoute>
          <Layout>
            {getDashboardComponent('active')}
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/unauthorized" element={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-red-500">You don't have permission to access this page.</p>
          </div>
        </div>
      } />
      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;