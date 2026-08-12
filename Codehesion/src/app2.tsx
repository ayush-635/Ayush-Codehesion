import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

function AppContent() {
  const { token, logout } = useAuth();

  return (
    <BrowserRouter>
      <nav style={{ padding: '10px', background: '#eee', display: 'flex', gap: '15px' }}>
        <Link to="/home">Home / Categories</Link>
        <Link to="/register">Invite / Register</Link>
        {token ? (
          <button onClick={logout} style={{ marginLeft: 'auto' }}>Logout</button>
        ) : (
          <Link to="/login" style={{ marginLeft: 'auto' }}>Login</Link>
        )}
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/register" 
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <div>
                <h2>Categories Home Screen</h2>
                <p>Functional baseline setup completed successfully.</p>
              </div>
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
