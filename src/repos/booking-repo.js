const PENDING = 1
const ACCEPTED = 2
const REJECTED = 3

class SequelizeBookingRepo {
    constructor(sequelizeModels) {
        this.bookings = sequelizeModels.chi_tiet_dat_phong
        this.Op = sequelizeModels.Sequelize.Op
    }

    updateBooking(_old, _new) {
        const date = _old.date
        let endOfDate = new Date(date)
        endOfDate.setHours(23, 59, 59)
        let startOfDate = new Date(date)
        startOfDate.setHours(0, 0, 0)

        return this.bookings.findAll({
            where: {
                phong_dat: _old.room,
                ngay_dat: {
                    [this.Op.lte]: endOfDate,
                    [this.Op.gte]: startOfDate
                },
                tiet_bat_dau: {
                    [this.Op.lte]: _old.id
                },
                tiet_ket_thuc: {
                    [this.Op.gte]: _old.id
                }
            }
        }).then(result => {
            return Promise.all(result.map(async r => {
                return this.bookings.update({
                    tinh_trang: (() => {
                        if (_new.chosen) {
                            return (r.thanh_vien_dat !== _new.chosen) ? REJECTED : ACCEPTED
                        }
                        return PENDING
                    })(),
                }, {
                        where: {
                            ma_chi_tiet: r.ma_chi_tiet
                        }
                    })
            }))
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
    SequelizeBookingRepo
}