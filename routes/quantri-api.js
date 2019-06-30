const express = require("express");
const bcrypt = require('bcryptjs')
const router = express.Router();

const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY || 'wtf'
const tokenName = 'NIGAMON_JWT_TOKEN'

const LIMIT = 5;

const models = require('../models')
const {
    Sequelize,
    tai_khoan, quan_tri_vien, thanh_vien,
    thiet_bi, quan_ly_thiet_bi,
    tinh_trang_phong, phong, phong_hoi_truong, phong_hoc_thuong,
    toa_nha, co_so,
    chi_tiet_dat_phong, tiet_hoc, tinh_trang_dat_phong
} = models
const Op = Sequelize.Op

//------------------------------- Repos ----------------------------------------//
const { SequelizeAdminRepo } = require('../src/repos/admin-repo')
const { SequelizeMemberRepo } = require('../src/repos/member-repo')
const { SequelizeDeviceRepo } = require('../src/repos/device-repo')
const AdminRepo = new SequelizeAdminRepo(models)
const MemberRepo = new SequelizeMemberRepo(models)
const DeviceRepo = new SequelizeDeviceRepo(models)

//---------------------------------- jwt middleware ------------------------------------//
const adminJwtMiddleware = (req, res, next) => {
    if (req.headers.authorization) {
        jwt.verify(req.headers.authorization.slice(7), secretKey, (err, decoded) => {
            if (err) {
                res.status(401).send('Unauthorized Access')
            } else {
                jwt.sign({
                    username: decoded.username,
                    fullname: decoded.fullname,
                    cmnd: decoded.cmnd,
                    phone: decoded.phone,
                    email: decoded.email
                }, secretKey, {
                        expiresIn: "2h"
                    }, (err, token) => {
                        if (err) {
                            res.status(500).send('Something is broken')
                        } else {
                            res.set(tokenName, token)
                            res.status(200)
                            next()
                        }
                    })
            }
        })
    } else {
        res.status(401).send('Unauthorized Access')
    }
}

//---------------------------------------- login -----------------------------------------------//
// router.post('/login', (req, res) => {
//     tai_khoan.findOne({ where: { ten_dang_nhap: req.body.username } })
//         .then(user => {
//             return quan_tri_vien.findByPk(user.id)
//                 .then(admin => user)
//                 .catch(err => {
//                     res.json({ isLogin: false })
//                 })
//         })
//         .then(user => {
//             bcrypt.compare(req.body.password, user.mat_khau, (err, bcryptRes) => {
//                 if (err) {
//                     return res.json({ isLogin: false })
//                 }
//                 jwt.sign({
//                     username: user.ten_dang_nhap,
//                     fullname: user.ho_va_ten,
//                     cmnd: user.cmnd,
//                     phone: user.sdt,
//                     email: user.email
//                 }, secretKey, {
//                         expiresIn: "2h"
//                     }, (err, token) => {
//                         if (err) {
//                             res.status(500).send('Something is broken')
//                         } else {
//                             res.json({
//                                 isLogin: true,
//                                 token: token,
//                                 userInfo: {
//                                     username: user.ten_dang_nhap,
//                                     fullname: user.ho_va_ten,
//                                     cmnd: user.cmnd,
//                                     phone: user.sdt,
//                                     email: user.email
//                                 }
//                             })
//                         }
//                     })
//             })
//         })
//         .catch(() => res.json({ isLogin: false }))
// })
// router.get('/login', adminJwtMiddleware, (req, res) => {
//     const decoded = jwt.decode(req.headers.authorization.slice(7))
//     res.json({
//         isLogin: true,
//         userInfo: {
//             username: decoded.username,
//             fullname: decoded.fullname,
//             cmnd: decoded.cmnd,
//             phone: decoded.phone,
//             email: decoded.email
//         }
//     })
// })

