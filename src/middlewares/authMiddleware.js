import jwt from 'jsonwebtoken'
import TokenService from '../service/tokenService.js'
import UserRepository from '../repositories/userRepository.js'

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader) {
        return res. status(401).json({ message: 'No se proporciona un token' })
    }
    const token = authHeader.split(' ')[1]
    const userRepository = new UserRepository()
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const existingToken = await userRepository.getSessionToken(decoded.id)
        console.log('@@ tokens => ', decoded, existingToken === token)
        if (existingToken !== token || await TokenService.isTokenRevoked(token)) {
            throw { message: 'Token invalido', statusCode: 401 }
        }
        req.user = decoded
        next()
    } catch (error) {
        console.error('Error in authMiddleware:', error);
        res.status(403).json({ message: 'token invalido', details: error.message });
    }
}

export default authMiddleware