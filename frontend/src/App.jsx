import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import Error500Page from "./pages/Error500Page";
import RecordsPage from "./pages/RecordsPage";
import AegisPage from "./pages/AegisPage";
import LoginPage from "./pages/LoginPage";
import ForgotPage from "./pages/ForgotPage";
import ResetPage from "./pages/ResetPage";
import AccountPage from "./pages/AccountPage";
import AboutPage from "./pages/AboutPage";
import apiClient from "./api/client";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await apiClient.get("/api/auth/status/");
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error("Error checking authentication status:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      // You would typically have a /api/logout/ endpoint to call here
      // await apiClient.post("/api/auth/logout/");
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Router>
      <Layout isAuthenticated={isAuthenticated} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot" element={<ForgotPage />} />
          <Route path="/reset" element={<ResetPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/aegis" element={<AegisPage />} />
          <Route path="/about" element={<AboutPage />} /> 
          <Route path="/500" element={<Error500Page />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