//------------------------------------ rooms ---------------------------------------------//
// dependencies
router.get('/campus', adminJwtMiddleware, (req, res) => {
    co_so.findAndCountAll({
    }).then(result => {
        const campus = (result.rows.map(r => r.dataValues).map(r => ({
            id: r.ma_co_so,
            label: r.ten_co_so
        })))
        res.json({
            choices: campus
        })
    }).catch(err => {
        console.log(err)
        res.status(500).send('GET Campus Error')
    })
})
router.get('/buildings', adminJwtMiddleware, (req, res) => {
    const campusid = parseInt(req.query.campus || 0)
    if (campusid) {
        co_so.findByPk(campusid)
            .then(campus => toa_nha.findAndCountAll({
                where: { thuoc_co_so: campus.ma_co_so }
            })).then(result => {
                const buildings = (result.rows.map(r => r.dataValues).map(r => ({
                    id: r.ma_toa_nha,
                    label: r.ten_toa_nha
                })))
                res.json({
                    choices: buildings
                })
            }).catch(err => {
                console.log(err)
                res.status(500).send('GET Buildings Error')
            })
    } else {
        toa_nha.findAndCountAll({
        }).then(result => result.rows.map(r => r.dataValues).map(r => ({
            id: r.ma_toa_nha,
            label: r.ten_toa_nha
        }))).then(buildings => {
            res.json({
                choices: buildings
            })
        }).catch(err => {
            console.log(err)
            res.status(500).send('GET Buildings Error')
        })
    }
})
router.get('/rooms/status', adminJwtMiddleware, (req, res) => {
    tinh_trang_phong.findAndCountAll({
    }).then(result => {
        const status = (result.rows.map(r => r.dataValues).map(r => ({
            id: r.ma_tinh_trang_phong,
            label: r.mo_ta
        })))
        res.json({
            choices: status
        })
    }).catch(err => {
        res.status(500).send('GET Room Status Error')
    })
})

