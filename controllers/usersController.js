const User = require("../models/database/Users");

const getOneUser = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                error: true,
                msg: 'No se ha proporcionado un token de autenticación',
            });
        }

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: true,
                msg: 'No se ha proporcionado un ID de usuario',
            });
        }

        const user = await User.findByPk(id, {
            attributes: ['id', 'nombre', 'correoElectronico', 'apellidos', 'createdAt', 'updatedAt', 'estaEliminado'],
        });

        if (!user || user.estaEliminado) {
            return res.status(404).json({
                error: true,
                msg: 'Usuario no encontrado',
            });
        }

        return res.status(200).json({
            error: false,
            data: [
                user,
            ],
            msg: 'Usuario encontrado con éxito',
        });

    } catch (error) {
        console.log('Error en getOneUser: ', error);
        return res.status(500).json({
            error: true,
            msg: 'Error desconocido obteniendo el usuario: ' + error.message,
        });
    }
}

module.exports = { getOneUser };