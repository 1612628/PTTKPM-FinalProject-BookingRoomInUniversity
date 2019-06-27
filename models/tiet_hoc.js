'use strict';
module.exports = (sequelize, DataTypes) => {
  const tiet_hoc = sequelize.define('tiet_hoc', {
    ma_tiet_hoc: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    gio_bat_dau: 'time without time zone',
    gio_ket_thuc: 'time without time zone'
  }, {underscored: true});
  tiet_hoc.associate = function(models) {
    // associations can be defined here
  };
  return tiet_hoc;
};