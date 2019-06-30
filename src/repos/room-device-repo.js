class SequelizeRoomDeviceRepo {
    constructor(models) {
        this.roomDevices = models.quan_ly_thiet_bi
        this.devices = models.thiet_bi
    }

    fetchByRoomId(room) {
        return this.roomDevices.findAll({
            where: {
                phong_quan_ly: room
            }
        }).then(result => Promise.all(result.map(async r => {
            const device = await this.devices.findByPk(r.thiet_bi_quan_ly)
            return {
                id: device.ma_thiet_bi,
                name: device.ten_thiet_bi,
                date: device.ngay_san_xuat,
                company: device.hang_san_xuat,
                price: device.don_gia
            }
        })).then(devices => {
            return {
                ok: true,
                msg: devices
            }
        })).catch(err => {
            return {
                ok: false,
                msg: err
            }
        })
    }

    addToRoom(device, room) {
        return this.roomDevices.findOrCreate({
            where: {
                phong_quan_ly: room,
                thiet_bi_quan_ly: device
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

    removeFromRoom(device, room) {
        return this.roomDevices.destroy({
            where: {
                phong_quan_ly: room,
                thiet_bi_quan_ly: device
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
}

module.exports = {
    SequelizeRoomDeviceRepo
}