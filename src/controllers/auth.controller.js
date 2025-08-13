import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import {
 createAccessToken
} from "../libs/jwt.js"
import jwt from "jsonwebtoken"
import {
 TOKEN_SECRET
} from "../config.js"

export const registrar = async (req, res) => {
 const {
  name,
  email,
  password,
  username,
  rol
 } = req.body
 // Validación manual
 const errors = []
 if (!name) errors.push('Nombre completo requerido')
 if (!email) errors.push('Email requerido')
 if (!username) errors.push('Nombre de usuario requerido')
 if (!password || password.length < 6) errors.push('La contraseña debe tener al menos 6 caracteres')
 if (!rol || (rol !== 1 && rol !== 2)) errors.push('Rol inválido')

 if (errors.length > 0) return res.status(400).json({
  errors
 })
 try {
  // Verificar duplicados
  const [userExists, emailExists] = await Promise.all([
   User.findOne({
    username
   }),
   User.findOne({
    email
   })
  ])

  if (userExists) return res.status(400).json({
   errors: ['El nombre de usuario ya existe']
  })
  if (emailExists) return res.status(400).json({
   errors: ['El email ya está registrado']
  })

  // Crear usuario
  const newUser = new User({
   name,
   username,
   email,
   password: await bcrypt.hash(password, 10),
   rol: parseInt(rol),
   estado: 1
  })

  await newUser.save()

  res.status(201).json({
   id: newUser._id,
   username: newUser.username,
   email: newUser.email,
   rol: newUser.rol
  })

 } catch (error) {
  console.error('Error en registro:', error);
  res.status(500).json(['Error interno del servidor']);
 }
}

export const login = async (req, res) => {
 const {
  username,
  password,
 } = req.body
 try {

  const userFound = await User.findOne({
   username
  })

  if (!userFound) return res.status(400).json({
   message: "No se encontró al usuario"
  })

  if (userFound.estado !== 1) return res.status(403).json({
   message: "Cuenta bloqueada"
  })

  const isMatch = await bcrypt.compare(password, userFound.password)

  if (!isMatch) return res.status(400).json({
   message: "Contraseña incorrecta"
  })

  const token = await createAccessToken({
   id: userFound._id,
   username: userFound.username,
   rol: userFound.rol,
   estado: userFound.estado
  })

  res.cookie('token', token, {
   httpOnly: true, // restringe el acceso desde JavaScript
   secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
   sameSite: 'strict', // Previene vulnerabilidad
   maxAge: 24 * 60 * 60 * 1000, // 1 día de expiración
  })
  res.json({
   id: userFound._id,
   username: userFound.username,
   rol: userFound.rol,
   estado: userFound.estado
  })
 } catch (error) {
  res.status(500).json({
   message: error.message
  })
 }
}
export const logout = (req, res) => {
 res
  .setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  .clearCookie('token', {
   httpOnly: true,
   secure: process.env.NODE_ENV === 'production',
   sameSite: 'strict'
  })
 return res.sendStatus(200)
}

export const perfil = async (req, res) => {

 const userFound = await User.findById(req.user.id)
 if (!userFound) return res.status(400).json({
  message: "Usuario no encontrado"
 })

 return res.json({
  id: userFound._id,
  username: userFound.username,
 })

}

export const verifyToken = async (req, res) => {
 const token = req.cookies.token

 if (!token) return res.json({
  isAuthenticated: false
 })

 jwt.verify(token, TOKEN_SECRET, async (err, user) => {

  if (err) return res.json({
   isAuthenticated: false
  })

  return res.json({
   isAuthenticated: true,
   user: {
    id: user._id,
    username: user.username
   }
  })
 })
}