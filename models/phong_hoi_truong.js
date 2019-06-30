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
    phong_hoi_truong.belongsTo(models.co_so, { foreignKey: 'thuoc_co_so', targetKey: 'ma_co_so' });
    phong_hoi_truong.belongsTo(models.phong, { foreignKey: 'ma_phong_hoi_truong', targetKey: 'ma_phong' });
  };
  return phong_hoi_truong;
};