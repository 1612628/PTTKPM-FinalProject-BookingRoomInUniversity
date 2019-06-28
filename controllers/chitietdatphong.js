var controller={};

var models = require('../models');

controller.datPhong=function(thongtindat,callback){
    models.chi_tiet_dat_phong
    .create(thongtindat)
    .then(ctdat=>{
        callback(ctdat);
    })
    .catch(err=>{
        callback(null);
    });
};

module.exports=controller;