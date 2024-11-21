const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usuarios = [];
    const saltRounds = 10;

    for (let i = 0; i < 51; i++) {
      const hashedPassword = await bcrypt.hash(faker.internet.password(12), saltRounds);
      usuarios.push({
        id: uuidv4(),
        nombre: faker.name.firstName().slice(0, 15),
        correoElectronico: faker.internet.email(),
        apellidos: faker.name.lastName().slice(0, 100),
        contraseña: hashedPassword,
        estaEliminado: faker.datatype.boolean(),
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
