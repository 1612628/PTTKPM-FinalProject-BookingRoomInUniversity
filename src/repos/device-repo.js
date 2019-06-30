class SequelizeDeviceRepo {
    constructor(models) {
        this.devices = models.thiet_bi
    }

    fetchPage(_size, _page) {
        return this.devices.findAndCountAll({
            ...(_page ? ({
                limit: _size,
                offset: _size * (_page - 1),
                order: [['updatedAt', 'DESC']],
            }) : {})
        }).then(result => {
            const devices = (result.rows.map(r => ({
                id: r.ma_thiet_bi,
                name: r.ten_thiet_bi,
                date: r.ngay_san_xuat,
                company: r.hang_san_xuat,
                price: r.don_gia
            })))
            return ({
                ok: true,
                msg: {
                    devices: devices,
                    currentPage: _page,
                    lastPage: Math.ceil(result.count / _size),
                    total: result.count
                }
            })
        }).catch(err => {
            return {
                ok: false,
                msg: err
            }
        })
    }

    updateOne(_old, _new) {
        return this.devices.update({
            ten_thiet_bi: _new.name,
            ngay_san_xuat: new Date(_new.date),
            hang_san_xuat: _new.company,
            don_gia: _new.price,
        }, {
                where: {
                    ma_thiet_bi: _old.id
                }
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

    addOne(_new) {
        return this.devices.create({
            ten_thiet_bi: _new.name,
            ngay_san_xuat: new Date(_new.date),
            hang_san_xuat: _new.company,
            don_gia: _new.price,
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
    SequelizeDeviceRepo
}