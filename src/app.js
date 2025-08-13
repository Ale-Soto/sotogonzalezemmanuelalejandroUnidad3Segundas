import express from "express"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import cors from "cors";

import authRoutes from "./routes/auth.routes.js"
import eventRoutes from "./routes/event.routes.js"
import accesoRoutes from "./routes/acceso.routes.js"

import estudiantesRoutes from "./routes/estudiantes.routes.js";
import invitadosRoutes from "./routes/invitados.routes.js"



const app = express()

app.use(cors({
 origin: 'http://localhost:5173',
 credentials: true,
 exposedHeaders: ['set-cookie'],
 methods: ['GET', 'POST', 'PUT', 'DELETE']
}))

app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
 res.setHeader('Cache-Control', 'no-store')
 next()
})





app.use("/lista", authRoutes)
app.use("/eventos", eventRoutes)
app.use("/acceso", accesoRoutes)
app.use('/estudiantes', estudiantesRoutes)
app.use('/invitados', invitadosRoutes)

export default app