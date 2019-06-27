'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('thiet_bis', {
      ma_thiet_bi: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ten_thiet_bi: {
        type: Sequelize.STRING
      },
      ngay_san_xuat: {
        type: Sequelize.DATEONLY
      },
      hang_san_xuat: {
        type: Sequelize.STRING
      },
      don_gia: {
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
    return queryInterface.dropTable('thiet_bis');
  }
};