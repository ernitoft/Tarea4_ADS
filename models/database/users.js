const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('./database.js');

const User = sequelize.define('User', {
    nombre: {
        type: DataTypes.STRING(15), // Máximo 15 caracteres
        allowNull: false,
        validate: {
            notEmpty: true, // No puede estar vacío
            len: [1, 15] // Longitud entre 1 y 15 caracteres
        }
    },
    correoElectronico: {
        type: DataTypes.STRING(100), // Máximo 100 caracteres
        allowNull: false,
        unique: true, // Campo único
        validate: {
            isEmail: true, // Valida formato de email
            notEmpty: true
        }
    },
    apellidos: {
        type: DataTypes.STRING(100), // Máximo 100 caracteres
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 100] // Longitud entre 1 y 100 caracteres
        }
    },
    contraseña: {
        type: DataTypes.STRING(255), // Almacena el hash (puede ser largo)
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [8, 30] // Contraseña entre 8 y 30 caracteres (antes de hashear)
        }
    },
    estaEliminado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false // Por defecto, no eliminado
    }
}, {
    timestamps: true, // Incluye createdAt y updatedAt
    paranoid: true, // Agrega soporte para "soft delete" si deseas usarlo
});

// Hook para hashear la contraseña antes de guardar el usuario
User.beforeCreate(async (user) => {
    const saltRounds = 10;
    user.contraseña = await bcrypt.hash(user.contraseña, saltRounds);
});

// Opcional: Hook para actualizar la contraseña si se modifica
User.beforeUpdate(async (user) => {
    if (user.changed('contraseña')) {
        const saltRounds = 10;
        user.contraseña = await bcrypt.hash(user.contraseña, saltRounds);
    }
});

module.exports = User;
