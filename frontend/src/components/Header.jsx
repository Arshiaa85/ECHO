import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Logo from '../img/Logo.png';

const Header = ({ isAuthenticated, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const activeClass = 'active';
  const inactiveClass = 'nav-link';

  const handleToggle = () => {
    if (isOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 300);
    } else {
      setIsOpen(true);
    }
  };

  const closeMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300);
  };

  return (
    <header className="bg-primary shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4 text-neutral">
        <div className="text-2xl font-bold">
          <Link to="/" className="flex items-center gap-2 text-accent hover:opacity-90 transition-opacity">
            <img src={Logo} alt="Echo Logo" className="h-8 w-auto" />
            Echo
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center space-x-6">
            <NavLink to="/" end className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>Home</NavLink>
            <NavLink to="/aegis" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>Aegis</NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>About</NavLink>
          </nav>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <NavLink to="/account" className="nav-link">Account</NavLink>
                <button onClick={onLogout} className="bg-accent text-primary font-bold py-2 px-4 rounded-lg border-2 border-transparent hover:bg-transparent hover:text-accent hover:border-accent transition-all duration-300">
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" className="bg-accent text-primary font-bold py-2 px-4 rounded-lg border-2 border-transparent hover:bg-transparent hover:text-accent hover:border-accent transition-all duration-300">
                Login
              </NavLink>
            )}
          </div>
        </div>
        <div className="md:hidden">
          <button onClick={handleToggle} className="text-neutral focus:outline-none transform transition-transform duration-300 hover:scale-110 active:scale-95">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className={`md:hidden bg-primary absolute top-full right-0 w-full h-screen ${isClosing ? 'slide-out-right' : 'slide-in-right'}`}>
          <nav className="flex flex-col items-center space-y-4 py-4">
            <NavLink to="/" end className={({ isActive }) => (isActive ? activeClass : inactiveClass)} onClick={closeMenu}>Home</NavLink>
            <NavLink to="/aegis" className={({ isActive }) => (isActive ? activeClass : inactiveClass)} onClick={closeMenu}>Aegis</NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? activeClass : inactiveClass)} onClick={closeMenu}>About</NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/account" className="nav-link" onClick={closeMenu}>Account</NavLink>
                <button onClick={() => { onLogout(); closeMenu(); }} className="bg-accent text-primary font-bold py-2 px-4 rounded-lg border-2 border-transparent hover:bg-transparent hover:text-accent hover:border-accent transition-all duration-300">
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" className="bg-accent text-primary font-bold py-2 px-4 rounded-lg border-2 border-transparent hover:bg-transparent hover:text-accent hover:border-accent transition-all duration-300" onClick={closeMenu}>
                Login
              </NavLink>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;