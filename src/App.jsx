import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import AdminMain from './modules/admin/components/AdminMain';
import MembersPage from './modules/admin/components/MembersPage';
import AttendancePage from './modules/admin/components/AttendancePage';
import UshersPage from './modules/admin/components/UshersPage';
import ShepherdingPage from './modules/admin/components/ShepherdingPage';
import TeenPortal from './modules/teen/components/TeenPortal';
import EditProfile from './modules/teen/components/EditProfile';
import UsherTerminal from './modules/usher/components/UsherTerminal';
import CreateAccount from './components/auth/CreateAccount';
import Login from './components/auth/Login';

function App() {
  const [userRole, setUserRole] = useState(() => {
    const userAccount = localStorage.getItem('userAccount');
    return userAccount ? JSON.parse(userAccount).role : null;
  });

  // Listen for localStorage changes and custom events
  useEffect(() => {
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

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userAccountCreated', handleAccountCreated);
    window.addEventListener('userLoggedIn', handleUserLoggedIn);
    window.addEventListener('userLoggedOut', handleUserLoggedOut);

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
      clearInterval(interval);
    };
  }, [userRole]);

  return (
    <BrowserRouter future={{ v7_startTransition: true }}>

      {/* Role-Based Routes */}
      <Routes>
        {/* Admin Routes */}
        {userRole === 'admin' && (
          <>
            <Route path="/" element={<AdminLayout><AdminMain /></AdminLayout>} />
            <Route path="/overview" element={<AdminLayout><AdminMain /></AdminLayout>} />
            <Route path="/members" element={<AdminLayout><MembersPage /></AdminLayout>} />
            <Route path="/attendance" element={<AdminLayout><AttendancePage /></AdminLayout>} />
            <Route path="/ushers" element={<AdminLayout><UshersPage /></AdminLayout>} />
            <Route path="/shepherding" element={<AdminLayout><ShepherdingPage /></AdminLayout>} />
          </>
        )}

        {/* Teen Routes */}
        {userRole === 'teen' && (
          <>
            <Route path="/" element={<TeenPortal />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </>
        )}

        {/* Usher Routes */}
        {userRole === 'usher' && (
          <Route path="/" element={<UsherTerminal />} />
        )}

        {/* Default/Auth Routes */}
        {(!userRole || userRole === 'guest') && (
          <>
            <Route path="/" element={<CreateAccount />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout><AdminMain /></AdminLayout>} />
            <Route path="/teen" element={<TeenPortal />} />
            <Route path="/teen/edit-profile" element={<EditProfile />} />
            <Route path="/usher" element={<UsherTerminal />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
