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
    return queryInterface.bulkInsert('phongs', [{
        ten_phong: "1",
        mo_ta_phong: "",
        tinh_trang: "Tốt",
        diem_phong: 10,
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        ten_phong: "2",
        mo_ta_phong: "",
        tinh_trang: "Tốt",
        diem_phong: 10,
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        ten_phong: "3",
        mo_ta_phong: "",
        tinh_trang: "Tốt",
        diem_phong: 10,
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        ten_phong: "4",
        mo_ta_phong: "",
        tinh_trang: "Tốt",
        diem_phong: 10,
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        ten_phong: "5",
        mo_ta_phong: "",
        tinh_trang: "Tốt",
        diem_phong: 10,
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        ten_phong: "6",
        mo_ta_phong: "",
        tinh_trang: "Tốt",
        diem_phong: 10,
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        ten_phong: "7",
        mo_ta_phong: "",
        tinh_trang: "Tốt",
        diem_phong: 10,
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        ten_phong: "8",
        mo_ta_phong: "",
        tinh_trang: "Tốt",
        diem_phong: 15,
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        ten_phong: "9",
        mo_ta_phong: "",
        tinh_trang: "Tốt",
        diem_phong: 15,
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        ten_phong: "10",
        mo_ta_phong: "",
        tinh_trang: "Tốt",
        diem_phong: 15,
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
  }
};