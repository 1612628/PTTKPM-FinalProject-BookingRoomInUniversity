const express = require("express");
const bcrypt = require('bcryptjs')
const router = express.Router();

const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY || 'wtf'
const tokenName = 'NIGAMON_JWT_TOKEN'

const LIMIT = 5;

const {
    Sequelize,
    tai_khoan, quan_tri_vien, thanh_vien,
    thiet_bi, quan_ly_thiet_bi,
    tinh_trang_phong, phong, phong_hoi_truong, phong_hoc_thuong,
    toa_nha, co_so,
    chi_tiet_dat_phong, tiet_hoc, tinh_trang_dat_phong
} = require("../models");
const Op = Sequelize.Op

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
router.post('/login', (req, res) => {
    tai_khoan.findOne({ where: { ten_dang_nhap: req.body.username } })
        .then(user => {
            return quan_tri_vien.findByPk(user.id)
                .then(admin => user)
                .catch(err => {
                    res.json({ isLogin: false })
                })
        })
        .then(user => {
            bcrypt.compare(req.body.password, user.mat_khau, (err, bcryptRes) => {
                if (err) {
                    return res.json({ isLogin: false })
                }
                jwt.sign({
                    username: user.ten_dang_nhap,
                    fullname: user.ho_va_ten,
                    cmnd: user.cmnd,
                    phone: user.sdt,
                    email: user.email
                }, secretKey, {
                        expiresIn: "2h"
                    }, (err, token) => {
                        if (err) {
                            res.status(500).send('Something is broken')
                        } else {
                            res.json({
                                isLogin: true,
                                token: token,
                                userInfo: {
                                    username: user.ten_dang_nhap,
                                    fullname: user.ho_va_ten,
                                    cmnd: user.cmnd,
                                    phone: user.sdt,
                                    email: user.email
                                }
                            })
                        }
                    })
            })
        })
        .catch(() => res.json({ isLogin: false }))
})

router.get('/login', adminJwtMiddleware, (req, res) => {
    const decoded = jwt.decode(req.headers.authorization.slice(7))
    res.json({
        isLogin: true,
        userInfo: {
            username: decoded.username,
            fullname: decoded.fullname,
            cmnd: decoded.cmnd,
            phone: decoded.phone,
            email: decoded.email
        }
    })
})

