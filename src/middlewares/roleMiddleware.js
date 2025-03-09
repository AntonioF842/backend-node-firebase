export function roleMiddleware(...allowedRoles) {
    return (req, res, next) => {
        const { rol } = req.user 
        if (!allowedRoles.includes(rol)) {
            return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' })
        }
        next()
    }
}