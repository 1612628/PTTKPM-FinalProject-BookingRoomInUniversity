const PENDING = 1
const ACCEPTED = 2
const REJECTED = 3

class SequelizeLectureTimeRepo {
    constructor(sequelizeModels) {
        this.lectureTimes = sequelizeModels.tiet_hoc
        this.bookings = sequelizeModels.chi_tiet_dat_phong
        this.Op = sequelizeModels.Sequelize.Op
    }

    fetchByRoomId(room, options) {
        let date = null
        if (options.date) {
            let endOfDate = new Date(options.date)
            endOfDate.setHours(23, 59, 59)
            let startOfDate = new Date(options.date)
            startOfDate.setHours(0, 0, 0)
            date = {
                ngay_dat: {
                    [this.Op.lte]: endOfDate,
                    [this.Op.gte]: startOfDate
                }
            }
        }

        return this.lectureTimes.findAll({
        }).then(result => Promise.all(result.map(async r => {
            return this.bookings.findAll({
                where: {
                    phong_dat: room,
                    tiet_bat_dau: {
                        [this.Op.lte]: r.ma_tiet_hoc
                    },
                    ...(date && date),
                    tiet_ket_thuc: {
                        [this.Op.gte]: r.ma_tiet_hoc
                    }
                }
            }).then(result => {
                if (result.length === 0) {
                    return ({
                        id: r.ma_tiet_hoc,
                        start: r.gio_bat_dau,
                        end: r.gio_ket_thuc,
                        status: null,
                        members: [],
                        chosenMember: null
                    })
                } else {
                    const members = result.map(r => ({
                        id: r.thanh_vien_dat,
                        start: r.tiet_bat_dau,
                        end: r.tiet_ket_thuc,
                        bookingId: r.ma_chi_tiet,
                        roomId: r.phong_dat,
                        date: r.ngay_dat
                    }))
                    const chosen = result.filter(r => r.tinh_trang === ACCEPTED)
                    if (chosen.length > 1) {
                        throw new Error('!!!!!! 2 ACCEPTED BOOKING IN 1 TIME !!!!!!!')
                    }
                    return ({
                        id: r.ma_tiet_hoc,
                        start: r.gio_bat_dau,
                        end: r.gio_ket_thuc,
                        status: chosen.length === 0 ? 'Cho duyet' : 'Da duyet',
                        members: members,
                        chosenMember: chosen.length === 0 ? null : chosen[0].thanh_vien_dat
                    })
                }
            })
        })).then(lectureTimes => {
            return {
                ok: true,
                msg: lectureTimes
            }
        })).catch(err => {
            return {
                ok: false,
                msg: err
            }
        })
    }

    updateOne(_old, _new) {

    }
}

module.exports = {
    SequelizeLectureTimeRepo
}