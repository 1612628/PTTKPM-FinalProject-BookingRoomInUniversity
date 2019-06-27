'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('phong_hoc_thuongs', {
      ma_phong_hoc_thuong: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mo_ta_phong: {
        type: Sequelize.STRING
      },
      thuoc_toa_nha:{
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('phong_hoc_thuongs');
  }
};