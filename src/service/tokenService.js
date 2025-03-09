const revokeToken = new Set()

class TokenService {
    static async revokeToken (token) {
        try {
            revokeToken.add(token)
        } catch (error) {
            throw { message: 'Error al revocar el token', statusCode: 500 }
        }
    }
    static async isTokenRevoked (token) {
        return revokeToken.has(token)
    }
}

export default TokenService