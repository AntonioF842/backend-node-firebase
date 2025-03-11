import IUserRepository from "../interface/IUserRepository.js"
import { db } from "../config/firebase.js"

export default class UserRepository extends IUserRepository {
    constructor() {
        super()
        this.collection =  db.collection('usuarios-node')
    }

    async create(user) {
        const userCreated = await this.collection.add(user)
        return { id: userCreated.id, ...user }
    }

    async update (id, updateData) {
        await this.collection.doc(id).update(updateData)
        return { id, ...updateData }
    }

    async delete(id) {
        await this.collection.doc(id).delete()
        return { id, message: 'Usuario Elimindo'}
    }

    async getAll() {
        const usuarios = await this.collection.get()
        return usuarios.docs.map((doc) => ({ id: doc.id, ...doc.data()}))
    }

    async findByFullName(nombre, apaterno, amaterno) {
        const usuario = await this.collection
        .where('nombre', '==', nombre)
        .where('apaterno', '==', apaterno)
        .where('amaterno', '==', amaterno)
        .get()
        return usuario.empty ? null : { id:usuario.docs[0].id, ...usuario.docs[0].data() }
    }

    async findByUser(user) {
        const usuario = await this.collection
        .where('usuario', '==', user)
        .get()
        return usuario.empty ? null : { id:usuario.docs[0].id, ...usuario.docs[0].data() }
    }

    async findByRol(rol) {
        const usuario = await this.collection
        .where('usuario', '==', rol)
        .get()
        return usuario.empty ? null : { id:usuario.docs[0].id, ...usuario.docs[0].data() }
    }

    async updateSessionToken(userId, sessionToken) {
        const user = this.collection.doc(userId);
    
        // Guardar el token
        await user.update({ currentSessionToken: sessionToken });
    
        // Verificar si el token se guardó correctamente
        const updatedUser = await user.get();
        console.log("Usuario después de actualizar:", updatedUser.data());
    }
    

    async getSessionToken(userId) {
        const user = this.collection.doc(userId);
        const userLogged = await user.get();
    
        console.log("Datos del usuario en Firebase:", userLogged.exists ? userLogged.data() : "Usuario no encontrado");
    
        return userLogged.exists ? userLogged.data().currentSessionToken || null : null;
    }
    

    async getById(id) {
        const usuario = await this.collection.doc(id).get()
        return usuario.empty ? null : { id: usuario.id, ...usuario.data() }
    }
}