var express = require('express');
var path = require('path');
var router = express.Router();

var phongController = require('../controllers/phong');  

router.get('/trangchu',(req,res)=>{
    res.sendFile(path.join(__dirname,'../views/'+'thanh-vien-trang-chu-layout.html'));
});

router.get('/laydanhsachphong',(req,res)=>{
    phongController.layDanhSachPhongChiTiet(function(dsphong){
        res.send(dsphong);
    });
});

module.exports=router;