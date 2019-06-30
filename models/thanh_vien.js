'use strict';
module.exports = (sequelize, DataTypes) => {
  const thanh_vien = sequelize.define('thanh_vien', {
    ma_thanh_vien: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    diem_ca_nhan: DataTypes.INTEGER
  }, {underscored: true});
  thanh_vien.associate = function(models) {
    // associations can be defined here
    thanh_vien.hasMany(models.chi_tiet_dat_phong,{foreignKey:'thanh_vien_dat',sourceKey:'ma_thanh_vien'});
    thanh_vien.belongsTo(models.tai_khoan,{foreignKey:'ma_thanh_vien',targetKey:'ma_tai_khoan'});
  };
  return thanh_vien;
};