var express = require('express');
var path = require('path');
var router = express.Router();
var nodemailer = require('nodemailer');
let async = require('async');

var phongController = require('../controllers/phong');
var coSoController = require('../controllers/coso');
var chiTietDatPhongController = require('../controllers/chitietdatphong');
var middleware = require('../controllers/middleware');


router.post('/dangnhap', middleware.checkUserAndCreateTokenKey, (req, res) => {
    res.send();
});

router.get('/trangchu', middleware.checkTokenKey, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/' + 'thanh-vien-trang-chu-layout.html'));
});

router.get('/laydanhsachphong', middleware.checkTokenKey, (req, res) => {
    var danhsachphong = [];

    phongController.layChiTietChuaDatPhongPhongHocThuong(function (dsphong) {

        if (dsphong) {
            for (var i = 0; i < dsphong.length;) {
                var thongtintungphong = {};
                thongtintungphong.ma_phong = dsphong[i].ma_phong;
                thongtintungphong.ten_phong = dsphong[i].ten_phong;
                thongtintungphong.tinh_trang = dsphong[i].mo_ta;
                thongtintungphong.mo_ta_phong = dsphong[i].mo_ta_phong;
                thongtintungphong.loai_phong = "Phòng học thường";
                thongtintungphong.thuoc_toa_nha = dsphong[i].ten_toa_nha;
                thongtintungphong.thuoc_co_so = dsphong[i].ten_co_so;

                var danhsachtiethoc = [];
                var currentpos = i;
                for (var j = 1; j <= 12; ++j) {
                    if (dsphong[currentpos].ma_tiet_hoc == j) {
                        danhsachtiethoc.push(dsphong[currentpos].ma_tiet_hoc);
                        ++currentpos;
                    } else {
                        danhsachtiethoc.push(0);
                    }
                }
                thongtintungphong.danhsachtiethoc = danhsachtiethoc;
                danhsachphong.push(thongtintungphong);
                i = currentpos;
            }
            phongController.layChiTietChuaDatPhongPhongHoiTruong(function (dsphong) {

                if (dsphong) {
                    for (var i = 0; i < dsphong.length;) {
                        var thongtintungphong = {};
                        thongtintungphong.ma_phong = dsphong[i].ma_phong;
                        thongtintungphong.ten_phong = dsphong[i].ten_phong;
                        thongtintungphong.tinh_trang = dsphong[i].mo_ta;
                        thongtintungphong.mo_ta_phong = dsphong[i].mo_ta_phong;
                        thongtintungphong.loai_phong = "Phòng hội trường";
                        thongtintungphong.thuoc_co_so = dsphong[i].ten_co_so;

                        var danhsachtiethoc = [];
                        var currentpos = i;
                        for (var j = 1; j <= 12; ++j) {
                            if (dsphong[currentpos].ma_tiet_hoc == j) {
                                danhsachtiethoc.push(dsphong[currentpos].ma_tiet_hoc);
                                ++currentpos;
                            } else {
                                danhsachtiethoc.push(0);
                            }
                        }
                        thongtintungphong.danhsachtiethoc = danhsachtiethoc;
                        danhsachphong.push(thongtintungphong);
                        i = currentpos;
                    }
                    danhsachphong = {
                        "danhsachphong": danhsachphong
                    };
                    res.send(danhsachphong);
                } else {
                    res.end();
                }
            });
        } else {
            res.status(404);
            res.end();
        }
    });



});

router.get('/laydanhsachtencoso', middleware.checkTokenKey, (req, res) => {
    coSoController.layDanhSachTenCoSo(function (coso) {
        res.send(coso);
    });
});

