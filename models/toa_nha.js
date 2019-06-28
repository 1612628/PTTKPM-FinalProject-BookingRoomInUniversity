'use strict';
module.exports = (sequelize, DataTypes) => {
  const toa_nha = sequelize.define('toa_nha', {
    ma_toa_nha: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    ten_toa_nha: DataTypes.STRING,
    thuoc_co_so: DataTypes.INTEGER
  }, {underscored: true});
  toa_nha.associate = function(models) {
    // associations can be defined here
    toa_nha.hasMany(models.phong_hoc_thuong,{foreignKey:'thuoc_toa_nha',sourceKey:'ma_toa_nha'})
    toa_nha.belongsTo(models.co_so,{foreignKey:'thuoc_co_so',targetKey:'ma_co_so'});
  };
  return toa_nha;
};