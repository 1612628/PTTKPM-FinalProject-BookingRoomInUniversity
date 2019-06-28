'use strict';
module.exports = (sequelize, DataTypes) => {
  const quan_ly_thiet_bi = sequelize.define('quan_ly_thiet_bi', {
    thiet_bi_quan_ly: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    phong_quan_ly: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
  }, {underscored: true});
  quan_ly_thiet_bi.associate = function(models) {
    // associations can be defined here
    quan_ly_thiet_bi.belongsTo(models.phong,{foreignKey:'phong_quan_ly',targetKey:'ma_phong'});
    quan_ly_thiet_bi.belongsTo(models.thiet_bi,{foreignKey:'thiet_bi_quan_ly',targetKey:'ma_thiet_bi'});
  };
  return quan_ly_thiet_bi;
};