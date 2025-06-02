// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Retirer useNavigate


import Home from "./pages/Home";


import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";

import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";

// Composant pour protéger les routes
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("access_token") !== null;
  return isAuthenticated ? children : <Navigate to="/sign-in" replace />;
};

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Redirection de la racine vers sign-in */}
        <Route path="/" element={<Navigate to="/sign-in" replace />} />
        
        {/* Routes publiques */}
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        
        {/* Routes protégées - nécessitent une authentification */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          }
        >
         
          <Route path="Home" element={<Home />} />
         
         
          <Route path="profile" element={<Profile />} />
        </Route>
        
        {/* Redirection pour les routes inconnues */}
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </div>
  );
}

export default App;