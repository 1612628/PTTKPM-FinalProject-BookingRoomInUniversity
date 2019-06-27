'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('thanh_viens', {
      ma_thanh_vien: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      diem_ca_nhan: {
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
    return queryInterface.dropTable('thanh_viens');
  }
};