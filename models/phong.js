'use strict';
module.exports = (sequelize, DataTypes) => {
  const phong = sequelize.define('phong', {
    ma_phong: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    ten_phong: DataTypes.STRING,
    mo_ta_phong: DataTypes.STRING,
    tinh_trang: DataTypes.INTEGER,
    diem_phong: DataTypes.INTEGER
  }, {underscored: true});
  phong.associate = function(models) {
    // associations can be defined here
    phong.hasMany(models.chi_tiet_dat_phong,{foreignKey:'phong_dat',sourceKey:'ma_phong'});
    phong.hasMany(models.quan_ly_thiet_bi,{foreignKey:'phong_quan_ly',sourceKey:'ma_phong'});
    phong.belongsTo(models.tinh_trang_phong,{foreignKey:'tinh_trang',targetKey:'ma_tinh_trang_phong'});
  };
  return phong;
};