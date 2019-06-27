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
   return queryInterface.bulkInsert('tiet_hocs', [
     {gio_bat_dau:'7:00:00',
     gio_ket_thuc:'7:45:00',
     created_at:new Date(),
     updated_at:new Date()},
     {gio_bat_dau:'7:50:00',
     gio_ket_thuc:'8:35:00',
     created_at:new Date(),
     updated_at:new Date()},
     {gio_bat_dau:'8:40:00',
     gio_ket_thuc:'9:25:00',
     created_at:new Date(),
     updated_at:new Date()},
     {gio_bat_dau:'9:30:00',
     gio_ket_thuc:'10:15:00',
     created_at:new Date(),
     updated_at:new Date()},
     {gio_bat_dau:'10:20:00',
     gio_ket_thuc:'11:05:00',
     created_at:new Date(),
     updated_at:new Date()},
     {gio_bat_dau:'11:10:00',
     gio_ket_thuc:'11:55:00',
     created_at:new Date(),
     updated_at:new Date()},
     {gio_bat_dau:'12:30:00',
     gio_ket_thuc:'13:15:00',
     created_at:new Date(),
     updated_at:new Date()},
     {gio_bat_dau:'13:20:00',
     gio_ket_thuc:'14:05:00',
     created_at:new Date(),
     updated_at:new Date()},
     {gio_bat_dau:'14:10:00',
     gio_ket_thuc:'14:55:00',
     created_at:new Date(),
     updated_at:new Date()},
     {gio_bat_dau:'15:00:00',
     gio_ket_thuc:'15:45:00',
     created_at:new Date(),
     updated_at:new Date()},
     {gio_bat_dau:'15:50:00',
     gio_ket_thuc:'16:35:00',
     created_at:new Date(),
     updated_at:new Date()},
     {gio_bat_dau:'16:40:00',
     gio_ket_thuc:'17:25:00',
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
   return queryInterface.bulkDelete('tiet_hocs', null, {});
  }
};
