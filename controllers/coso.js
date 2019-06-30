var controller={};

var models = require('../models');

controller.layDanhSachTenCoSo=function(callback){
    models.co_so.findAll()
    .then(coso=>{
        callback(coso);
    });
}

module.exports=controller;