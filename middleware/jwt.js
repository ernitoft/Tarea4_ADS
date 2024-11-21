const jwt = require('jsonwebtoken');

const generateToken = () => {
    return new Promise((resolve, reject) => {
        jwt.sign({}, process.env.SECRET, { expiresIn: '1460h' }, (error, token) => {
            if (error) {
                return reject('No se pudo generar el token: ' + error.message);
            }
            resolve(token);
        });
    });
};

const validateJWT = async (req, res, next) => {
    try {
        const header = req.headers['authorization'];
        const token = header && header.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                error: true,
                msg: 'No se ha proporcionado un token de autenticación',
            });
        }

        jwt.verify(token, process.env.SECRET);
        next();
    } catch (error) {
        console.log('Error en la validación del token: ', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: true,
                msg: 'Token expirado',
            });
        }
        return res.status(401).json({
            error: true,
            msg: 'Token no válido',
        });
    }
};

module.exports = { generateToken, validateJWT };
