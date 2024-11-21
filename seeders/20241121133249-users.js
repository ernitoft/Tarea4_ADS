const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usuarios = [];
    const saltRounds = 10;

    for (let i = 0; i < 51; i++) {
      const hashedPassword = await bcrypt.hash(faker.internet.password(12), saltRounds);
      usuarios.push({
        nombre: faker.name.firstName().slice(0, 15), // Máximo 15 caracteres
        correoElectronico: faker.internet.email(), // Email único generado por faker
        apellidos: faker.name.lastName().slice(0, 100), // Máximo 100 caracteres
        contraseña: hashedPassword, // Contraseña hasheada
        estaEliminado: faker.datatype.boolean(), // Booleano aleatorio
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return queryInterface.bulkInsert('Users', usuarios);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