router.post('/timkiemdanhsachphong', middleware.checkTokenKey, (req, res) => {
    var danhsachphong = [];
    var coso = req.body.coso;
    var ngay = req.body.ngay;

    if (coso && ngay) {

        phongController.layChiTietChuaDatPhongPhongHocThuongTheoCoSoVaNgay(coso, ngay, function (dsphong) {
            if (dsphong) {

                for (var i = 0; i < dsphong.length;) {
                    var thongtintungphong = {};
                    thongtintungphong.ma_phong = dsphong[i].ma_phong;
                    thongtintungphong.ten_phong = dsphong[i].ten_phong;
                    thongtintungphong.tinh_trang = dsphong[i].mo_ta;
                    thongtintungphong.mo_ta_phong = dsphong[i].mo_ta_phong;
                    thongtintungphong.loai_phong = "Phòng học thường";
                    thongtintungphong.thuoc_toa_nha = dsphong[i].ten_toa_nha;
                    thongtintungphong.thuoc_co_so = dsphong[i].ten_co_so;

                    var danhsachtiethoc = [];
                    var currentpos = i;

                    for (var j = 1; j <= 12; ++j) {
                        if (dsphong[currentpos].ma_tiet_hoc == j) {
                            danhsachtiethoc.push(dsphong[currentpos].ma_tiet_hoc);
                            ++currentpos;
                        } else {
                            danhsachtiethoc.push(0);
                        }
                    }
                    thongtintungphong.danhsachtiethoc = danhsachtiethoc;
                    danhsachphong.push(thongtintungphong);
                    i = currentpos;
                }

                phongController.layChiTietChuaDatPhongPhongHoiTruongTheoCoSoVaNgay(coso, ngay, function (dsphong) {
                    if (dsphong) {
                        for (var i = 0; i < dsphong.length;) {
                            var thongtintungphong = {};
                            thongtintungphong.ma_phong = dsphong[i].ma_phong;
                            thongtintungphong.ten_phong = dsphong[i].ten_phong;
                            thongtintungphong.tinh_trang = dsphong[i].mo_ta;
                            thongtintungphong.mo_ta_phong = dsphong[i].mo_ta_phong;
                            thongtintungphong.loai_phong = "Phòng hội trường";
                            thongtintungphong.thuoc_co_so = dsphong[i].ten_co_so;

                            var danhsachtiethoc = [];
                            var currentpos = i;
                            for (var j = 1; j <= 12; ++j) {
                                if (dsphong[currentpos].ma_tiet_hoc == j) {
                                    danhsachtiethoc.push(dsphong[currentpos].ma_tiet_hoc);
                                    ++currentpos;
                                } else {
                                    danhsachtiethoc.push(0);
                                }
                            }
                            thongtintungphong.danhsachtiethoc = danhsachtiethoc;
                            danhsachphong.push(thongtintungphong);
                            i = currentpos;
                        }
                        danhsachphong = {
                            "danhsachphong": danhsachphong
                        };
                        res.send(danhsachphong);
                    } else {
                        res.end();
                    }
                });
            } else {
                res.status(404);
                res.end();
            }
        });

    }
});

router.post('/datphong', middleware.checkTokenKey, (req, res) => {
    var thanh_vien_dat = req.body.thanh_vien_dat;
    var phong_dat = req.body.phong_dat;
    var tiet_bat_dau = req.body.tiet_bat_dau;
    var tiet_ket_thuc = req.body.tiet_ket_thuc;
    var ngay_dat = req.body.ngay_dat;
    var tinh_trang = 1;
    var email = req.body.email;

    if (thanh_vien_dat && phong_dat && tiet_bat_dau && tiet_ket_thuc && ngay_dat && tinh_trang && email) {
        var thongtindatphong = {
            thanh_vien_dat: thanh_vien_dat,
            phong_dat: phong_dat,
            tiet_bat_dau: tiet_bat_dau,
            tiet_ket_thuc: tiet_ket_thuc,
            ngay_dat: ngay_dat,
            tinh_trang: tinh_trang
        };

        chiTietDatPhongController.datPhong(thongtindatphong, function (ctdat) {
            if (ctdat != null) {
                try {
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        secure: true,
                        auth: {
                            user: 'tltbushcmus@gmail.com',
                            pass: 'TLTbus123'
                        }
                    });
                    var mailOptions = {
                        from: `"HCMUS PORTAL" <tltbushcmus@gmail.com>`,
                        to: email,
                        subject: 'Thông đơn đặt phòng của bạn',
                        text: "Đơn hàng: " + ctdat.dataValues.ma_chi_tiet + ".\n" +
                            "Mã phòng đặt: " + phong_dat + "\n" +
                            "Tiết bắt đầu: " + tiet_bat_dau + "\n" +
                            "Tiết kết thúc: " + tiet_ket_thuc + "\n" +
                            "Ngày đặt: " + ngay_dat + "\n" +
                            "Bạn vui lòng đợi quản trị viên duyệt đơn hàng (tối đa là 2 ngày)"
                    };
                    
                    transporter.sendMail(mailOptions, function (err, info) {
                        if (err) {
                            console.log(err)
                        } else {                            
                            res.status(200);
                            res.json({
                                success: true,
                                message: 'Dat thanh cong'
                            });
                        }
                    });
                } catch (err) {
                    console.log(err);
                }

            } else {
                res.status(200);
                res.json({
                    success: false,
                    message: 'That bai'
                });
            }
        });

    }

});

router.get('/thongtincanhan', middleware.checkTokenKey, (req, res) => {

})

module.exports = router;