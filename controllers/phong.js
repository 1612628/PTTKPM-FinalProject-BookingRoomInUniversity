var controller={};
var db = require('../models/index');
var models = require('../models');

controller.layDanhSachPhongChiTiet=function(callback){
    db.sequelize.query("SELECT * from phongs join phong_hoc_thuongs on phongs.ma_phong=phong_hoc_thuongs.ma_phong_hoc_thuong"
    ,{type: db.sequelize.QueryTypes.SELECT})
    .then(phonghocthuong=>{
        callback(phonghocthuong);
    });
}

module.exports=controller;