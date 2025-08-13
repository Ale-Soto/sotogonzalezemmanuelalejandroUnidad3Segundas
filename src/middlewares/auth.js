import jwt from 'jsonwebtoken'
import { TOKEN_SECRET } from '../config.js'

export function requireAuth(req, res, next) {
  // 1. Leer el token desde las cookies (no desde headers)
  const token = req.cookies.token; // <- Nombre debe coincidir con el usado en res.cookie()
  if (!token) return res.status(401).json({ message: 'Token requerido' })
  try {
    // 2. Verificar el token JWT
    const decoded = jwt.verify(token, TOKEN_SECRET)
    req.userId = decoded.id // Almacena el ID en el request
    next()
  } catch {
    res.status(401).json({ message: 'Token inválido o expirado' })
  }
}
