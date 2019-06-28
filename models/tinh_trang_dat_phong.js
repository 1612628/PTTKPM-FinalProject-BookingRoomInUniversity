'use strict';
module.exports = (sequelize, DataTypes) => {
  const tinh_trang_dat_phong = sequelize.define('tinh_trang_dat_phong', {
    ma_tinh_trang_dat_phong: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    mo_ta: DataTypes.STRING
  }, {underscored: true});
  tinh_trang_dat_phong.associate = function(models) {
    // associations can be defined here
    
  };
  return tinh_trang_dat_phong;
};