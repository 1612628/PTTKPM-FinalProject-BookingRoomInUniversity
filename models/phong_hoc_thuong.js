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
<<<<<<< HEAD
    phong_hoc_thuong.belongsTo(models.toa_nha,{foreignKey:'thuoc_toa_nha',targetKey:'ma_toa_nha'});
    phong_hoc_thuong.belongsTo(models.phong,{foreignKey:'ma_phong_hoc_thuong',targetKey:'ma_phong'});
=======
    phong_hoc_thuong.belongsTo(models.toa_nha, { foreignKey: 'thuoc_toa_nha', targetKey: 'ma_toa_nha' });
    phong_hoc_thuong.belongsTo(models.phong, { foreignKey: 'ma_phong_hoc_thuong', targetKey: 'ma_phong' });
>>>>>>> 2f32e47724992c7f559f52d7c2271a3adaf9e749
  };
  return phong_hoc_thuong;
};