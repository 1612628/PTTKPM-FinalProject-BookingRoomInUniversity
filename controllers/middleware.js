let jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config=require('../config/config.json');
var models = require('../models');

function getToken(cname, cookie) {
    var name = cname + "=";
    var ca = cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

let checkTokenKey = (req, res, next) => {
    let cookie = req.headers.cookie;
    if (cookie) {
        let token = getToken("token", cookie);
        if (token) {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    return res.redirect('/');
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return  res.redirect('/');
        }
    } else {
        return res.redirect('/');
    }
};

let checkUserAndCreateTokenKey = (req, res, next) => {
    let tendangnhap = req.body.tendangnhap;
    let matkhau = req.body.matkhau;
    console.log(tendangnhap,matkhau)

    if (tendangnhap && matkhau) {
        models.thanh_vien.findOne({
                where:{
                    '$tai_khoan.ten_dang_nhap$':tendangnhap
                },
                include: [{
                    model:models.tai_khoan,
                    as:'tai_khoan'
                    }]
            })
            .then(async (thanhvien) => {
                await bcrypt.genSalt(10);
                console.log(thanhvien);
                await bcrypt.compare(matkhau, thanhvien.tai_khoan.dataValues.mat_khau, function (err, success) {
                    if (success == true) {
                        let token = jwt.sign({
                                tendangnhap: tendangnhap
                            },
                            config.secret, {
                                expiresIn: '24h'
                            });

                        res.status(200);
                        res.json({
                            success: true,
                            token: token,
                            thanhvien: thanhvien
                        });
                        next();
                    } else {
                        res.status(200);
                        res.json({
                            success: false,
                            message: 'Invalid password'
                        });
                    }
                });
            })
            .catch(err => {
                res.status(200);
                res.json({
                    success: false,
                    message: 'Invalid username'
                });
                next();
            });
    }
};


module.exports = {
    checkTokenKey: checkTokenKey,
    checkUserAndCreateTokenKey: checkUserAndCreateTokenKey
}