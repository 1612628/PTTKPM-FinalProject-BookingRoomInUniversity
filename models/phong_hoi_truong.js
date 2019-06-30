'use strict';
module.exports = (sequelize, DataTypes) => {
  const phong_hoi_truong = sequelize.define('phong_hoi_truong', {
    ma_phong_hoi_truong: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    mo_ta_hoi_truong: DataTypes.STRING,
    thuoc_co_so: DataTypes.INTEGER
  }, { underscored: true });
  phong_hoi_truong.associate = function (models) {
    // associations can be defined here
<<<<<<< HEAD
    phong_hoi_truong.belongsTo(models.co_so,{foreignKey:'thuoc_co_so',targetKey:'ma_co_so'});
    phong_hoi_truong.belongsTo(models.phong,{foreignKey:'ma_phong_hoi_truong',targetKey:'ma_phong'});
=======
    phong_hoi_truong.belongsTo(models.co_so, { foreignKey: 'thuoc_co_so', targetKey: 'ma_co_so' });
    phong_hoi_truong.belongsTo(models.phong, { foreignKey: 'ma_phong_hoi_truong', targetKey: 'ma_phong' });
>>>>>>> 2f32e47724992c7f559f52d7c2271a3adaf9e749
  };
  return phong_hoi_truong;
};