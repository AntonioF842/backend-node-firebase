import express from 'express'
import userRoutes from './userRoutes.js'
import pacienteRoutes from './pacienteRoutes.js'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ message: 'API v1' })
})

router.use('/users', userRoutes)
router.use('/patients', pacienteRoutes) // 👈 ojo: esta es la ruta correcta

export default router
