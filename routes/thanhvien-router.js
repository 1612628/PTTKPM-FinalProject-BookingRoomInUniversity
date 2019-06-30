var express = require('express');
var path = require('path');
var router = express.Router();
var nodemailer = require('nodemailer');


var phongController = require('../controllers/phong');
var coSoController = require('../controllers/coso');
var chiTietDatPhongController = require('../controllers/chitietdatphong');
var middleware = require('../controllers/middleware');


// ----------------------------------Services--------------------------------//
const mailer = require('../src/services/mailer');

const Mailer=new mailer.NodeMailerBuilder("HCMUS PORTAL");
// ----------------------------------Models--------------------------------//
const models =require('../models');
const {
    co_so,
    chi_tiet_dat_phong
}=models;

const db = require('../models/index');
const {sequelize}=db;

// ----------------------------------Repo--------------------------------//
const {SequelizeRoomRepo} = require('../src/repos/room-repo');
const {SequelizeCampusRepo} = require('../src/repos/campus-repo');

const RoomRepo=new SequelizeRoomRepo(db,models);
const CampusRepo = new SequelizeCampusRepo(models);
// ----------------------------------Repo--------------------------------//


router.post('/dangnhap', middleware.checkUserAndCreateTokenKey, (req, res) => {
    res.send();
});

router.get('/trangchu', middleware.checkTokenKey, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/' + 'thanh-vien-trang-chu-layout.html'));
});

router.get('/laydanhsachphong', middleware.checkTokenKey, (req, res) => {
    var danhsachphong = [];

    RoomRepo.getFullNormalRoomUnBookedList()
    .then(dsphong=>{
        if(dsphong){
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
            return RoomRepo.getFullHallUnBookedList();
        }else{
            res.status(404);
            res.end();
        }
    })
    .then(dsphong=>{
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
});

router.get('/laydanhsachtencoso', middleware.checkTokenKey, (req, res) => {
    CampusRepo.getAllCampuses()
    .then(campuses=>{
        res.send(campuses);
    });
});

router.post('/timkiemdanhsachphong', middleware.checkTokenKey, (req, res) => {
    var danhsachphong = [];
    var coso = req.body.coso;
    var ngay = req.body.ngay;

    if (coso && ngay) {

        RoomRepo.getFullNormalRoomUnBookedWithSpecificCampusAndDateList(coso,ngay)
        .then(dsphong=>{
            if(dsphong){
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
                return RoomRepo.getFullHallUnBookedWithSpecificCampusAndDateList(coso,ngay);
            }else{
                res.status(404);
                res.end();
            }
        })
        .then(dsphong=>{
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

        RoomRepo.bookRoom(thongtindatphong)
        .then(ctdat=>{
            if (ctdat != null) {
                Mailer.buildNewBooking(mailer.MAIL_PROVIDERS.GMAIL).send(email,
                    {bookingId:ctdat.dataValues.ma_chi_tiet,
                        roomId:phong_dat,
                        startId:tiet_bat_dau,
                        endId:tiet_ket_thuc,
                        bookingDate:ngay_dat})
                    .then(info=>{
                        if(info){
                            res.status(200);
                            res.json({
                                success:true,
                                message:'Đặt phòng thành công'
                            })
                        }
                    })
            } else {
                res.status(200);
                res.json({
                    success: false,
                    message: 'That bai'
                });
            }
        })
        .catch(err=>{
            res.status(200);
                res.json({
                    success: false,
                    message: 'That bai'
            });
        });
    }

});

router.get('/thongtincanhan', middleware.checkTokenKey, (req, res) => {
    res.sendFile(path.join(__dirname,'../views/'+'thanh-vien-thong-tin-ca-nhan.html'));
});

module.exports = router;