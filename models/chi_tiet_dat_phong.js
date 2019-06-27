'use strict';
module.exports = (sequelize, DataTypes) => {
  const chi_tiet_dat_phong = sequelize.define('chi_tiet_dat_phong', {
    ma_chi_tiet: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    thanh_vien_dat: DataTypes.INTEGER,
    phong_dat: DataTypes.INTEGER,
    tiet_hoc_dat: DataTypes.INTEGER,
    ngay_dat: DataTypes.DATE,
    tinh_trang: DataTypes.STRING
  }, {underscored: true});
  chi_tiet_dat_phong.associate = function(models) {
    // associations can be defined here
    chi_tiet_dat_phong.belongsTo(models.thanh_vien,{foreignKey:'thanh_vien_dat',targetKey:'ma_thanh_vien'});
    chi_tiet_dat_phong.belongsTo(models.phong,{foreignKey:'phong_dat',targetKey:'ma_phong'});
    chi_tiet_dat_phong.belongsTo(models.tiet_hoc,{foreignKey:'tiet_hoc_dat',targetKey:'ma_tiet_hoc'});
  };
  return chi_tiet_dat_phong;
};