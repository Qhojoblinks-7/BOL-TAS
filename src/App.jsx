import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import AdminMain from './modules/admin/components/AdminMain';
import StatisticsPage from './modules/admin/components/StatisticsPage';
import MembersPage from './modules/admin/components/MembersPage';
import AttendancePage from './modules/admin/components/AttendancePage';
import UshersPage from './modules/admin/components/UshersPage';
import ShepherdingPage from './modules/admin/components/ShepherdingPage';
import AdminHelpTab from './modules/admin/components/AdminHelpTab';
import TeenPortal from './modules/teen/components/TeenPortal';
import EditProfile from './modules/teen/components/EditProfile';
import UsherTerminal from './modules/usher/components/UsherTerminal';
import AdminUsherTerminal from './modules/admin/components/AdminUsherTerminal';
import CreateAccount from './components/auth/CreateAccount';
import Login from './components/auth/Login';
import { cleanupExpiredAssignments } from './utils/helpers';

function App() {
  const [userRole, setUserRole] = useState(() => {
    const userAccount = localStorage.getItem('userAccount');
    return userAccount ? JSON.parse(userAccount).role : null;
  });

  // Listen for localStorage changes and custom events
  useEffect(() => {
    // Cleanup expired assignments on app load
    cleanupExpiredAssignments();

    const handleStorageChange = () => {
      const userAccount = localStorage.getItem('userAccount');
      setUserRole(userAccount ? JSON.parse(userAccount).role : null);
    };

    const handleAccountCreated = (event) => {
      setUserRole(event.detail.role);
    };

    const handleUserLoggedIn = (event) => {
      setUserRole(event.detail.role);
    };

    const handleUserLoggedOut = () => {
      localStorage.removeItem('userAccount');
      setUserRole(null);
    };

    const handleTempUsherActivated = () => {
      setUserRole('tempUsher');
    };

    const handleTempUsherExpired = () => {
      setUserRole('teen');
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userAccountCreated', handleAccountCreated);
    window.addEventListener('userLoggedIn', handleUserLoggedIn);
    window.addEventListener('userLoggedOut', handleUserLoggedOut);
    window.addEventListener('tempUsherActivated', handleTempUsherActivated);
    window.addEventListener('tempUsherExpired', handleTempUsherExpired);

    // Also check for changes within the same tab
    const interval = setInterval(() => {
      const userAccount = localStorage.getItem('userAccount');
      const currentRole = userAccount ? JSON.parse(userAccount).role : null;
      if (currentRole !== userRole) {
        setUserRole(currentRole);
      }
    }, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userAccountCreated', handleAccountCreated);
      window.removeEventListener('userLoggedIn', handleUserLoggedIn);
      window.removeEventListener('userLoggedOut', handleUserLoggedOut);
      window.removeEventListener('tempUsherActivated', handleTempUsherActivated);
      window.removeEventListener('tempUsherExpired', handleTempUsherExpired);
      clearInterval(interval);
    };
  }, [userRole]);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Authentication Routes - Always Available */}
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />

        {/* Protected Routes - Role-Based */}
        {userRole === 'admin' && (
          <>
            <Route path="/" element={<AdminLayout><AdminMain /></AdminLayout>} />
            <Route path="/overview" element={<AdminLayout><AdminMain /></AdminLayout>} />
            <Route path="/statistics" element={<AdminLayout><StatisticsPage /></AdminLayout>} />
            <Route path="/members" element={<AdminLayout><MembersPage /></AdminLayout>} />
            <Route path="/attendance" element={<AdminLayout><AttendancePage /></AdminLayout>} />
            <Route path="/ushers" element={<AdminLayout><UshersPage /></AdminLayout>} />
            <Route path="/shepherding" element={<AdminLayout><ShepherdingPage /></AdminLayout>} />
            <Route path="/help" element={<AdminLayout><AdminHelpTab /></AdminLayout>} />
            <Route path="/usher" element={<AdminLayout><AdminUsherTerminal /></AdminLayout>} />
          </>
        )}

        {userRole === 'teen' && (
          <>
            <Route path="/" element={<TeenPortal />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </>
        )}

        {userRole === 'tempUsher' && (
          <Route path="/" element={<UsherTerminal />} />
        )}

        {(userRole === 'usher' || userRole === 'admin') && (
          <Route path="/usher" element={<UsherTerminal />} />
        )}

        {/* Default Routes - When no role or guest */}
        {(!userRole || userRole === 'guest') && (
          <>
            <Route path="/" element={<CreateAccount />} />
            <Route path="/admin" element={<AdminLayout><AdminMain /></AdminLayout>} />
            <Route path="/teen" element={<TeenPortal />} />
            <Route path="/teen/edit-profile" element={<EditProfile />} />
            <Route path="/usher" element={<UsherTerminal />} />
          </>
        )}

        {/* Fallback Route */}
        <Route path="*" element={
          userRole ? (
            userRole === 'admin' ? <AdminLayout><AdminMain /></AdminLayout> :
            userRole === 'teen' ? <TeenPortal /> :
            userRole === 'tempUsher' ? <UsherTerminal /> :
            <CreateAccount />
          ) : (
            <CreateAccount />
          )
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
