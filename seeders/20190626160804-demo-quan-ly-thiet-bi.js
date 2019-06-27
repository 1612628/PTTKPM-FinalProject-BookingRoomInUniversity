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
    return queryInterface.bulkInsert('quan_ly_thiet_bis', [{
        thiet_bi_quan_ly: 1,
        phong_quan_ly: 1,
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        thiet_bi_quan_ly: 2,
        phong_quan_ly: 2,
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        thiet_bi_quan_ly: 3,
        phong_quan_ly: 3,
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        thiet_bi_quan_ly: 4,
        phong_quan_ly: 4,
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        thiet_bi_quan_ly: 5,
        phong_quan_ly: 5,
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        thiet_bi_quan_ly: 6,
        phong_quan_ly: 6,
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        thiet_bi_quan_ly: 7,
        phong_quan_ly: 7,
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        thiet_bi_quan_ly: 8,
        phong_quan_ly: 8,
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        thiet_bi_quan_ly: 9,
        phong_quan_ly: 9,
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        thiet_bi_quan_ly: 10,
        phong_quan_ly: 10,
        created_at:new Date(),
        updated_at:new Date()
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bulkDelete('quan_ly_thiet_bis', null, {});
  }
};