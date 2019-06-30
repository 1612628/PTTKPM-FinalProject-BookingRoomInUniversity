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
    return queryInterface.bulkInsert('thanh_viens', [
      {
        ma_thanh_vien: 2, diem_ca_nhan: 20,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        ma_thanh_vien: 3, diem_ca_nhan: 20,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        ma_thanh_vien: 4, diem_ca_nhan: 20,
        created_at: new Date(),
        updated_at: new Date(),
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