// main
router.get('/rooms/normals', adminJwtMiddleware, (req, res) => {
    console.log('normal rooms')
    const query = req.query
    const page = parseInt(query.page || 0)
    const status = parseInt(query.status || 0)
    const building = parseInt(query.building || 0)
    const campus = parseInt(query.campus || 0)
    const searchText = query.searchText

    phong_hoc_thuong.findAndCountAll({
        include: [
            {
                model: phong,
                where: {
                    ...(status ? ({ tinh_trang: status }) : {}),
                }
            },
            {
                model: toa_nha,
                where: {
                    ...(building ? ({ ma_toa_nha: building }) : {}),
                    ...(campus ? ({ thuoc_co_so: campus }) : {}),
                }
            },
        ],
        ...(page ? ({
            limit: LIMIT,
            offset: LIMIT * (page - 1),
            order: [['updatedAt', 'DESC']],
        }) : {})
    }).then(result => {
        Promise.all(result.rows.map(r => r.dataValues).map(async r => {
            const building = await toa_nha.findByPk(r.thuoc_toa_nha)
            return {
                id: r.ma_phong_hoc_thuong,
                name: r.phong.ten_phong,
                status: r.phong.tinh_trang,
                point: r.phong.diem_phong,
                description: r.phong.mo_ta_phong,
                building: building.ma_toa_nha,
                campus: building.thuoc_co_so
            }
        })).then(rooms => {
            res.json({
                rooms: rooms,
                currentPage: page,
                lastPage: Math.ceil(result.count / LIMIT),
                total: result.count
            })
        })
    }).catch(err => {
        console.log(err)
        res.status(500).send('GET Normal Rooms Error')
    })
})
router.get('/rooms/halls', adminJwtMiddleware, (req, res) => {
    console.log('hall rooms')
    const query = req.query
    const page = parseInt(query.page || 0)
    const status = parseInt(query.status || 0)
    const campus = parseInt(query.campus || 0)
    const searchText = query.searchText

    phong_hoi_truong.findAndCountAll({
        include: [
            {
                model: phong,
                where: {
                    ...(status ? ({ tinh_trang: status }) : {}),
                }
            }
        ],
        where: {
            ...(campus ? ({ thuoc_co_so: campus }) : {})
        },
        ...(page ? ({
            limit: LIMIT,
            offset: LIMIT * (page - 1),
            order: [['updatedAt', 'DESC']],
        }) : {})
    }).then(result => {
        const rooms = result.rows.map(r => r.dataValues).map(r => {
            return {
                id: r.ma_phong_hoi_truong,
                name: r.phong.ten_phong,
                status: r.phong.tinh_trang,
                point: r.phong.diem_phong,
                description: r.phong.mo_ta_phong,
                campus: r.thuoc_co_so
            }
        })
        res.json({
            rooms: rooms,
            currentPage: page,
            lastPage: Math.ceil(result.count / LIMIT),
            total: result.count
        })
    }).catch(err => {
        console.log(err)
        res.status(500).send('GET Hall Rooms Error')
    })
})
router.post('/rooms/normals/:id', adminJwtMiddleware, (req, res) => {
    const add = req.query.addNew || false
    const normal = req.body
    if (!add && parseInt(req.params.id) !== parseInt(normal.id)) {
        return res.json({
            code: 'FAILED',
            msg: 'Mismatch ID'
        })
    }
    if (add) {
        phong.create({
            ten_phong: normal.name,
            mo_ta_phong: normal.description,
            tinh_trang: normal.status,
            diem_phong: normal.point,
        }).then(room => {
            return phong_hoc_thuong.create({
                ma_phong_hoc_thuong: room.ma_phong,
                thuoc_toa_nha: normal.building
            })
        }).then(() => {
            res.json({ code: 'OK' })
        }).catch(err => {
            console.log(err)
            res.json({
                code: 'FAILED',
                msg: err
            })
        })
    } else {
        phong.update({
            ten_phong: normal.name,
            mo_ta_phong: normal.description,
            tinh_trang: normal.status,
            diem_phong: normal.point,
        }, {
                where: {
                    ma_phong: normal.id
                }
            }).then(room => {
                return phong_hoc_thuong.update({
                    thuoc_toa_nha: normal.building
                }, {
                        where: {
                            ma_phong_hoc_thuong: normal.id
                        }
                    })
            }).then(() => {
                res.json({
                    code: 'OK'
                })
            }).catch(err => {
                console.log(err)
                res.json({
                    code: 'FAILED',
                    msg: err
                })
            })
    }
})
router.post('/rooms/halls/:id', adminJwtMiddleware, (req, res) => {
    const add = req.query.addNew || false
    const hall = req.body
    if (!add && parseInt(req.params.id) !== parseInt(hall.id)) {
        return res.json({
            code: 'FAILED',
            msg: 'Mismatch ID'
        })
    }
    if (add) {
        phong.create({
            ten_phong: hall.name,
            mo_ta_phong: hall.description,
            tinh_trang: hall.status,
            diem_phong: hall.point,
        }).then(room => {
            return phong_hoi_truong.create({
                ma_phong_hoi_truong: room.ma_phong,
                thuoc_co_so: hall.campus
            })
        }).then(() => {
            res.json({ code: 'OK' })
        }).catch(err => {
            console.log(err)
            res.json({
                code: 'FAILED',
                msg: err
            })
        })
    } else {
        phong.update({
            ten_phong: hall.name,
            mo_ta_phong: hall.description,
            tinh_trang: hall.status,
            diem_phong: hall.point,
        }, {
                where: {
                    ma_phong: hall.id
                }
            }).then(room => {
                return phong_hoi_truong.update({
                    thuoc_co_so: hall.campus
                }, {
                        where: {
                            ma_phong_hoi_truong: hall.id
                        }
                    })
            }).then(() => {
                res.json({
                    code: 'OK'
                })
            }).catch(err => {
                console.log(err)
                res.json({
                    code: 'FAILED',
                    msg: err
                })
            })
    }
})
router.get('/rooms/:roomid/lecture_times', adminJwtMiddleware, (req, res) => {
    const room = parseInt(req.params.roomid)
    const date = req.query.date
    let endOfDate = new Date(date)
    endOfDate.setHours(23, 59, 59)
    let startOfDate = new Date(date)
    startOfDate.setHours(0, 0, 0)

    tiet_hoc.findAndCountAll({
    }).then(result => Promise.all(result.rows.map(r => r.dataValues).map(async r => {
        return chi_tiet_dat_phong.findAndCountAll({
            include: [
                {
                    model: thanh_vien,
                    include: [
                        { model: tai_khoan }
                    ]
                }
            ],
            where: {
                phong_dat: room,
                ngay_dat: {
                    [Op.lte]: endOfDate,
                    [Op.gte]: startOfDate
                },
                tiet_bat_dau: {
                    [Op.lte]: r.ma_tiet_hoc
                },
                tiet_ket_thuc: {
                    [Op.gte]: r.ma_tiet_hoc
                }
            }
        }).then(result => {
            if (result.rows.length === 0) {
                return ({
                    id: r.ma_tiet_hoc,
                    start: r.gio_bat_dau,
                    end: r.gio_ket_thuc,
                    status: null,
                    members: [],
                    chosenMember: null
                })
            } else {
                const members = (result.rows.map(r => r.dataValues).map(r => ({
                    id: r.thanh_vien.ma_thanh_vien,
                    name: r.thanh_vien.tai_khoan.ho_va_ten,
                    point: r.thanh_vien.diem_ca_nhan
                })))
                const chosen = result.rows.map(r => r.dataValues).filter(r => r.tinh_trang === 1)
                if (chosen.length > 1) {
                    throw new Error('!!!!!! 2 ACCEPTED BOOKING IN 1 TIME !!!!!!!')
                }
                console.log(chosen)
                return ({
                    id: r.ma_tiet_hoc,
                    start: r.gio_bat_dau,
                    end: r.gio_ket_thuc,
                    status: chosen.length === 0 ? 'Cho duyet' : 'Da duyet',
                    members: members,
                    chosenMember: chosen.length === 0 ? null : chosen[0].thanh_vien.ma_thanh_vien
                })
            }
        })
    })).then(lectureTimes => {
        res.json({
            lectureTimes: lectureTimes
        })
    })).catch(err => {
        console.log(err)
        res.status(500).send('GET Room Lecture Times Error')
    })
})
router.post('/rooms/:roomid/lecture_times', adminJwtMiddleware, (req, res) => {
    const room = parseInt(req.params.roomid)
    const lectureTime = req.body
    const date = req.query.date
    let endOfDate = new Date(date)
    endOfDate.setHours(23, 59, 59)
    let startOfDate = new Date(date)
    startOfDate.setHours(0, 0, 0)

    chi_tiet_dat_phong.findAndCountAll({
        where: {
            phong_dat: room,
            ngay_dat: {
                [Op.lte]: endOfDate,
                [Op.gte]: startOfDate
            },
            tiet_bat_dau: {
                [Op.lte]: lectureTime.id
            },
            tiet_ket_thuc: {
                [Op.gte]: lectureTime.id
            }
        }
    }).then(result => {
        const rows = result.rows.map(r => r.dataValues)
        return Promise.all(rows.map(async r => {
            console.log(r.thanh_vien_dat, lectureTime.chosenMember)
            return chi_tiet_dat_phong.update({
                tinh_trang: (r.thanh_vien_dat !== lectureTime.chosenMember) ? 3 : 1,
            }, {
                    where: {
                        ma_chi_tiet: r.ma_chi_tiet
                    }
                }).catch(err => {
                    console.log(err)
                    res.json({
                        code: 'FAILED',
                        msg: err
                    })
                })
        })).then(() => {
            res.json({ code: 'OK' })
        })
    }).catch(err => {
        res.json({
            code: 'FAILED',
            msg: err
        })
    })
})
router.get('/rooms/:roomid/devices', adminJwtMiddleware, (req, res) => {
    const room = parseInt(req.params.roomid)

    quan_ly_thiet_bi.findAndCountAll({
        where: {
            phong_quan_ly: room
        }
    }).then(result => Promise.all(result.rows.map(r => r.dataValues).map(async r => {
        const device = await thiet_bi.findByPk(r.thiet_bi_quan_ly)
        return {
            id: device.ma_thiet_bi,
            name: device.ten_thiet_bi,
            date: device.ngay_san_xuat,
            company: device.hang_san_xuat,
            price: device.don_gia
        }
    })).then(devices => {
        res.json({
            devices: devices
        })
    })).catch(err => {
        console.log(err)
        res.status(500).send('GET Room Devices Error')
    })
})
router.post('/rooms/:roomid/devices/:deviceid', adminJwtMiddleware, (req, res) => {
    const room = parseInt(req.params.roomid)
    const device = req.body
    if (parseInt(req.params.deviceid) !== parseInt(device.id)) {
        return res.json({
            code: 'FAILED',
            msg: 'Mismatch device ID'
        })
    }

    quan_ly_thiet_bi.findOrCreate({
        where: {
            phong_quan_ly: room,
            thiet_bi_quan_ly: device.id
        }
    }).then((data, created) => {
        res.json({ code: 'OK' })
    }).catch(err => {
        console.log(err)
        res.json({
            code: 'FAILED',
            msg: err
        })
    })
})
router.delete('/rooms/:roomid/devices/:deviceid', adminJwtMiddleware, (req, res) => {
    const room = parseInt(req.params.roomid)
    const device = parseInt(req.params.deviceid)

    quan_ly_thiet_bi.destroy({
        where: {
            phong_quan_ly: room,
            thiet_bi_quan_ly: device
        }
    }).then(() => {
        res.json({ code: 'OK' })
    }).catch(err => {
        console.log(err)
        res.json({
            code: 'FAILED',
            msg: err
        })
    })
})

