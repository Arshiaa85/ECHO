import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, isAuthenticated, onLogout }) => {
  const location = useLocation();
  const authPages = ['/login', '/forgot', '/reset'];
  const isAuthPage = authPages.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-neutral">
      {!isAuthPage && <Header isAuthenticated={isAuthenticated} onLogout={onLogout} />}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;