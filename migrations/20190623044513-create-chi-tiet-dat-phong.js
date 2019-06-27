'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('chi_tiet_dat_phongs', {
      ma_chi_tiet: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      thanh_vien_dat:{
        type: Sequelize.INTEGER
      },
      phong_dat:{
        type: Sequelize.INTEGER
      },
      tiet_hoc_dat:{
        type: Sequelize.INTEGER
      },
      ngay_dat:{
        type: Sequelize.DATE
      },
      tinh_trang: {
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
    return queryInterface.dropTable('chi_tiet_dat_phongs');
  }
};