//----------------------------------- dashboard-------------------------------------//
router.get('/dashboard/orders', adminJwtMiddleware, (req, res) => {
    console.log('orders dashboard')
    const query = req.query
    const page = parseInt(query.page || 0)
    const status = parseInt(query.status || 0)

    Order.findAndCountAll({
        where: {
            ...(status ? { orderStatusId: status } : {}),
        },
        limit: LIMIT,
        offset: (page - 1) * LIMIT,
        order: [['updatedAt', 'DESC']],
    }).then(result => Promise.all(result.rows.map(r => r.dataValues).map(async r => {
        const user = await User.findByPk(r.userId)
        const tickets = await OrdererTicket.findAndCountAll({
            where: { orderId: r.id }
        }).then(result => {
            return Promise.all(result.rows.map(r => r.dataValues)
                .map(async r => {
                    const ticket = await Ticket.findByPk(r.ticketId)
                    const showTime = await ShowTime.findByPk(ticket.showTimeId)
                    const ticketType = await TicketType.findByPk(showTime.ticketTypeId)
                    return {
                        price: ticketType.price
                    }
                })
            )
        })
        const foods = await FoodOrder.findAndCountAll({
            where: { orderId: r.id }
        }).then(result => {
            return Promise.all(result.rows.map(r => r.dataValues)
                .map(async r => {
                    const food = await Food.findByPk(r.foodId)
                    return {
                        price: food.price * r.quantity
                    }
                }))
        })
        const total = tickets.reduce((p, c) => p + c.price, 0)
            + foods.reduce((p, c) => p + c.price, 0)
        return {
            username: user.username,
            date: r.createdAt,
            time: r.createdAt,
            total: total
        }
    })).then(data => {
        let orders = data
        res.json({
            orders: orders,
            currentPage: page,
            lastPage: Math.ceil(result.count / LIMIT),
            total: result.count
        })
    })).catch(err => {
        console.log(err)
        res.status(500).send('GET Dashboard Orders Error')
    })
})
router.get('/dashboard/movies', adminJwtMiddleware, (req, res) => {
    console.log('movies dashboard')
    const query = req.query
    const page = parseInt(query.page || 1)
    const today = new Date()
    let endOfDate = new Date()
    endOfDate.setHours(23, 59, 59)
    let startOfDate = new Date()
    startOfDate.setHours(0, 0, 0)

    ShowTime.findAndCountAll({
        where: {
            date: {
                [Op.lte]: endOfDate,
                [Op.gte]: startOfDate
            },
            time: {
                [Op.lte]: `${today.getHours()}:${today.getSeconds()}`
            },
        },
        order: [['time', 'DESC']]
    }).then(results => {
        Promise.all(results.rows.map(r => r.dataValues).map(async r => {
            let movie = await Movie.findByPk(r.movieId)
            let theater = await Theater.findByPk(r.theaterId)
            let genre = await MovieGenre.findByPk(movie.movieGenreId)

            let movieStart = r.time.split(':').map(c => parseInt(c))
            movieStart = movieStart[0] * 60 + movieStart[1]
            let currentTime = today.getHours() * 60 + today.getMinutes()
            if (movieStart + 120 > currentTime) {
                return {
                    name: movie.name,
                    type: genre.name,
                    director: movie.director,
                    theater: theater.name,
                    showTime: r.time
                }
            }
            return null
        })).then(data => {
            const movies = data.filter(m => m !== null)
            res.json({
                movies: movies.slice((page - 1) * LIMIT, page * LIMIT),
                currentPage: page,
                lastPage: Math.ceil(movies.length / LIMIT),
                total: movies.length
            })
        })
    }).catch(err => {
        console.log(err)
        res.status(500).send('GET Dashboard Movies Error')
    })
})
router.get('/dashboard/theaters', adminJwtMiddleware, (req, res) => {
    console.log('theaters dashboard')
    const query = req.query
    const page = parseInt(query.page || 0)
    const today = new Date()
    let endOfDate = new Date()
    endOfDate.setHours(23, 59, 59)
    let startOfDate = new Date()
    startOfDate.setHours(0, 0, 0)

    Theater.findAndCountAll({
        where: {
            theaterStatusId: 1,
        },
        ...(page ? ({
            limit: LIMIT,
            offset: LIMIT * (page - 1),
            order: [['updatedAt', 'DESC']],
        }) : {})
    }).then(results => {
        Promise.all(results.rows.map(r => r.dataValues).map(async r => {
            return await ShowTime.findAndCountAll({
                where: {
                    theaterId: r.id,
                    date: {
                        [Op.lte]: endOfDate,
                        [Op.gte]: startOfDate
                    },
                    time: {
                        [Op.gte]: `${today.getHours()}:${today.getSeconds()}`
                    }
                },
                limit: 1,
                order: [['time', 'ASC']]
            }).then(results => {
                if (results.count === 0) {
                    return null
                }
                const showtime = results.rows[0].dataValues
                return OrdererTicket.findAndCountAll({
                    include: [{
                        model: Ticket,
                        as: 'ticket'
                    }],
                    where: {
                        "$ticket.showTimeId$": showtime.id
                    }
                }).then(results => results.count)
                    .then(count => {
                        return {
                            name: r.name,
                            address: r.address,
                            capacity: r.rowNum * r.seatPerRow,
                            ordered: count
                        }
                    })
            })
        })).then(theaters => {
            res.json({
                theaters: theaters.filter(t => t !== null),
                currentPage: page,
                lastPage: Math.ceil(results.count / LIMIT),
                total: results.count
            })
        })
    }).catch(err => {
        console.log(err)
        res.status(500).send('GET Dashboard Theaters Error')
    })
})
router.get('/dashboard/charts', adminJwtMiddleware, (req, res) => {
    console.log('charts dashboard')
    const query = req.query
    let start = query.start && new Date(query.start)
    if (start) {
        start.setHours(0, 0, 0)
    }
    let end = query.end && new Date(query.end)
    if (end) {
        end.setHours(23, 59, 59)
    }

    Order.findAndCountAll({
        where: {
            orderStatusId: 1,
            ...((start || end) ? ({
                createdAt: {
                    ...(start ? ({
                        [Op.gte]: start
                    }) : {}),
                    ...(end ? ({
                        [Op.lte]: end
                    }) : {})
                }
            }) : {})
        },
        order: [['createdAt', 'ASC']],
    }).then(result => {
        if (!start) {
            start = new Date(result.rows[0].dataValues.createdAt)
        }
        if (!end) {
            end = new Date(result.rows[result.rows.length - 1].dataValues.createdAt)
        }
        let labels = []
        let date = new Date(start.getTime())
        while (date.getDate() < end.getDate() || date.getMonth() < end.getMonth() || date.getFullYear() < end.getFullYear()) {
            labels.push(new Date(date.getTime()))
            let currentDate = date.getDate()
            date.setDate(currentDate + 1)
        }
        labels.push(end)

        Promise.all(labels.map(async d => {
            let startOfDate = new Date(d.getTime())
            startOfDate.setHours(0, 0, 0)
            let endOfDate = new Date(d.getTime())
            endOfDate.setHours(23, 59, 59)

            const orders = await Order.findAndCountAll({
                where: {
                    createdAt: {
                        [Op.gte]: startOfDate,
                        [Op.lte]: endOfDate
                    }
                }
            }).then(result => Promise.all(result.rows.map(r => r.dataValues).map(async r => {
                const tickets = await OrdererTicket.findAndCountAll({
                    where: { orderId: r.id }
                }).then(result => {
                    return Promise.all(result.rows.map(r => r.dataValues)
                        .map(async r => {
                            const ticket = await Ticket.findByPk(r.ticketId)
                            const showTime = await ShowTime.findByPk(ticket.showTimeId)
                            const ticketType = await TicketType.findByPk(showTime.ticketTypeId)
                            return {
                                price: ticketType.price
                            }
                        })
                    )
                })
                const foods = await FoodOrder.findAndCountAll({
                    where: { orderId: r.id }
                }).then(result => {
                    return Promise.all(result.rows.map(r => r.dataValues)
                        .map(async r => {
                            const food = await Food.findByPk(r.foodId)
                            return {
                                price: food.price * r.quantity
                            }
                        }))
                })
                const ticketTotal = tickets.reduce((p, c) => p + c.price, 0)
                const foodTotal = foods.reduce((p, c) => p + c.price, 0)
                return {
                    food: foodTotal,
                    ticket: ticketTotal,
                    total: ticketTotal + foodTotal
                }
            })))
            const users = await User.findAndCountAll({
                where: {
                    createdAt: {
                        [Op.gte]: startOfDate,
                        [Op.lte]: endOfDate
                    }
                }
            }).then(result => result.rows.length)
            return {
                date: d,
                orders: orders,
                users: users
            }
        })).then(data => {
            const totalFood = data.map(d => d.orders.reduce((p, c) => p + c.food, 0)).reduce((p, c) => p + c, 0)
            const totalTicket = data.map(d => d.orders.reduce((p, c) => p + c.ticket, 0)).reduce((p, c) => p + c, 0)
            const total = totalFood + totalTicket
            res.json({
                charts: {
                    income: {
                        labels: labels,
                        data: data.map(d => d.orders.reduce((p, c) => p + c.total, 0))
                    },
                    newUser: {
                        labels: labels,
                        data: data.map(d => {
                            return d.users
                        })
                    },
                    incomeShare: {
                        labels: ['Thuc an', 'Ve phim'],
                        data: [totalFood * 100 / total, totalTicket * 100 / total]
                    }
                }
            })
        })
    }).catch(err => {
        console.log(err)
        res.status(500).send('GET Dashboard Charts Error')
    })
})

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
                { model: thanh_vien }
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
                const members = result.rows.map(r => r.dataValues).map(r => ({
                    id: r.thanh_vien.ma_thanh_vien,
                    name: r.thanh_vien.ho_va_ten,
                    point: r.thanh_vien.diem_ca_nhan
                }))
                const chosen = result.rows.map(r => r.dataValues).filter(r => r.tinh_trang === 1)
                if (chosen.length > 1) {
                    throw new Error('!!!!!! 2 ACCEPTED BOOKING IN 1 TIME !!!!!!!')
                }
                return ({
                    id: r.ma_tiet_hoc,
                    start: r.gio_bat_dau,
                    end: r.gio_ket_thuc,
                    status: chosen.length === 0 ? 'Cho duyet' : 'Da duyet',
                    members: members,
                    chosenMember: chosen[0].thanh_vien.ma_thanh_vien
                })
            }
        })
    })).then(lectureTimes => {
        res.json({
            lectureTimes: lectureTimes
        })
    })).catch(err => {
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
                [Op.lte]: r.ma_tiet_hoc
            },
            tiet_ket_thuc: {
                [Op.gte]: r.ma_tiet_hoc
            }
        }
    }).then(result => {
        const rows = result.rows.map(r => r.dataValues)
        return Promise.all(rows.map(async r => {
            return chi_tiet_dat_phong.update({
                tinh_trang_dat_phong: r.thanh_vien_dat !== lectureTime.chosenMember ? 3 : 1,
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

//---------------------------------------- users --------------------------------------------//
// admin
router.get('/users/admins', adminJwtMiddleware, (req, res) => {
    console.log('admins')
    const query = req.query
    const page = parseInt(query.page || 0)
    const searchText = query.searchText

    quan_tri_vien.findAndCountAll({
        ...(page ? ({
            limit: LIMIT,
            offset: LIMIT * (page - 1),
            order: [['updatedAt', 'DESC']],
        }) : {})
    }).then(result => {
        Promise.all(result.rows.map(r => r.dataValues).map(async r => {
            return tai_khoan.findByPk(r.ma_quan_tri)
                .then(user => ({
                    id: r.ma_quan_tri,
                    username: user.ten_dang_nhap,
                    fullname: user.ho_va_ten,
                    cmnd: user.cmnd,
                    phone: user.sdt,
                    email: user.email,
                    department: r.phong_ban
                }))
        })).then(admins => {
            res.json({
                admins: admins,
                currentPage: page,
                lastPage: Math.ceil(result.count / LIMIT),
                total: result.count
            })
        })
    }).catch(err => {
        res.status(500).send('GET Admins Error')
    })
})
router.post('/users/admins/:id', adminJwtMiddleware, (req, res) => {
    const add = req.query.addNew || false
    const admin = req.body
    if (!add && parseInt(req.params.id) !== parseInt(admin.id)) {
        return res.json({
            code: 'FAILED',
            msg: 'Mismatch ID'
        })
    }
    if (add) {
        tai_khoan.create({
            ten_dang_nhap: admin.username,
            mat_khau: admin.password,
            ho_va_ten: admin.fullname,
            cmnd: admin.cmnd,
            sdt: admin.phone,
            email: admin.email
        }).then(user => {
            return quan_tri_vien.create({
                ma_quan_tri: user.ma_tai_khoan,
                phong_ban: admin.department
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
        tai_khoan.update({
            ten_dang_nhap: admin.username,
            mat_khau: admin.password,
            ho_va_ten: admin.fullname,
            cmnd: admin.cmnd,
            sdt: admin.phone,
            email: admin.email
        }, {
                where: {
                    ma_tai_khoan: admin.id
                }
            }).then(user => {
                return quan_tri_vien.update({
                    phong_ban: admin.department
                }, {
                        where: {
                            ma_quan_tri: admin.id
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
// member
router.get('/users/members', adminJwtMiddleware, (req, res) => {
    console.log('members')
    const query = req.query
    const page = parseInt(query.page || 0)
    const searchText = query.searchText

    thanh_vien.findAndCountAll({
        ...(page ? ({
            limit: LIMIT,
            offset: LIMIT * (page - 1),
            order: [['updatedAt', 'DESC']],
        }) : {})
    }).then(result => {
        Promise.all(result.rows.map(r => r.dataValues).map(async r => {
            return tai_khoan.findByPk(r.ma_thanh_vien)
                .then(user => ({
                    id: r.ma_thanh_vien,
                    username: user.ten_dang_nhap,
                    fullname: user.ho_va_ten,
                    cmnd: user.cmnd,
                    phone: user.sdt,
                    email: user.email,
                    point: r.diem_ca_nhan
                }))
        })).then(members => {
            res.json({
                members: members,
                currentPage: page,
                lastPage: Math.ceil(result.count / LIMIT),
                total: result.count
            })
        })
    }).catch(err => {
        res.status(500).send('GET Admins Error')
    })
})
router.post('/users/members/:id', adminJwtMiddleware, (req, res) => {
    const add = req.query.addNew || false
    const member = req.body
    if (!add && parseInt(req.params.id) !== parseInt(member.id)) {
        return res.json({
            code: 'FAILED',
            msg: 'Mismatch ID'
        })
    }
    if (add) {
        tai_khoan.create({
            ten_dang_nhap: member.username,
            mat_khau: member.password,
            ho_va_ten: member.fullname,
            cmnd: member.cmnd,
            sdt: member.phone,
            email: member.email
        }).then(user => {
            return thanh_vien.create({
                ma_thanh_vien: user.ma_tai_khoan,
                diem_ca_nhan: member.point
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
        tai_khoan.update({
            ten_dang_nhap: member.username,
            mat_khau: member.password,
            ho_va_ten: member.fullname,
            cmnd: member.cmnd,
            sdt: member.phone,
            email: member.email
        }, {
                where: {
                    ma_tai_khoan: member.id
                }
            }).then(user => {
                return thanh_vien.update({
                    diem_ca_nhan: member.point
                }, {
                        where: {
                            ma_thanh_vien: member.id
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

//------------------------------------------- tickets -------------------------------------//
router.get('/tickets/status', adminJwtMiddleware, (req, res) => {
    TicketStatus.findAndCountAll({
    }).then(result => {
        const types = (result.rows.map(r => r.dataValues).map(r => ({
            id: r.id,
            label: r.name,
        })))
        res.json({
            choices: types
        })
    }).catch(err => {
        res.status(500).send('GET Ticket Status Error')
    })
})
router.get('/tickets', adminJwtMiddleware, (req, res) => {
    console.log('tickets')
    const query = req.query
    const page = parseInt(query.page || 0)
    const status = parseInt(query.status || 0)
    const searchText = query.searchText

    TicketType.findAndCountAll({
        where: {
            ...(status ? { ticketStatusId: status } : {})
        },
        ...(page ? ({
            limit: LIMIT,
            offset: LIMIT * (page - 1),
            order: [['updatedAt', 'DESC']],
        }) : {})
    }).then(result => {
        const tickets = (result.rows.map(r => r.dataValues).map(r => ({
            id: r.id,
            name: r.name,
            price: r.price,
            status: r.ticketStatusId
        })))
        res.json({
            tickets: tickets,
            currentPage: page,
            lastPage: Math.ceil(result.count / LIMIT),
            total: result.count
        })
    }).catch(err => {
        res.status(500).send('GET Tickets Error')
    })
})
router.post('/tickets/:id', adminJwtMiddleware, (req, res) => {
    const add = req.query.addNew || false
    const ticket = req.body
    if (parseInt(req.params.id) !== parseInt(ticket.id)) {
        return res.json({
            code: 'FAILED',
            msg: 'Mismatch ID'
        })
    }
    if (add) {
        TicketType.create({
            id: ticket.id,
            name: ticket.name,
            price: ticket.price,
            ticketStatusId: ticket.status
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
        TicketType.update({
            name: ticket.name,
            price: ticket.price,
            ticketStatusId: ticket.status
        }, {
                where: {
                    id: ticket.id
                }
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

//----------------------------------------- devices ---------------------------------------------//
router.get('/devices', adminJwtMiddleware, (req, res) => {
    console.log('devices')
    const query = req.query
    const page = parseInt(query.page || 0)
    const searchText = query.searchText

    thiet_bi.findAndCountAll({
        ...(page ? ({
            limit: LIMIT,
            offset: LIMIT * (page - 1),
            order: [['updatedAt', 'DESC']],
        }) : {})
    }).then(result => {
        const devices = (result.rows.map(r => r.dataValues).map(r => ({
            id: r.ma_thiet_bi,
            name: r.ten_thiet_bi,
            date: r.ngay_san_xuat,
            company: r.hang_san_xuat,
            price: r.don_gia
        })))
        res.json({
            devices: devices,
            currentPage: page,
            lastPage: Math.ceil(result.count / LIMIT),
            total: result.count
        })
    }).catch(err => {
        res.status(500).send('GET Devices Error')
    })
})
router.post('/devices/:id', adminJwtMiddleware, (req, res) => {
    const add = req.query.addNew || false
    const device = req.body

    if (add && parseInt(req.params.id) !== parseInt(device.id)) {
        return res.json({
            code: 'FAILED',
            msg: 'Mismatch ID'
        })
    }

    if (add) {
        thiet_bi.create({
            ten_thiet_bi: device.name,
            ngay_san_xuat: new Date(device.date),
            hang_san_xuat: device.company,
            don_gia: device.price,
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
        thiet_bi.update({
            ten_thiet_bi: device.name,
            ngay_san_xuat: new Date(device.date),
            hang_san_xuat: device.company,
            don_gia: device.price,
        }, {
                where: {
                    ma_thiet_bi: device.id
                }
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

//---------------------------------------- orders --------------------------------//
router.get('/orders/status', adminJwtMiddleware, (req, res) => {
    console.log('order status')
    OrderStatus.findAndCountAll({
    }).then(result => {
        const types = (result.rows.map(r => r.dataValues).map(r => ({
            id: r.id,
            label: r.name,
        })))
        res.json({
            choices: types
        })
    }).catch(err => {
        res.status(500).send('GET Order Status Error')
    })
})
router.get('/orders', adminJwtMiddleware, (req, res) => {
    console.log('orders')
    const query = req.query
    const page = parseInt(query.page || 0)
    const status = parseInt(query.status || 0)
    let dateStart = query.dateStart && new Date(query.dateStart)
    if (dateStart) {
        dateStart.setHours(0, 0, 0)
    }
    let dateEnd = query.dateEnd && new Date(query.dateEnd)
    if (dateEnd) {
        dateEnd.setHours(23, 59, 59)
    }
    const moneyStart = query.moneyStart && parseInt(query.moneyStart)
    const moneyEnd = query.moneyEnd && parseInt(query.moneyEnd)
    const searchText = query.searchText

    Order.findAndCountAll({
        where: {
            ...(status ? { orderStatusId: status } : {}),
            ...(dateStart ? ({
                createdAt: {
                    [Op.gte]: dateStart
                }
            }) : {}),
            ...(dateEnd ? ({
                createdAt: {
                    [Op.lte]: dateEnd
                }
            }) : {}),
        },
        order: [['updatedAt', 'DESC']],
    }).then(result => result.rows.map(r => r.dataValues))
        .then(rows => {
            return Promise.all(rows.map(async r => {
                const user = await User.findByPk(r.userId)
                const tickets = await OrdererTicket.findAndCountAll({
                    where: { orderId: r.id }
                }).then(result => {
                    return Promise.all(result.rows.map(r => r.dataValues)
                        .map(async r => {
                            const ticket = await Ticket.findByPk(r.ticketId)
                            const showTime = await ShowTime.findByPk(ticket.showTimeId)
                            const ticketType = await TicketType.findByPk(showTime.ticketTypeId)
                            return {
                                theater: showTime.theaterId,
                                date: showTime.date,
                                time: showTime.time,
                                row: ticket.seatRow,
                                column: ticket.seatColumn,
                                ticket: showTime.ticketTypeId,
                                price: ticketType.price
                            }
                        })
                    )
                })
                const foods = await FoodOrder.findAndCountAll({
                    where: { orderId: r.id }
                }).then(result => {
                    return Promise.all(result.rows.map(r => r.dataValues)
                        .map(async r => {
                            const food = await Food.findByPk(r.foodId)
                            return {
                                id: r.foodId,
                                quantity: r.quantity,
                                price: food.price * r.quantity
                            }
                        }))
                })
                const total = tickets.reduce((p, c) => p + c.price, 0)
                    + foods.reduce((p, c) => p + c.price, 0)
                return {
                    id: r.id,
                    username: user.username,
                    datetime: r.createdAt,
                    tickets: tickets,
                    foods: foods,
                    status: r.orderStatusId,
                    total: total
                }
            })).then(data => {
                let orders = data
                if (moneyStart) {
                    orders = orders.filter(o => o.total >= moneyStart)
                }
                if (moneyEnd) {
                    orders = orders.filter(o => o.total <= moneyEnd)
                }
                res.json({
                    orders: orders.slice((page - 1) * LIMIT, page * LIMIT),
                    currentPage: page,
                    lastPage: Math.ceil(orders.length / LIMIT),
                    total: orders.length
                })
            })
        }).catch(err => {
            console.log(err)
            res.status(500).send('GET Orders Error')
        })
})
router.post('/orders/:id', adminJwtMiddleware, (req, res) => {
    const add = req.query.addNew || false
    const order = req.body
    if (parseInt(req.params.id) !== parseInt(order.id)) {
        return res.json({
            code: 'FAILED',
            msg: 'Mismatch ID'
        })
    }

    User.findOne({ where: { username: order.username } })
        .then(user => {
            if (add) {
                Order.create({
                    id: order.id,
                    orderStatusId: order.status,
                    userId: user.id
                }).then(() => {
                    res.json({ code: 'OK' })
                }).catch(err => {
                    res.json({
                        code: 'FAILED',
                        msg: err
                    })
                })
            } else {
                Order.update({
                    orderStatusId: order.status,
                    userId: user.id
                }, {
                        where: {
                            id: order.id
                        }
                    }).then(() => {
                        res.json({ code: 'OK' })
                    }).catch(err => {
                        res.json({
                            code: 'FAILED',
                            msg: err
                        })
                    })
            }
        })
        .catch(err => {
            console.log(err)
            return res.json({
                code: 'FAILED',
                msg: err
            })
        })
})

module.exports = router;
