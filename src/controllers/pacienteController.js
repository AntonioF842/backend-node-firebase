import PacienteService from "../service/pacienteService.js"

export default class PacienteController {
    constructor() {
        this.PacienteService = new PacienteService()
    }

    async getAll(req, res, next) {
        try {
            const pacientes = await this.PacienteService.getAll()
            res.status(200).json(pacientes)
        } catch (error) {
            next(error)
        }
    }

    async create(req, res, next) {
        try {
            const paciente = await this.PacienteService.create(req.body)
            res.status(201).json(paciente)
        } catch (error) {
            next(error)
        }
    }

    async update(req, res, next) {
        try {
            const paciente = await this.PacienteService.update(req.params.id, req.body)
            res.status(203).json(paciente)
        } catch (error) {
            next(error)
        }
    }

    async delete(req, res, next) {
        try {
            await this.PacienteService.delete(req.params.id)
            res.status(204).end()
        } catch (error) {
            next(error)
        }
    }
}