import React from 'react';
import { RouterProvider } from 'react-router/dom';
import ErrorBoundary from './components/ErrorBoundary';
import router from './router';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

function AppContent(){
  const { token, logout } = useAuth();

  return (
    <BrowserRouter>
    <nav>
      <Link to="/home">Home and Categories</Link>
      <Link to="/register">Invite or register</Link>
      {token ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <Link to="/login">Login</Link>
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
              <Home />
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
  )
}