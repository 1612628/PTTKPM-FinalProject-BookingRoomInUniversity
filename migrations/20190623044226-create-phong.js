'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('phongs', {
      ma_phong: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      ten_phong: {
        type: Sequelize.STRING
      },
      mo_ta_phong: {
        type: Sequelize.STRING
      },
      tinh_trang: {
        type: Sequelize.INTEGER
      },
      diem_phong: {
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
    return queryInterface.dropTable('phongs');
  }
};