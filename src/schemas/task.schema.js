import {
 z
} from "zod"

export const createTaskSchema = z.object({
 title: z.string({
  required_issue: "Se requiere de un título",
 }).min(1, "El título no puede estar vacío"),
 description: z.string({
  required_issue: "Se requiere de una descripción",
 }).min(1, "La descripción no puede estar vacía"),
 date: z.string().datetime().optional(),
})