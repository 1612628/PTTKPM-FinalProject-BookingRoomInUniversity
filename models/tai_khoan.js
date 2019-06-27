'use strict';
module.exports = (sequelize, DataTypes) => {
  const tai_khoan = sequelize.define('tai_khoan', {
    ma_tai_khoan: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    ten_dang_nhap: DataTypes.STRING,
    mat_khau: DataTypes.STRING,
    ho_va_ten: DataTypes.STRING,
    cmnd: DataTypes.STRING,
    sdt: DataTypes.STRING,
    email: DataTypes.STRING
  }, {underscored: true});
  tai_khoan.associate = function(models) {
    // associations can be defined here
  };
  return tai_khoan;
};