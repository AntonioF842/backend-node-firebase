import express from 'express'
import UserController from '../controllers/userController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import { roleMiddleware } from '../middlewares/roleMiddleware.js'

const router = express.Router()
const userController = new UserController()

const userRoutes = [
    {
        method: 'get',
        path: '/',
        middleware: [authMiddleware, roleMiddleware('admin', 'soporte')],
        handler: 'getAll'
    },
    {
        method: 'post',
        path: '/create',
        //middleware: [authMiddleware, roleMiddleware('admin', 'soporte')],
        handler: 'create'
    },
    {
        method: 'put',
        path: '/update/:id',
        middleware: [authMiddleware, roleMiddleware('admin', 'soporte')],
        handler: 'update'
    },
    {
        method: 'delete',
        path: '/delete/:id',
        middleware: [authMiddleware, roleMiddleware('admin', 'soporte')],
        handler: 'delete'
    },
    {
        method: 'post',
        path: '/login',
        //middleware: [authMiddleware, roleMiddleware('admin', 'soporte')],
        handler: 'login'
    },
    {
        method: 'post',
        path: '/logout',
        middleware: [authMiddleware],
        handler: 'logout'
    },
    {
        method: 'post',
        path: '/unlock/:id',
        middleware: [authMiddleware, roleMiddleware('admin', 'soporte')],
        handler: 'unlockUser'
    },
    {
        method: 'get',
        path: '/user',
        middleware: [authMiddleware],
        handler: 'getUserByUsername'
    },
]

userRoutes.forEach(route => {
    router[route.method](
        route.path,
        ...(route.middleware || []),
        userController[route.handler].bind(userController)
    )
})

export default router