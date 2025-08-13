import { useState, useEffect } from "react"
import { AuthContext } from "../context/AuthContext.jsx"
import { registroReq, loginReq, verifyTokenReq } from "../api/auth.js"
import PropTypes from 'prop-types'
import { useNavigate } from "react-router"
import axios from '../api/axios.js'


export const AuthProvider = ({ children }) => {

 const [user, setUser] = useState({
  id: null,
  rol: null,
  estado: null
 })
 const [isAuthenticated, setIsAuthenticated] = useState(false)
 const [loading, setLoading] = useState(true)
 const [errors, setErrors] = useState([])
 const navigate = useNavigate()


 const signup = async (userData) => {
  setErrors([])
  try {

   console.log("Enviando datos:", userData) // <-- Agregar esto
   const res = await registroReq(userData)
   console.log("Respuesta recibida:", res) // <-- Agregar esto

   // Registro exitoso (código 201)
   if (res.status === 201) {
    return { success: true, data: res.data, message: "Usuario registrado exitosamente" }
   }


   // Manejo de errores de validación (código 400)
   if (res.status === 400) {
    let errorMessages = []

    // Caso 1: El error viene en formato {errors: [...]}
    if (res.data?.errors) {
     errorMessages = Array.isArray(res.data.errors) ? res.data.errors : [res.data.errors]
    }
    // Caso 2: El error viene como array plano
    else if (Array.isArray(res.data)) {
     errorMessages = res.data
    }
    // Caso 3: El error viene como string u otro formato
    else {
     errorMessages = [res.data.message || JSON.stringify(res.data)]
    }

    setErrors(errorMessages)
    return { success: false }
   }

   // Para otros códigos de estado no manejados
   setErrors(["Error desconocido durante el registro"])
   return { success: false }
  } catch (error) {
   console.error('Error en registro:', error)

   // Manejo mejorado de errores de Axios
   if (error.response) {
    const serverError = error.response.data
    let errorMessages = []

    if (serverError?.errors) {
     errorMessages = Array.isArray(serverError.errors) ? serverError.errors : [serverError.errors]
    } else if (Array.isArray(serverError)) {
     errorMessages = serverError
    } else {
     errorMessages = [serverError.message || "Error al registrar usuario"]
    }

    setErrors(errorMessages)
   } else {
    setErrors(["Error de conexión al servidor"])
   }

   return { success: false }
  }
 }

 const signin = async (userData) => {
  try {
   const res = await loginReq(userData)

   if (res.data?.blocked) {
    setErrors(["Tu cuenta está bloqueada, contacta a un administrador"])
    return;
   }

   setUser({
    id: res.data.id,
    username: res.data.username,
    rol: res.data.rol,
    estado: res.data.estado
   })
   setIsAuthenticated(true)

   if (res.data.rol === 2) {
    navigate("/escanear") // Si el rol es 2, navega a /escanear
   } else {
    navigate("/eventos") // Para cualquier otro rol, navega a /eventos
   }

  } catch (error) {
   if (error.response?.data?.blocked) {
    setErrors(["Tu cuenta está bloqueada, contacta a un administrador"])
   } else if (Array.isArray(error.response?.data)) {
    setErrors(error.response.data)
   }
   setErrors([error.response?.data?.message || "Error al iniciar sesión"])
  }
 }

 const signout = async () => {
  try {
   const res = await axios.post('/logout', null, { withCredentials: true })
   if (res.status === 200) {
    setIsAuthenticated(false)
    setUser(null)
    navigate('/')
   } else {
    console.error("Logout no fue exitoso:", res)
   }
  } catch (error) {
   console.error("Error al cerrar sesión:", error)
   alert("Hubo un problema al cerrar sesión. Revisa la consola.")
  }
 }

 useEffect(() => {
  if (errors.length > 0) {
   const timer = setTimeout(() => {
    setErrors([])
   }, 6000)
   return () => clearTimeout(timer)
  }
 }, [errors])

 useEffect(() => {
  async function checkAuth() {
   try {
    const res = await verifyTokenReq()
    setIsAuthenticated(res.data.isAuthenticated)
    setUser({
     id: res.data.user?.id || null,
     rol: res.data.user?.rol || null,
     estado: res.data.user?.estado || null
    })
   } catch (error) {
    setIsAuthenticated(false)
    setUser({
     id: null,
     rol: null,
     estado: null
    })
   } finally {
    setLoading(false)
   }
  }
  checkAuth()
 }, [])

 return (
  <AuthContext.Provider value={{ signup, signin, signout, loading, user, isAuthenticated, errors, setErrors }}>
   {children}
  </AuthContext.Provider>
 )
}

AuthProvider.propTypes = {
 children: PropTypes.node.isRequired, // Valida que 'children' sea un nodo React y sea obligatorio
}