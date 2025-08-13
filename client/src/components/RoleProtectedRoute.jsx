import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PropTypes from 'prop-types'

function RoleProtectedRoute({ allowedRoles, children }) {
 const { user, signout, isAuthenticated, loading } = useAuth()
 const location = useLocation()

 useEffect(() => {
  // Verificación adicional contra el backend
  if (isAuthenticated && user?.estado !== undefined && user?.estado !== 1) {
   signout()
  }
 }, [isAuthenticated, user, signout])

 if (loading) {
  return <div>Cargando...</div>
 }

 // Verificar autenticación primero
 if (!isAuthenticated) {
  return <Navigate to="/" replace state={{ from: location }} />
 }

 // Si la cuenta está bloqueada
 if (user?.estado !== 1) {
  return <Navigate to="/no-autorizado" replace state={{
   blocked: true,
   message: "Tu cuenta ha sido bloqueada, contacta a un administrador."
  }} />
 }

 // Verificar rol del usuario
 if (!allowedRoles.includes(user?.rol)) {
  return <Navigate to="/no-autorizado" replace state={{
   message: "No tienes permisos para acceder a esta sección."
  }} />
 }

 return children
}


RoleProtectedRoute.propTypes = {
 children: PropTypes.node.isRequired, // Valida que 'children' sea un nodo React y sea obligatorio
 allowedRoles: PropTypes.arrayOf(PropTypes.number).isRequired // Valida que 'children' sea un nodo React y sea obligatorio
}

export default RoleProtectedRoute;