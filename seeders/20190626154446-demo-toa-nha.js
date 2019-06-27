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
   return queryInterface.bulkInsert('toa_nhas', [
     {ten_toa_nha:"Tòa nhà A",
     thuoc_co_so:1,
     created_at:new Date(),
     updated_at:new Date()},
     {ten_toa_nha:"Tòa nhà B",
     thuoc_co_so:1,
     created_at:new Date(),
     updated_at:new Date()},
     {ten_toa_nha:"Tòa nhà C",
     thuoc_co_so:1,
     created_at:new Date(),
     updated_at:new Date()},
     {ten_toa_nha:"Tòa nhà D",
     thuoc_co_so:1,
     created_at:new Date(),
     updated_at:new Date()},
     {ten_toa_nha:"Tòa nhà A",
     thuoc_co_so:2,
     created_at:new Date(),
     updated_at:new Date()},
     {ten_toa_nha:"Tòa nhà B",
     thuoc_co_so:2,
     created_at:new Date(),
     updated_at:new Date()},
     {ten_toa_nha:"Tòa nhà C",
     thuoc_co_so:2,
     created_at:new Date(),
     updated_at:new Date()},
     {ten_toa_nha:"Tòa nhà D",
     thuoc_co_so:2,
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
    */return queryInterface.bulkDelete('toa_nhas', null, {});
  }
};
