'use strict';
module.exports = (sequelize, DataTypes) => {
  const thiet_bi = sequelize.define('thiet_bi', {
    ma_thiet_bi: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    ten_thiet_bi: DataTypes.STRING,
    ngay_san_xuat: DataTypes.DATEONLY,
    hang_san_xuat: DataTypes.STRING,
    don_gia: DataTypes.INTEGER
  }, {underscored: true});
  thiet_bi.associate = function(models) {
    // associations can be defined here
  };
  return thiet_bi;
};