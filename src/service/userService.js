import UserRepository from "../repositories/userRepository";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default class UserService {
    constructor() {
        this.UserRepository = new UserRepository()
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
        const newUser = { ...userData, password:hashedPassword }
        return this.UserRepository.create(newUser)
    }

    async update(id, userData) {
        const { password } =  userData
        const updateUser = { ...userData }
        if (password) {
            updateUser.password = await bcrypt.hash(password, 10)
        }
        return this.UserRepository.update(id, updateUser)
    }
    async delete(id) {
        const userExists = await this.UserRepository.getById(id)
        if (!userExists) {
            throw { message: 'Usuario No Encontrado', statusCode: 404 }
        }
        await this.UserRepository.delete(id)
    }
}