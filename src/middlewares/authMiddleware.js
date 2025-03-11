import jwt from 'jsonwebtoken'
import TokenService from '../service/tokenService.js'
import UserRepository from '../repositories/userRepository.js'

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'No se proporciona un token' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token recibido:', token);

    const userRepository = new UserRepository();
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);

        if (!decoded.id) {
            throw { message: 'Token sin ID de usuario', statusCode: 401 };
        }

        const existingToken = await userRepository.getSessionToken(decoded.id);
        console.log('Token en DB:', existingToken);
        console.log('Token recibido:', token);
        console.log('Son iguales:', existingToken === token);

        const isRevoked = await TokenService.isTokenRevoked(token);
        console.log('Token revocado:', isRevoked);

        if (existingToken !== token || isRevoked) {
            throw { message: 'Token inválido o revocado', statusCode: 401 };
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error in authMiddleware:', error);
        res.status(error.statusCode || 403).json({ message: 'Token inválido', details: error.message });
    }
};

export default authMiddleware;
