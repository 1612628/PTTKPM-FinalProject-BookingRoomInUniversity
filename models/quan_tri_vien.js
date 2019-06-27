'use strict';
module.exports = (sequelize, DataTypes) => {
  const quan_tri_vien = sequelize.define('quan_tri_vien', {
    ma_quan_tri: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    phong_ban: DataTypes.STRING
  }, {underscored: true});
  quan_tri_vien.associate = function(models) {
    // associations can be defined here
  };
  return quan_tri_vien;
};