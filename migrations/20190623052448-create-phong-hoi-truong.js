'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('phong_hoi_truongs', {
      ma_phong_hoi_truong: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mo_ta_hoi_truong: {
        type: Sequelize.STRING
      },
      thuoc_co_so:{
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
    return queryInterface.dropTable('phong_hoi_truongs');
  }
};