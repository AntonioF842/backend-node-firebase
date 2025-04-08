import PacienteRepository from '../repositories/pacienteRepository.js'
import { Pacientes } from '../models/Pacientes.js'

export default class PacienteService {
    constructor() {
        this.PacienteRepository = new
        PacienteRepository()
    }

    async getAll() {
        return await this.PacienteRepository.getAll()
    }
    async create(pacienteData) {
        const { fullName } = pacienteData
        
        const uniquePaciente = await this.PacienteRepository.findByName(fullName)
        if (uniquePaciente) {
            throw { message: 'El paciente ya existe', statusCode: 404 }
        }

        const newPaciente =  new Pacientes({ ...pacienteData })
        return this.PacienteRepository.create({ ...newPaciente })
    }

    async update(id, pacienteData) {
        const updatePaciente = await this.PacienteRepository.getById(id)
        if (!updatePaciente) {
            throw { message: 'Paciente no encontrado', statusCode: 404 }
        }
        const newPaciente = new Pacientes({ ...updatePaciente, ...pacienteData })
        return this.PacienteRepository.update(id, { ...newPaciente })
    }

    async delete(id) {
        const deletePaciente = await this.PacienteRepository.getById(id)
        if (!deletePaciente) {
            throw { message: 'Paciente no encontrado', statusCode: 404 }
        }
        return this.PacienteRepository.delete(id)
    }
}