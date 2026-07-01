
import "./index.css"; 
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"; 
import { AuthProvider } from "/context/AuthContext"; 
import { Toaster } from "/components/ui/sonner"; 
import Landing from "/pages/Landing"; 
import { LoginPage, RegisterPage } from "./pages/Auth"; 
import AuthCallback from "./pages/AuthCallback"; 
import Dashboard from "./pages/Dashboard"; 
import Editor from "./pages/Editor"; 
import ProtectedRoute from "./components/ProtectedRoute"; 

function AppRoutes() { 
  const location = useLocation(); 

  // Handle Emergent OAuth callback BEFORE normal routing 
  if (location.hash && location.hash.includes("session_id=")) { 
    return <AuthCallback />; 
  } 

  return ( 
    <Routes> 
      <Route path="/" element={<Landing />} /> 
      <Route path="/login" element={<LoginPage />} /> 
      <Route path="/register" element={<RegisterPage />} /> 
      <Route path="/dashboard" element={ 
        <ProtectedRoute> 
          <Dashboard /> 
        </ProtectedRoute> 
      } /> 
      <Route path="/editor" element={ 
        <ProtectedRoute> 
          <Editor /> 
        </ProtectedRoute> 
      } /> 
      <Route path="/editor/:id" element={ 
        <ProtectedRoute> 
          <Editor /> 
        </ProtectedRoute> 
      } /> 
      <Route path="*" element={<Landing />} /> 
    </Routes> 
  ); 
} 

function App() { 
  return ( 
    <BrowserRouter> 
      <AuthProvider> 
        <AppRoutes /> 
        <Toaster position="top-right" richColors /> 
      </AuthProvider> 
    </BrowserRouter> 
  ); 
} 

export default App;
