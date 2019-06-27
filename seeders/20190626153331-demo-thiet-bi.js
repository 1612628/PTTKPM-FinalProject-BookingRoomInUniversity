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
   return queryInterface.bulkInsert('thiet_bis',[
     {ten_thiet_bi:"Máy chiếu Toshiba",
    ngay_san_xuat: new Date(),
    hang_san_xuat:"Toshiba",
    don_gia:1200000,
    created_at:new Date(),
    updated_at:new Date()},
    {ten_thiet_bi:"Máy chiếu Toshiba",
    ngay_san_xuat: new Date(),
    hang_san_xuat:"Toshiba",
    don_gia:1200000,
    created_at:new Date(),
    updated_at:new Date()},
    {ten_thiet_bi:"Máy chiếu Toshiba",
    ngay_san_xuat: new Date(),
    hang_san_xuat:"Toshiba",
    don_gia:1200000,
    created_at:new Date(),
    updated_at:new Date()},
    {ten_thiet_bi:"Máy chiếu Sony",
    ngay_san_xuat: new Date(),
    hang_san_xuat:"Sony",
    don_gia:1200000,
    created_at:new Date(),
    updated_at:new Date()},
    {ten_thiet_bi:"Máy chiếu Sony",
    ngay_san_xuat: new Date(),
    hang_san_xuat:"Sony",
    don_gia:1200000,
    created_at:new Date(),
    updated_at:new Date()},
    {ten_thiet_bi:"Máy chiếu Sony",
    ngay_san_xuat: new Date(),
    hang_san_xuat:"Sony",
    don_gia:1200000,
    created_at:new Date(),
    updated_at:new Date()},
    {ten_thiet_bi:"Máy chiếu Panasonic",
    ngay_san_xuat: new Date(),
    hang_san_xuat:"Panasonic",
    don_gia:1200000,
    created_at:new Date(),
    updated_at:new Date()},
    {ten_thiet_bi:"Máy chiếu Panasonic",
    ngay_san_xuat: new Date(),
    hang_san_xuat:"Panasonic",
    don_gia:1200000,
    created_at:new Date(),
    updated_at:new Date()},
    {ten_thiet_bi:"Máy chiếu Panasonic",
    ngay_san_xuat: new Date(),
    hang_san_xuat:"Panasonic",
    don_gia:1200000,
    created_at:new Date(),
    updated_at:new Date()},
    {ten_thiet_bi:"Máy chiếu Panasonic",
    ngay_san_xuat: new Date(),
    hang_san_xuat:"Panasonic",
    don_gia:1200000,
    created_at:new Date(),
    updated_at:new Date()}
  ],{});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
   return queryInterface.bilkDelete('thiet_bis',null,{});
  }
};
