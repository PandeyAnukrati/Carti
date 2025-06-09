import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ChatbotProvider } from "./context/ChatbotContext"; 

import HomePage from "./pages/HomePage";
import AllProducts from "./pages/AllProducts";
import Navbar from "./components/Navbar";
import DealsPage from "./pages/DealsPage";
import Chatbot from "./components/Chatbot";
import SignIn from "./pages/SignIn";
import SignUpPage from "./pages/SignUpPage";
import ProtectedRoute from "./components/ProtectedRoute";
import LogoutButton from "./pages/LogOut";
import About from "./pages/About";

const AppRouter = () => {
  return (
    <AuthProvider>
      <ChatbotProvider> 
        <Router>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/logout" element={<LogoutButton />} />
            <Route path="/about" element={<About />} />

            {/* Protected Routes */}
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <AllProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/deals"
              element={
                <ProtectedRoute>
                  <DealsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Chatbot /> 
        </Router>
      </ChatbotProvider>
    </AuthProvider>
  );
};

export default AppRouter;
