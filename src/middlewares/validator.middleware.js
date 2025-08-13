import { z } from "zod"

export const validateSchema = (schema) => (req, res, next) => {
 try {
  schema.parse(req.body)
  next()
 } catch (error) {
  console.log(error)
    if (error instanceof z.ZodError) { // Usa z.ZodError, no solo ZodError
      return res.status(400).json(error.issues.map((issue) => issue.message))
    }
    // Si no es un ZodError, devuelve un error 500
    console.error("Error inesperado:", error);
    return res.status(500).json({ message: "Error interno del servidor" })
 }
}