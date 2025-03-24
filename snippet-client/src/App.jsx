import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SnippetList from './pages/SnippetList';
import Login from './pages/Login';
import Register from './pages/Register';


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};


function App() {
  

  return (
    
    
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route path="/snippet" element={
          <ProtectedRoute>
            <SnippetList />
          </ProtectedRoute>
        } />
        
        {/* Redirect root to snippet page */}
        <Route path="/" element={<Navigate to="/snippet" replace />} />
        
        {/* Redirect any unknown routes to snippet page */}
        <Route path="*" element={<Navigate to="/snippet" replace />} />
      </Routes>
    </Router>
   
  )
}

export default App
