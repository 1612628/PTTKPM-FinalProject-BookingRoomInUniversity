class SequelizeHallRoomRepo {
    constructor(sequelizeModels) {
        this.halls = sequelizeModels.phong_hoi_truong
        this.rooms = sequelizeModels.phong
    }

    fetchPage(_size, _page, _options) {
        const status = parseInt(_options.status || 0)
        const campus = parseInt(_options.campus || 0)

        return this.halls.findAndCountAll({
            include: [
                {
                    model: this.rooms,
                    where: {
                        ...(status ? ({ tinh_trang: status }) : {}),
                    }
                }
            ],
            where: {
                ...(campus ? ({ thuoc_co_so: campus }) : {})
            },
            ...(_page ? ({
                limit: _size,
                offset: _size * (_page - 1),
                order: [['updatedAt', 'DESC']],
            }) : {})
        }).then(result => {
            const rooms = result.rows.map(r => ({
                id: r.ma_phong_hoi_truong,
                name: r.phong.ten_phong,
                status: r.phong.tinh_trang,
                point: r.phong.diem_phong,
                description: r.phong.mo_ta_phong,
                campus: r.thuoc_co_so
            }))
            return {
                ok: true,
                msg: {
                    rooms: rooms,
                    currentPage: _page,
                    lastPage: Math.ceil(result.count / _size),
                    total: result.count
                }
            }
        }).catch(err => {
            return {
                ok: false,
                msg: err
            }
        })
    }

    addOne(_new) {
        return this.rooms.create({
            ten_phong: _new.name,
            mo_ta_phong: _new.description,
            tinh_trang: _new.status,
            diem_phong: _new.point,
        }).then(room => {
            return this.halls.create({
                ma_phong_hoi_truong: room.ma_phong,
                thuoc_co_so: _new.campus
            })
        }).then(() => {
            return {
                ok: true,
                msg: ''
            }
        }).catch(err => {
            return {
                ok: false,
                msg: err
            }
        })
    }

    updateOne(_old, _new) {
        return this.rooms.update({
            ten_phong: _new.name,
            mo_ta_phong: _new.description,
            tinh_trang: _new.status,
            diem_phong: _new.point,
        }, {
                where: {
                    ma_phong: _old.id
                }
            }).then(room => {
                return this.halls.update({
                    thuoc_co_so: _new.campus
                }, {
                        where: {
                            ma_phong_hoi_truong: _old.id
                        }
                    })
            }).then(() => {
                return {
                    ok: true,
                    msg: ''
                }
            }).catch(err => {
                return {
                    ok: false,
                    msg: err
                }
            })
    }
}

module.exports = {
    SequelizeHallRoomRepo
}