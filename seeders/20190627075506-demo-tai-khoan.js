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
    return queryInterface.bulkInsert('tai_khoans', [
      {
        ten_dang_nhap: "1",
        mat_khau: "$2y$10$YIJ8L7vmnqoYe3EMGjWf6.XGGorTAtM/a3L2HnyQ5bDodkhV5lz8.",
        ho_va_ten: "admin",
        cmnd: "123123123",
        sdt: "000000000",
        email: "admin@gmail.com",
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        ten_dang_nhap: "ndt",
        mat_khau: "$2y$10$Ix96Mu8Q.3IbVX9v3Ij4Ruk56G5cpCsJaBJGnPywsj1y52thgdsKa",
        ho_va_ten: "Nguyễn Duy Thanh",
        cmnd: "123123123",
        sdt: "000000000",
        email: "thanhnguyenduy2304@gmail.com",
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        ten_dang_nhap: "hmh",
        mat_khau: "$2y$10$Ix96Mu8Q.3IbVX9v3Ij4Ruk56G5cpCsJaBJGnPywsj1y52thgdsKa",
        ho_va_ten: "Hồ Minh Huấn",
        cmnd: "123123123",
        sdt: "000000000",
        email: "huan@gmail.com",
        created_at:new Date(),
        updated_at:new Date()
      },
      {
        ten_dang_nhap: "thn",
        mat_khau: "$2y$10$Ix96Mu8Q.3IbVX9v3Ij4Ruk56G5cpCsJaBJGnPywsj1y52thgdsKa",
        ho_va_ten: "Trần Hoài Nam",
        cmnd: "123123123",
        sdt: "000000000",
        email: "nam@gmail.com",
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
   return queryInterface.bulkDelete('tai_khoans', null, {});
  }
};