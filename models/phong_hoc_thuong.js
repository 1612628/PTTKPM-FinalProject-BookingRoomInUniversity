'use strict';
module.exports = (sequelize, DataTypes) => {
  const phong_hoc_thuong = sequelize.define('phong_hoc_thuong', {
    ma_phong_hoc_thuong: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    mo_ta_phong: DataTypes.STRING,
    thuoc_toa_nha: DataTypes.INTEGER
  }, { underscored: true });
  phong_hoc_thuong.associate = function (models) {
    // associations can be defined here
    phong_hoc_thuong.belongsTo(models.toa_nha,{foreignKey:'thuoc_toa_nha',targetKey:'ma_toa_nha'});
    phong_hoc_thuong.belongsTo(models.phong,{foreignKey:'ma_phong_hoc_thuong',targetKey:'ma_phong'});
  };
  return phong_hoc_thuong;
};