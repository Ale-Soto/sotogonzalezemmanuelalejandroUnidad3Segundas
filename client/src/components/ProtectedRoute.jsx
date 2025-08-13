import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import axios from 'axios'

function ProtectedRoute() {
 const { signout, isAuthenticated, loading } = useAuth()
 const location = useLocation()

 
 useEffect(() => {
  // Verificación adicional contra el backend
  if (isAuthenticated) {
   axios.get('/verify', { withCredentials: true })
    .catch(() => {
     // Si el backend rechaza la verificación, forzar logout
     signout();
    });
  }
 }, [isAuthenticated, signout, location.pathname]);

 if (loading) {
  return <div>Cargando...</div>; // O un spinner
 }

 return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}

export default ProtectedRoute