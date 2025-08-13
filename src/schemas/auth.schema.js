import {
 z
} from "zod"

export const registroSchema = z.object({
 name: z.string({
  required_issue: "Se requiere de un Nombre y Apellidos",
 }).min(1, "El nombre no puede estar vacío"),
 email: z.email("Email inválido"),
 username: z.string({
  required_issue: "Se requiere de un usuario",
 }).min(1, "El usuario no puede estar vacío"),
 password: z.string({
   required_issue: "Se requiere contraseña"
  })
  .min(6, "La contraseña debe ser de al menos 6 caracteres"),
 rol: z.number({required_error: "Se requiere de un rol",}).int("El rol debe ser un número entero")
  .min(1, "Elige un rol!")
  .max(2, "El rol debe ser '1' (Admin) o '2' (Monitor)"),
})

export const loginSchema = z.object({
 username: z.string({
  required_issue: "Se requiere de un usuario",
 }).min(1, "El usuario no puede estar vacío"),
 password: z.string({
   required_issue: "Se requiere contraseña"
  })
  .min(5, "La contraseña debe ser de al menos 6 caracteres")
})