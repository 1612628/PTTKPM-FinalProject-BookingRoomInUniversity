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
   return queryInterface.bulkInsert('co_sos',[
     {ten_co_so:"Nguyễn  Văn Cừ",
     created_at:new Date(),
     updated_at:new Date()},
     {ten_co_so:"Linh Trung",
     created_at:new Date(),
     updated_at:new Date()},
   ],{});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('co_sos');
  }
};
