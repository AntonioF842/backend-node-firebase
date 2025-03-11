import UserRepository from "../repositories/userRepository.js"
import TokenService from "./tokenService.js"
import { Usuario } from "../models/Usuario.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default class UserService {
    constructor() {
        this.UserRepository = new UserRepository()
        this.TokenService = new TokenService()
    }

    async getAll() {
        return await this.UserRepository.getAll()
    }

    async findByUser(usuario) {
        const user = this.UserRepository.findByUser(usuario)
        if (!user) {
            throw { message: 'Usuario No Encontrado', statusCode: 404 }
        }
    }

    async findByRol(rol) {
        return await this.UserRepository.findByRol(rol)
    }

    async create(userData) {
        const { nombre, apaterno, amaterno, usuario, password } = userData
        //Verificar que sea el usuario unico 
        const uniqueUser = await this.UserRepository.findByUser(usuario)
        if(uniqueUser) {
            throw { message: 'El Usuario ya Existe', statusCode: 400 }
        }
    // Verificar si no hay otro registrado con el mismo nombre completo 
        const uniqueFullName = await this.UserRepository.findByFullName(nombre,apaterno,amaterno)
        if (uniqueFullName) {
            throw { message: 'Ya existe un usuario con el mismo nombre completo', statusCode: 400 }
        }
        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new Usuario ({ ...userData, password:hashedPassword })
        return this.UserRepository.create({ ...newUser })
    }

    async update(id, userData) {
        const { password } =  userData
        const updateUser = await this.UserRepository.getById(id)

        if (!updateUser) {
            throw { message: 'Usuario no encontrado', statusCode:404 }
        }

        if (password) {
            updateUser.password = await bcrypt.hash(password, 10)
        }

        const newUser = new Usuario ({ ...updateUser })

        return this.UserRepository.update(id, { ...newUser })
    }
    async delete(id) {
        const userExists = await this.UserRepository.getById(id)
        if (!userExists) {
            throw { message: 'Usuario No Encontrado', statusCode: 404 }
        }
        await this.UserRepository.delete(id)
    }
    async login(usuario, password) {
        // Buscar el usuario en la base de datos
        const user = await this.UserRepository.findByUser(usuario);
        if (!user) {
            throw { message: 'Usuario No Encontrado', statusCode: 404 };
        }
    
        // Verificar si el usuario está bloqueado
        if (user.bloqueado) {
            throw { message: 'Usuario Bloqueado contactar al Administrador', statusCode: 401 };
        }
    
        // Verificar si ya hay una sesión activa
        const existingToken = await this.UserRepository.getSessionToken(user.id);
        if (existingToken) {
            throw { message: 'Ya hay una sesión activa', statusCode: 401 };
        }
    
        // Validar la contraseña
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) { // Lanzar error si la contraseña es incorrecta
            throw { message: 'Contraseña Incorrecta', statusCode: 401 };
        }
    
        // Generar un nuevo token JWT
        const token = jwt.sign(
            { id: user.id, usuario: user.usuario, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    
        // Actualizar el token de sesión en la base de datos
        await this.UserRepository.updateSessionToken(user.id, token);
    
        // Retornar el token generado
        return token;
    }
    async logout(userId, token) {
        const sessionToken = await this.UserRepository.getSessionToken(userId)
        if (sessionToken !==token) {
            throw { message: 'Token inválido', statusCode:401 }
        }
        await this.UserRepository.updateSessionToken(userId, null)
        await TokenService.revokeToken(token)
    }
    async unlockUser(id) {
        const user = await this.UserRepository.getById(id)
        if (!user) {
            throw { message: 'Usuario No Encontrado', statusCode: 404 }
        }
        await this.UserRepository.update(id, { bloqueado: false, intentos: 0 })
    }
    async handleFailedLogin(id) {
        const user = await this.UserRepository.getById(id)
        const intentos = user.intentos + 1
        if (intentos >= 3) {
            await this.UserRepository.update(id, { bloqueado:true })
            throw { message: 'Usuario Bloqueado despues de  3 intentos, contacta con el Administrador', statusCode : 401 }
        }
        await this.UserRepository.update(id, { intentos })
    }
    async getByUser(usuario) {
        const user = await this.UserRepository.findByUser(usuario)
        if (!user) {
            throw { message: 'Usuario No Encontrado', statusCode: 404 }
        }
        return user
    }
}