//---------------------------------------- users --------------------------------------------//
// // admin
// router.get('/users/admins', adminJwtMiddleware, (req, res) => {
//     console.log('admins')
//     const query = req.query
//     const page = parseInt(query.page || 0)

//     AdminRepo.fetchPage(LIMIT, page)
//         .then(result => {
//             if (result.ok) {
//                 res.json(result.msg)
//             } else {
//                 console.log(result.msg)
//                 res.status(500).send('GET Admins Error')
//             }
//         })
// })
// router.post('/users/admins/:id', adminJwtMiddleware, (req, res) => {
//     const add = req.query.addNew || false
//     const admin = req.body
//     const id = parseInt(req.params.id)
//     if (!add && id !== parseInt(admin.id)) {
//         return res.json({
//             code: 'FAILED',
//             msg: 'Mismatch ID'
//         })
//     }
//     if (add) {
//         AdminRepo.addOne(admin)
//             .then(result => {
//                 if (result.ok) {
//                     res.json({ code: 'OK' })
//                 } else {
//                     console.log(result.msg)
//                     res.json({ code: 'FAILED', msg: result.msg })
//                 }
//             })
//     } else {
//         const old = { id }
//         AdminRepo.updateOne(old, admin)
//             .then(result => {
//                 if (result.ok) {
//                     res.json({ code: 'OK' })
//                 } else {
//                     console.log(result.msg)
//                     res.json({ code: 'FAILED', msg: result.msg })
//                 }
//             })
//     }
// })
// // member
// router.get('/users/members', adminJwtMiddleware, (req, res) => {
//     console.log('members')
//     const query = req.query
//     const page = parseInt(query.page || 0)

