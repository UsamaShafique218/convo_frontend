import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import "./cutome.css";
import "./custom_responsive.css";

import { SignIn, SignUp } from "./pages/auth";   
import ProtectedRoute from "./pages/components/ProtectedRoute";
import Profile from "./pages/dashboard/Profile";

function App() {
  return (
    <Routes>
      {/* Dashboard Layout: Protected */}
      <Route 
        path="/dashboard/*" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
       {/* Profile Page: Protected */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />

      {/* Auth Layout: public */}
      <Route path="/auth/*" element={<Auth />} /> 
      
      {/* Direct SignIn / SignUp pages */}
      <Route path="/auth/sign-in" element={<SignIn />} />
      <Route path="/auth/sign-up" element={<SignUp />} />  

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} /> 
      
    </Routes>
  );
}

export default App;
