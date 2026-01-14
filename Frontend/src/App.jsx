import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

import StudentLogin from './pages/student/StudentLogin';
import StudentDashboard from './pages/student/StudentDashboard';
import ApplyGatepass from './pages/student/ApplyGatepass';
import MyGatepasses from './pages/student/MyGatepasses';

import RectorLogin from './pages/rector/RectorLogin';
import RectorDashboard from './pages/rector/RectorDashboard';
import AddStudent from './pages/rector/AddStudent';
import ViewStudents from './pages/rector/ViewStudents';
import GatepassRequests from './pages/rector/GatepassRequests';

const App = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <Router>
      <div className="app">
        {user && (
          <>
            <Navbar 
              user={user} 
              onLogout={handleLogout} 
              onToggleSidebar={toggleSidebar}
            />
            <Sidebar 
              user={user} 
              isOpen={sidebarOpen} 
              onClose={closeSidebar}
            />
          </>
        )}
        
        <div className={`main-content ${!user ? 'full-width' : ''}`}>
          <Routes>
            <Route path="/" element={
              user ? (
                user.role === 'student' ? (
                  <Navigate to="/student/dashboard" />
                ) : (
                  <Navigate to="/rector/dashboard" />
                )
              ) : (
                <StudentLogin onLogin={handleLogin} />
              )
            } />
            
            <Route path="/student/login" element={
              user ? <Navigate to="/student/dashboard" /> : <StudentLogin onLogin={handleLogin} />
            } />
            
            <Route path="/rector/login" element={
              user ? <Navigate to="/rector/dashboard" /> : <RectorLogin onLogin={handleLogin} />
            } />

            <Route path="/student/dashboard" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/student/apply-gatepass" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ApplyGatepass />
              </ProtectedRoute>
            } />
            
            <Route path="/student/my-gatepasses" element={
              <ProtectedRoute allowedRoles={['student']}>
                <MyGatepasses />
              </ProtectedRoute>
            } />

            <Route path="/rector/dashboard" element={
              <ProtectedRoute allowedRoles={['rector']}>
                <RectorDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/rector/add-student" element={
              <ProtectedRoute allowedRoles={['rector']}>
                <AddStudent />
              </ProtectedRoute>
            } />
            
            <Route path="/rector/view-students" element={
              <ProtectedRoute allowedRoles={['rector']}>
                <ViewStudents />
              </ProtectedRoute>
            } />
            
            <Route path="/rector/gatepass-requests" element={
              <ProtectedRoute allowedRoles={['rector']}>
                <GatepassRequests />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;