'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('quan_ly_thiet_bis', {
      thiet_bi_quan_ly: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      phong_quan_ly: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      content: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('quan_ly_thiet_bis');
  }
};