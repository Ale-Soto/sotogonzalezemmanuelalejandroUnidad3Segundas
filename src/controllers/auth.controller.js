import User from "../models/user.model.js"
import transporter from "../utils/transporter.js"
import bcrypt from "bcryptjs"
import {
 createAccessToken
} from "../libs/jwt.js"
import jwt from "jsonwebtoken"
import {
 TOKEN_SECRET
} from "../config.js"
import crypto from 'crypto'

// Generar token de recuperación
const generateResetToken = () => {
 return crypto.randomBytes(20).toString('hex')
}

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

// Enviar correo de recuperación
export const requestPasswordReset = async (req, res) => {
 try {
  const {
   email
  } = req.body;
  const user = await User.findOne({
   email
  })

  if (!user) {
   return res.status(404).json({
    message: "Usuario no encontrado"
   })
  }

  // Generar y guardar token
  const resetToken = generateResetToken()
  const resetTokenExpiry = Date.now() + 300000 // 5 min de expiración

  user.resetPasswordToken = resetToken
  user.resetPasswordExpires = resetTokenExpiry
  await user.save()

  // Enviar correo
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
   from: `"Soporte Lista" <${process.env.MAIL_USER}>`,
   to: user.email,
   subject: "Instrucciones para restablecer tu contraseña",
   html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Restablecimiento de Contraseña</h2>
          <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
          <p>Tu código de verificación es: <strong>${resetToken}</strong></p>
          <p>O haz clic en el siguiente enlace:</p>
          <a href="${resetUrl}" 
             style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">
             Restablecer Contraseña
          </a>
          <p style="margin-top: 20px; color: #6b7280;">
            Si no solicitaste este cambio, por favor ignora este mensaje.
          </p>
        </div>
      `
  })

  res.status(200).json({
   message: "Correo de recuperación enviado"
  })
 } catch (error) {
  console.error("Error en recuperación:", error)
  res.status(500).json({
   message: "Error al procesar la solicitud"
  })
 }
}

// Validar token y actualizar contraseña
export const resetPassword = async (req, res) => {
 try {
  const {
   token,
   newPassword
  } = req.body

  const user = await User.findOne({
   resetPasswordToken: token,
   resetPasswordExpires: {
    $gt: Date.now()
   }
  });

  if (!user) {
   return res.status(400).json({
    message: "Token inválido o expirado"
   })
  }

  // Actualizar contraseña
  user.password = await bcrypt.hash(newPassword, 10)
  user.resetPasswordToken = undefined
  user.resetPasswordExpires = undefined
  await user.save()

  // Enviar confirmación
  await transporter.sendMail({
   to: user.email,
   subject: "Contraseña actualizada",
   text: "Tu contraseña ha sido cambiada exitosamente."
  })

  res.status(200).json({
   message: "Contraseña actualizada correctamente"
  })
 } catch (error) {
  res.status(500).json({
   message: error.message
  })
 }
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