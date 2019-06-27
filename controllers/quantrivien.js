var controller={};

var taikhoan = require('./taikhoan');
var models = require('../models');

controller.taoTaiKhoanQuanTriVien= function(taikhoan,callback){
    taikhoan.taoTaiKhoan(taikhoan,function(taikhoanmoi){
        if(taikhoanmoi!=null){
            var taikhoanquantri = {ma_quan_tri:taikhoanmoi.ma_tai_khoan,phong_ban:"HCMUS"}
            models.quan_tri_vien
            .create(taikhoanquantri)
            .then(quantrivienmoi=>{
                callback(quantrivienmoi);
            })
            .catch(err=>{
                callback(null);
            });
        }
    });
}
controller.dangNhap=function(req,res,next){

    models.quan_tri_vien
    .findOne({
        where:{ten_dang_nhap:req.body.tendangnhap},
        include:[{
            model:tai_khoan
        }]
    })
    .then(quantrivien =>{
        taikhoan.soSanhMatKhau(quantrivien.mat_khau,function(trungkhop){
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

var models = require('../models');