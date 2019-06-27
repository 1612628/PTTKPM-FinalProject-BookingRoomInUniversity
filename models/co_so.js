'use strict';
module.exports = (sequelize, DataTypes) => {
  const co_so = sequelize.define('co_so', {
    ma_co_so: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    ten_co_so: DataTypes.STRING
  }, {underscored: true});
  co_so.associate = function(models) {
    // associations can be defined here
    co_so.hasMany(models.phong_hoi_truong,{foreignKey:'thuoc_co_so',sourceKey:'ma_co_so'});
    co_so.hasMany(models.toa_nha,{foreignKey:'thuoc_co_so',sourceKey:'ma_co_so'});
  };
  return co_so;
};