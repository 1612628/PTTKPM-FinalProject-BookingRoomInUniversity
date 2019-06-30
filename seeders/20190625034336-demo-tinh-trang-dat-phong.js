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
   return queryInterface.bulkInsert('tinh_trang_dat_phongs', [
     {mo_ta:"Đang chờ duyệt",
     created_at:new Date(),
     updated_at:new Date()},
     {mo_ta:"Đã duyệt",
     created_at:new Date(),
     updated_at:new Date()},
     {mo_ta:"Hủy",
     created_at:new Date(),
     updated_at:new Date()},
   ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('tinh_trang_dat_phongs', null, {});
  }
};
