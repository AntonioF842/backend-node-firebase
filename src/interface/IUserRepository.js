export default class IUserRepository {
    /*
    Crear Usuario
    @param {Objeto} = Datos del Usuario
    @return {Promise<Objeto>} = Usuario Creado
    */
   create (user) {
    throw new Error('Método implementado')
   }
   update (id, updateData) {
    throw new Error('Método implementado')
   }
   delete (id) {
    throw new Error('Método implementado')
   }
   getAll () {
    throw new Error('Método implementado')
   }
   findByFullName (nombre, apaterno, amaterno) {
    throw new Error('Método implementado')
   }
   findByUser (usuario) {
    throw new Error('Método implementado')
   }
   findByRol (rol) {
    throw new Error('Método implementado')
   }
   getById(id) {
    throw new Error('Método implemetado')
   }
}