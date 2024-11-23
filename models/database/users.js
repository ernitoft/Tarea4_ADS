const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('./database.js');
const { v4: uuidv4 } = require('uuid');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
    },
    nombre: {
        type: DataTypes.STRING(15),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 15],
        },
    },
    correoElectronico: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true,
        },
    },
    apellidos: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 100],
        },
    },
    contraseña: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true, // Se asegura que no esté vacío
        },
    },
    estaEliminado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: true,
    paranoid: true,
});


// Hook para hashear la contraseña antes de crear el usuario
User.beforeCreate(async (user) => {
    const saltRounds = 10;
    user.contraseña = await bcrypt.hash(user.contraseña, saltRounds);
});

// Hook para hashear la contraseña si se modifica
User.beforeUpdate(async (user) => {
    if (user.changed('contraseña')) {
        const saltRounds = 10;
        user.contraseña = await bcrypt.hash(user.contraseña, saltRounds);
    }
});

module.exports = User;
