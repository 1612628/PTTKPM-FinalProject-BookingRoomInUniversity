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
    return queryInterface.bulkInsert('phong_hoc_thuongs', [{
        ma_phong_hoc_thuong: 1,
        mo_ta_phong: "",
        thuoc_toa_nha: 1,
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        ma_phong_hoc_thuong: 2,
        mo_ta_phong: "",
        thuoc_toa_nha: 2,
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        ma_phong_hoc_thuong: 3,
        mo_ta_phong: "",
        thuoc_toa_nha: 3,
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        ma_phong_hoc_thuong: 4,
        mo_ta_phong: "",
        thuoc_toa_nha: 4,
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        ma_phong_hoc_thuong: 5,
        mo_ta_phong: "",
        thuoc_toa_nha: 5,
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        ma_phong_hoc_thuong: 6,
        mo_ta_phong: "",
        thuoc_toa_nha: 7,
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        ma_phong_hoc_thuong: 7,
        mo_ta_phong: "",
        thuoc_toa_nha: 8,
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
   return queryInterface.bulkDelete('phong_hoc_thuongs', null, {});
  }
};