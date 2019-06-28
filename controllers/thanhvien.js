var controller ={};

var models = require('../models');
var taikhoanController = require('./taikhoan');

controller.taoTaiKhoanThanhVien = function(taikhoan,diemcanhan,callback){
    taikhoanController.taoTaiKhoan(taikhoan,function(taikhoanmoi){
        if(taikhoanmoi!=null){
            var taikhoanthanhvien = {ma_thanh_vien:taikhoanmoi.ma_tai_khoan,diem_ca_nhan:diemcanhan}
            models.thanh_vien
            .create(taikhoanthanhvien)
            .then(thanhvienmoi=>{
                callback(thanhvienmoi);
            })
            .catch(err=>{
                callback(null);
            });
        }
    });
}
controller.dangNhap=function(req,res,next){

    models.thanh_vien
    .findOne({
        where:{ten_dang_nhap:req.body.tendangnhap},
        include:[{
            model:tai_khoan
        }]
    })
    .then(thanhvien =>{
        taikhoan.soSanhMatKhau(thanhvien.mat_khau,function(trungkhop){
            if(trungkhop){
                next();
            }
            res.status(403).json({
                success: false,
                message: 'Mat khau khong chinh xac'
            });
        });
    })
    .catch(function(err){
        res.status(403).json({
            success: false,
            message: 'Ten dang nhap khong chinh xac'
        });
    });
};

module.exports=controller;