class SequelizeBuildingRepo {
    constructor(sequelizeModels) {
        this.buildings = sequelizeModels.toa_nha
        this.campuses = sequelizeModels.co_so
    }

    fetchByCampusId(campusid) {
        if (campusid) {
            return this.campuses.findByPk(campusid)
                .then(campus => {
                    return this.buildings.findAll({
                        where: { thuoc_co_so: campus.ma_co_so }
                    })
                }).then(result => {
                    const buildings = (result.map(r => ({
                        id: r.ma_toa_nha,
                        name: r.ten_toa_nha
                    })))
                    return {
                        ok: true,
                        msg: buildings
                    }
                }).catch(err => {
                    return {
                        ok: false,
                        msg: err
                    }
                })
        } else {
            return this.buildings.findAll({
            }).then(result => {
                return result.map(r => ({
                    id: r.ma_toa_nha,
                    name: r.ten_toa_nha
                }))
            }).then(buildings => {
                return {
                    ok: true,
                    msg: buildings
                }
            }).catch(err => {
                return {
                    ok: false,
                    msg: err
                }
            })
        }
    }
}

module.exports = {
    SequelizeBuildingRepo
}