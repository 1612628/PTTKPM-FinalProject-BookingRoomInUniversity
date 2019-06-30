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
    return queryInterface.bulkInsert('phong_hoi_truongs', [{
        ma_phong_hoi_truong: 8,
        thuoc_co_so: 1,
        phong_ma_phong:8,
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        ma_phong_hoi_truong: 9,
        thuoc_co_so: 1,
        phong_ma_phong:9,
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        ma_phong_hoi_truong: 10,
        thuoc_co_so: 2,
        phong_ma_phong:10,
        created_at:new Date(),
        updated_at:new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};