'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('chi_tiet_dat_phongs', [{
      thanh_vien_dat: 2,
      phong_dat: 1,
      tiet_bat_dau: 4,
      tiet_ket_thuc: 7,
      ngay_dat: new Date(),
      tinh_trang: 1,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('chi_tiet_dat_phongs', null, {});
  }
};