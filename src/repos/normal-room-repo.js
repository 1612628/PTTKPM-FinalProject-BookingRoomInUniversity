class SequelizeNormalRoomRepo {
    constructor(sequelizeModels) {
        this.normals = sequelizeModels.phong_hoc_thuong
        this.rooms = sequelizeModels.phong
        this.buildings = sequelizeModels.toa_nha
    }

    fetchPage(_size, _page, _options) {
        const status = parseInt(_options.status || 0)
        const building = parseInt(_options.building || 0)
        const campus = parseInt(_options.campus || 0)

        return this.normals.findAndCountAll({
            include: [
                {
                    model: this.rooms,
                    where: {
                        ...(status ? ({ tinh_trang: status }) : {}),
                    }
                },
                {
                    model: this.buildings,
                    where: {
                        ...(building ? ({ ma_toa_nha: building }) : {}),
                        ...(campus ? ({ thuoc_co_so: campus }) : {}),
                    }
                },
            ],
            ...(_page ? ({
                limit: _size,
                offset: _size * (_page - 1),
                order: [['updatedAt', 'DESC']],
            }) : {})
        }).then(result => {
            return Promise.all(result.rows.map(async r => {
                const building = await this.buildings.findByPk(r.thuoc_toa_nha)
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
                return {
                    ok: true,
                    msg: {
                        rooms: rooms,
                        currentPage: _page,
                        lastPage: Math.ceil(result.count / _size),
                        total: result.count
                    }
                }
            })
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
            return this.normals.create({
                ma_phong_hoc_thuong: room.ma_phong,
                thuoc_toa_nha: _new.building
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
                return this.normals.update({
                    thuoc_toa_nha: _new.building
                }, {
                        where: {
                            ma_phong_hoc_thuong: _old.id
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
    SequelizeNormalRoomRepo
}