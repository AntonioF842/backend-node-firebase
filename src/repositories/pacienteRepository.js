import IPacienteRepository from "../interface/IPacienteRepository.js"
import { db } from '../config/firebase.js'

export default class PacienteRepository extends IPacienteRepository {
    constructor() {
        super()
        this.collection = db.collection('pacientes-node')
    }

    async create(paciente) {
        const newPaciente = await this.collection.add(paciente)
        return { id: newPaciente.id, ...paciente}
    }

    async update(id, updateData) {
        await this.collection.doc(id).update(updateData)
        return { id, ...updateData}
    }

    async delete(id) {
        await this.collection.doc(id).delete()
        return { id, message: 'Paciente eliminado' }
    }

    async getAll() {
        const pacientes = await this.collection.get()
        return pacientes.docs.map(doc => ({
            id: doc.id, ...doc.data()
        }))
    }

    async findByName(fullName) {
        const pacientes = await this.collection.where('fullName', '==', fullName).get()
        return pacientes.empty ? null : { id: paciente.docs[0].id, ...paciente.docs[0].data() }
    }

    async getById(id) {
        const paciente = await this.collection.doc(id).get()
        return paciente.exists ? { id, ...paciente.data() } : null
    }
}