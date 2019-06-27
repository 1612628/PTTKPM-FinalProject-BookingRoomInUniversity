var controller={}

var models = require('../models');
var bcrypt = require('bcryptjs');

var authen = require('./authentication');

controller.taoTaiKhoan = function(taikhoan,callback){
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(taikhoan.mat_khau,salt,function(err,hash){
            taikhoan.mat_khau=hash;
            models.tai_khoan
            .create(taikhoan)
            .then(function(taikhoanmoi){
                callback(taikhoanmoi);
            })
            .catch(err=>{
                callback(null);
            })
        });
    });
};

controller.layTenDangNhap=function(tenDangNhap,callback){
    models.tai_khoan
    .findOne({
        where:{ten_dang_nhap:tenDangNhap}
    })
    .then(function(taikhoan){
        callback(taikhoan);
    })
    .catch(function(err){
        if(err) throw err;
        callback(null);
    });
};

controller.soSanhMatKhau = function(matkhau,matkhauhash,callback){
    bcrypt.compare(matkhau,matkhauhash,function(err,trungKhop){
        if(err) throw err;
        callback(trungKhop);
    });
};

controller.layTaiKhoanTheoMa=function(ma,callback){
    models.tai_khoan
    .findOne({
        where:{ma_tai_khoan:ma}
    })
    .then(function(taikhoan){
        callback(false,taikhoan);
    });
};

controller.daDangNhap=function(req,res,next){
    var token=authen.getTokenFromCookie('token',req.headers.cookie);
    if(authen.checkTokenKey(token)){
        next();
    }else{
        res.redirect(`/taikhoan/dangnhap?
        returnURL=${req.originalUrl}`);
    }
};


module.exports=controller;