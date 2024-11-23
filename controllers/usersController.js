const User = require("../models/database/Users");
const bcrypt = require('bcrypt'); // Para hashear contraseñas
const {Op} = require('sequelize');

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

const getAllUsers = async (req, res) => {
    try {        
        if (req.query.page && isNaN(parseInt(req.query.page)) ||
            req.query.limit && isNaN(parseInt(req.query.limit)) ||
            req.query.page && parseInt(req.query.page) < 1 ||
            req.query.limit && parseInt(req.query.limit) < 1){

            return res.status(400).json({
                error: true,
                code: 400,
                msg: 'Los parámetros page y limit deben ser un números enteros positivos',
            });
        }

        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit; 

        const { count, rows: users } = await User.findAndCountAll({
            attributes: ['id', 'nombre', 'correoElectronico', 'apellidos'],
            where: { estaEliminado: false },
            limit,
            offset,
        });

        if (!users || users.length === 0) {
            return res.status(404).json({
                error: true,
                code: 404,
                msg: 'No se encontraron usuarios',
            });
        }

        return res.status(200).json({
            error: false,
            code: 200,
            data: {
                totalUsers: count, 
                totalPages: Math.ceil(count / limit),
                currentPage: page, 
                users, 
            },
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

const createUser = async (req, res) => {
    try {
        
        const { nombre, correoElectronico, apellidos, contraseña } = req.body;

        if (!nombre || !correoElectronico || !apellidos || !contraseña) {
            return res.status(400).json({
                error: true,
                code: 400,
                msg: 'Todos los campos son obligatorios',
            });
        }
        if (contraseña.length < 8) {
            return res.status(400).json({
                error: true,
                code: 400,
                msg: 'La contraseña debe tener al menos 8 caracteres',
            });
        }
        
        else if (contraseña.length > 30) {
            return res.status(400).json({
                error: true,
                code: 400,
                msg: 'La contraseña no puede tener más de 30 caracteres',
            });
        }

        else if (nombre.length > 15) {
            return res.status(400).json({
                error: true,
                code: 400,
                msg: 'El nombre no puede tener más de 15 caracteres',
            });
        }

        else if (apellidos.length > 100) {
            return res.status(400).json({
                error: true,
                code: 400,
                msg: 'Los apellidos no pueden tener más de 100 caracteres',
            });
        }

        else if (correoElectronico.length > 100) {
            return res.status(400).json({
                error: true,
                code: 400,
                msg: 'El correo electrónico no puede tener más de 100 caracteres',
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
        const { nombre, correoElectronico, apellidos, contraseña, estaEliminado } = req.body;

        if (!id) {
            return res.status(400).json({
                error: true,
                code: 400,
                msg: 'No se ha proporcionado un ID de usuario',
                data: null,
            });
        }

        const updates = {};
        if (nombre && nombre.length > 15) {
            return res.status(400).json({
                error: true,
                code: 400,
                msg: 'El nombre no debe exceder los 15 caracteres',
                data: null,
            });
        }
        if (correoElectronico && correoElectronico.length > 100) {
            return res.status(400).json({
                error: true,
                code: 400,
                msg: 'El correo electrónico no debe exceder los 100 caracteres',
                data: null,
            });
        }
        if (apellidos && apellidos.length > 100) {
            return res.status(400).json({
                error: true,
                code: 400,
                msg: 'Los apellidos no deben exceder los 100 caracteres',
                data: null,
            });
        }
        if (contraseña && contraseña.length > 30) {
            return res.status(400).json({
                error: true,
                code: 400,
                msg: 'La contraseña no debe exceder los 30 caracteres',
                data: null,
            });
        }

        if (nombre) updates.nombre = nombre;
        if (correoElectronico) updates.correoElectronico = correoElectronico;
        if (apellidos) updates.apellidos = apellidos;
        if (estaEliminado !== undefined && estaEliminado !== null) updates.estaEliminado = estaEliminado;
        if (contraseña) updates.contraseña = contraseña;

        const user = await User.findByPk(id);

        if (!user || user.estaEliminado) {
            return res.status(404).json({
                error: true,
                code: 404,
                msg: 'Usuario no encontrado',
                data: null,
            });
        }

        if (correoElectronico) {
            const existingUser = await User.findOne({
                where: {
                    correoElectronico,
                    id: { [Op.ne]: id }, // Verifica que no sea el mismo usuario
                },
            });

            if (existingUser) {
                return res.status(409).json({
                    error: true,
                    code: 409,
                    msg: 'El correo electrónico ya está en uso por otro usuario',
                    data: null,
                });
            }
        }

        await user.update(updates);

        return res.status(204).send();
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

        return res.status(204).send();

    } catch (error) {
        console.log('Error en deleteUser: ', error);
        return res.status(500).json({
            error: true,
            code: 500,
            msg: 'Error desconocido eliminando el usuario: ' + error.message,
        });
    }
};







module.exports = { getOneUser, 
                   createUser,
                   updateUser,
                   deleteUser,
                   getAllUsers};