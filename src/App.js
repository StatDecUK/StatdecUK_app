
import "./index.css"; 
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"; 
import { AuthProvider } from "./context/AuthContext"; 
import { Toaster } from "./components/ui/sonner"; 
import Landing from "./pages/Landing"; 
import { LoginPage, RegisterPage } from "./pages/Auth"; 
import AuthCallback from "./pages/AuthCallback"; 
import Dashboard from "./pages/Dashboard"; 
import Editor from "./pages/Editor"; 
import ProtectedRoute from "./components/ProtectedRoute"; 
