var express = require('express');
var path = require('path');
var router = express.Router();

var QuanTriVienController = require('../controllers/quantrivien');


router.post('/dummyCreateAdmin',(req,res)=>{
    var taikhoanquantri={ten_dang_nhap:"1",mat_khau:"1",ho_va_ten:"admin"}
    QuanTriVienController.taoTaiKhoanQuanTriVien(req.body)
});

module.exports=router;