import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CategoryWordsView, Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Tags } from './pages/Tags';
import { ManageCategoryWords } from './pages/ManageCategoryWords';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

function AppContent(){
  const { token, logout } = useAuth();

  return (
    <BrowserRouter>
    <nav style={{ padding: '10px', background: '#eee', display: 'flex', gap: '15px', alignItems: 'center' }}>
      <Link to="/home">Categories</Link>
      <Link to="/register">Invite to register</Link>
      <Link to="/profile">Update profile</Link>
      <Link to="/tags">Tags CRUD</Link>
      <Link to="/link-word">Link words</Link>
      
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
            <Home />
          </ProtectedRoute>
        }
      >
        <Route path="categories/:categoryId" element={<CategoryWordsView />} />
      </Route>
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route path="/tags" element={<ProtectedRoute><Tags /></ProtectedRoute>} />

      <Route path="/link-word" element={<ProtectedRoute><ManageCategoryWords /></ProtectedRoute>} />

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