import {
 Router
} from 'express'
import {
 login,
 registrar,
 logout,
 verifyToken
} from '../controllers/auth.controller.js'
import {
 authRequired,
 adminRequired
} from '../middlewares/validateToken.js'
import {
 validateSchema
} from '../middlewares/validator.middleware.js'
import {
 registroSchema,
 loginSchema
} from '../schemas/auth.schema.js'

const router = Router()

router.post('/registro', authRequired, adminRequired, validateSchema(registroSchema), registrar)
router.post('/', validateSchema(loginSchema), login)
router.post('/logout', logout)
router.get('/verify', verifyToken)

export default router