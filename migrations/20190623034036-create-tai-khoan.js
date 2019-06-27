'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tai_khoans', {
      ma_tai_khoan: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      ten_dang_nhap: {
        type: Sequelize.STRING
      },
      mat_khau: {
        type: Sequelize.STRING
      },
      ho_va_ten: {
        type: Sequelize.STRING
      },
      cmnd: {
        type: Sequelize.STRING
      },
      sdt: {
        type: Sequelize.STRING
      },
      email: {
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
    return queryInterface.dropTable('tai_khoans');
  }
};