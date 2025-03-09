import UserService from "../service/userService.js";

export default class UserController {
    constructor() {
        this.userService = new UserService()
    }
    async getAll(req, res, next) {
        try {
            const users = await this.userService.getAll()
            res.json(users)
        }catch (error) {
            next(error)
        }
    }
    async getByUser(req, res, next) {
        try {
            const { usuario } = req.params
            const user =  await this.userService.findByUser(usuario)
        } catch (error) {
            next(error)
        }
    }
    async getByRol(req, res, next) {
        try {
            const { rol } = req.params
            const user =  await this.userService.findByRol(rol)
        } catch (error) {
            next(error)
        }
    }
    async create(req, res, next) {
        try {
            const userData = req.body
            const user = await this.userService.create(userData)
            res.status(201).json(user)
        } catch (error) {
            next(error)
        }
    }
    async update(req, res, next) {
        try {
            const { id } = req.params
            const userData = req.body
            const user =  await this.userService.update(id, userData)
            res.json(user)
        } catch (error) {
            next(error)
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params
            await this.userService.delete(id)
            res.status(204).end()
        } catch (error) {
            next(error)
        }
    }
    async login(req, res, next) {
        try {
            const { usuario, password } = req.body
            const token = await this.userService.login(usuario, password)
            res.json({ token })
        } catch (error) {
            next(error)
        }
    }
    async logout(req, res, next) {
        try {
            const authHeader = req.headers.authorization
            if (!authHeader) {
                throw { message: 'Token no proporcioando' , statusCode: 400 }
            }
            const token = authHeader.split(' ')[1]
            const userId = req.user.id
            await this.userService.logout(userId, token)
            res.status(204).json({ messa: 'Sesión cerrada' })
        } catch (error) {
            next(error)
        }
    }
    async unlockUser (req, res, next) {
        try {
            const { id } = req.params
            await this.userService.unlockUser(id)
            res.status(204).json({ message: 'Usuario desbloqueado' })
        } catch (error) {
            next(error)
        }
    }
    async getUserByUsername(req, res, next) {
        try {
            const { usuario } = req.user
            if(!usuario) {
                throw { message: 'Usuario no encontrado', statusCode: 404 }
            }
            const user = await this.userService.getByUser(usuario)
            if(!user) {
                throw { message: 'Usuario no encontrado', statusCode: 404 }
            }
            res.json({ user })
        } catch (error) {
            next(error)
        }
    }
}