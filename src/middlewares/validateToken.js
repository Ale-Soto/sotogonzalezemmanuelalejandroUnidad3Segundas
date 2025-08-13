import jwt from 'jsonwebtoken'
import {
 TOKEN_SECRET
} from '../config.js';

export const authRequired = (req, res, next) => {
 const token = req.cookies.token

 if (!token)
  return res.status(401).json({
   message: "Sin token, autorización denegada"
  })

 jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
  if (err) {
   // Invalida la cookie si el token es inválido
   res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0)
   })
   return res.status(403).json({
    message: 'Token inválido o expirado'
   })
  }

  // Verificar estado del usuario (1 = activo, 0 = inactivo/bloqueado)
  if (decoded.estado !== 1) {
   res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0)
   })
   return res.status(403).json({
    message: 'Tu cuenta está bloqueada, contacta a tu proveedor de servicio',
    blocked: true
   })
  }

  req.user = {
   id: decoded.id,
   rol: decoded.rol,
   estado: decoded.estado
  } // Estandariza el objeto user
  next()
 })
}


// Middleware para verificar rol de administrador
export const adminRequired = (req, res, next) => {
 if (req.user?.rol !== 1) {
  return res.status(403).json({
   message: 'Acceso denegado: se requiere rol de administrador'
  })
 }
 next()
}

// Middleware para verificar rol de monitor
export const monitorRequired = (req, res, next) => {
 if (req.user?.rol !== 2) {
  return res.status(403).json({
   message: 'Acceso denegado: se requiere rol de monitor'
  })
 }
 next()
}