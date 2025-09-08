import { Routes, Route, Navigate } from "react-router-dom";
// import { Dashboard, Auth } from "@/layouts";
import "./cutome.css";
import "./custom_responsive.css";

import { SignIn, SignUp } from "./pages/auth";    
// import Profile from "./pages/dashboard/Profile";
import { Auth } from "./layouts";
// import Users from "./pages/dashboard/Users";

function App() {
  return (
    <Routes>
     


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
