'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('quan_tri_viens', {
      ma_quan_tri: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      phong_ban:{
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
    return queryInterface.dropTable('quan_tri_viens');
  }
};