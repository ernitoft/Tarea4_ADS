const User = require("../models/database/Users");

const getOneUser = async (req, res) => {
    try {
        
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: true,
                code: 400,
                msg: 'No se ha proporcionado un ID de usuario',
            });
        }

        const user = await User.findByPk(id, {
            attributes: ['id', 'nombre', 'correoElectronico', 'apellidos', 'createdAt', 'updatedAt', 'estaEliminado'],
        });

        if (!user || user.estaEliminado) {
            return res.status(404).json({
                error: true,
                code: 404,
                msg: 'Usuario no encontrado',
            });
        }

        return res.status(200).json({
            error: false,
            code: 200,
            data: [
                user,
            ],
            msg: 'Usuario encontrado con éxito',
        });

    } catch (error) {
        console.log('Error en getOneUser: ', error);
        return res.status(500).json({
            error: true,
            code: 500,
            msg: 'Error desconocido obteniendo el usuario: ' + error.message,
        });
    }
}

const createUser = async (req, res) => {
    try {
        
        const { nombre, correoElectronico, apellidos, contraseña } = req.body;


        if (!nombre || !correoElectronico || !apellidos || !contraseña) {
            return res.status(400).json({
                error: true,
                code: 400,
                msg: 'Faltan datos obligatorios',
            });
        }

        const userExist = await User.findOne({
            where: {
                correoElectronico,
            },
        });
        if (userExist) {
            return res.status(400).json({
                error: true,
                code: 400,
                msg: 'Correo ya registrado',
            });
        }

        const newUser = await User.create({
            nombre,
            correoElectronico,
            apellidos,
            contraseña,
        });
        const { contraseña: _, ...newUserNoPass } = newUser.dataValues;

        return res.status(201).json({
            error: false,
            code: 201,
            data: newUserNoPass,
            msg: 'Usuario creado con éxito',
        });

    } catch (error) {
        console.log('Error en createUser: ', error);
        return res.status(500).json({
            error: true,
            code: 500,
            msg: 'Error desconocido creando el usuario: ' + error.message,

        });
    }
};


const updateUser = async (req, res) => {
    try {

    
        const { id } = req.params;
        const { nombre, correoElectronico, apellidos } = req.query;

        if (!id) {
            return res.status(400).json({
                error: true,
                code: 400,
                msg: 'No se ha proporcionado un ID de usuario',
            });
        }

        const user = await User.findByPk(id);

        if (!user || user.estaEliminado) {
            return res.status(404).json({
                error: true,
                code: 404,
                msg: 'Usuario no encontrado',
            });
        }

        await user.update({ nombre, correoElectronico, apellidos });

        return res.status(200).json({
            error: false,
            code: 200,
            data: user,
            msg: 'Usuario actualizado con éxito',
        });

    } catch (error) {
        console.log('Error en updateUser: ', error);
        return res.status(500).json({
            error: true,
            code: 500,
            msg: 'Error desconocido actualizando el usuario: ' + error.message,
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                error: true,
                code: 400,
                msg: 'No se ha proporcionado un ID de usuario',
            });
        }

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                error: true,
                code: 404,
                msg: 'Usuario no encontrado',
            });
        }

        if (user.estaEliminado) {
            return res.status(400).json({
                error: true,
                code: 400,
                msg: 'El usuario ya está eliminado',
            });
        }

        await user.update({ estaEliminado: true });

        return res.status(200).json({
            error: false,
            code: 200,
            msg: 'Usuario eliminado con éxito',
        });

    } catch (error) {
        console.log('Error en deleteUser: ', error);
        return res.status(500).json({
            error: true,
            code: 500,
            msg: 'Error desconocido eliminando el usuario: ' + error.message,
        });
    }
};

const getAllUsers = async (req, res) => {
    try {

    

        const users = await User.findAll({
            attributes: ['id', 'nombre', 'correoElectronico', 'apellidos'],
            where: { estaEliminado: false },
        });

        return res.status(200).json({
            error: false,
            code: 200,
            data: users,
            msg: 'Usuarios obtenidos con éxito',
        });

    } catch (error) {
        console.log('Error en getAllUsers: ', error);
        return res.status(500).json({
            error: true,
            code: 500,
            msg: 'Error desconocido obteniendo los usuarios: ' + error.message,
        });
    }
};





module.exports = { getOneUser, 
                   createUser,
                   updateUser,
                   deleteUser,
                   getAllUsers};