//     MemberRepo.fetchPage(LIMIT, page)
//         .then(result => {
//             if (result.ok) {
//                 res.json(result.msg)
//             } else {
//                 console.log(result.msg)
//                 res.status(500).send('GET Members Error')
//             }
//         })
// })
// router.post('/users/members/:id', adminJwtMiddleware, (req, res) => {
//     const add = req.query.addNew || false
//     const member = req.body
//     const id = parseInt(req.params.id)
//     if (!add && id !== parseInt(member.id)) {
//         return res.json({
//             code: 'FAILED',
//             msg: 'Mismatch ID'
//         })
//     }
//     if (add) {
//         MemberRepo.addOne(member)
//             .then(result => {
//                 if (result.ok) {
//                     res.json({ code: 'OK' })
//                 } else {
//                     console.log(result.msg)
//                     res.json({ code: 'FAILED', msg: result.msg })
//                 }
//             })
//     } else {
//         const old = { id }
//         MemberRepo.updateOne(old, member)
//             .then(result => {
//                 if (result.ok) {
//                     res.json({ code: 'OK' })
//                 } else {
//                     console.log(result.msg)
//                     res.json({ code: 'FAILED', msg: result.msg })
//                 }
//             })
//     }
// })

//----------------------------------------- devices ---------------------------------------------//
// router.get('/devices', adminJwtMiddleware, (req, res) => {
//     console.log('devices')
//     const query = req.query
//     const page = parseInt(query.page || 0)

//     DeviceRepo.fetchPage(LIMIT, page)
//         .then(result => {
//             if (result.ok) {
//                 res.json(result.msg)
//             } else {
//                 res.status(500).send('GET Devices Error')
//             }
//         })
// })
// router.post('/devices/:id', adminJwtMiddleware, (req, res) => {
//     const add = req.query.addNew || false
//     const device = req.body
//     const id = parseInt(req.params.id)

//     if (add && id !== parseInt(device.id)) {
//         return res.json({
//             code: 'FAILED',
//             msg: 'Mismatch ID'
//         })
//     }

//     if (add) {
//         DeviceRepo.addOne(device)
//             .then(result => {
//                 if (result.ok) {
//                     res.json({ code: 'OK' })
//                 } else {
//                     res.json({ code: 'FAILED', msg: result.msg })
//                 }
//             })
//     } else {
//         DeviceRepo.updateOne({ id }, device)
//             .then(result => {
//                 if (result.ok) {
//                     res.json({ code: 'OK' })
//                 } else {
//                     res.json({ code: 'FAILED', msg: result.msg })
//                 }
//             })
//     }
// })

module.exports = router;
