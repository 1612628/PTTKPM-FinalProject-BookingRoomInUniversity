class SequelizeCampusRepoAdminAdapter {
    constructor(campusRepo) {
        this.repo = campusRepo
    }

    fetchAll() {
        return this.repo.getAllCampuses()
            .then(data => {
                if (!data) {
                    throw "Null data"
                }
                const campuses = data.map(r => ({
                    id: r.ma_co_so,
                    name: r.ten_co_so
                }))
                return {
                    ok: true,
                    msg: campuses
                }
            })
            .catch(err => {
                return {
                    ok: false,
                    msg: err
                }
            })
    }
}

module.exports = {
    SequelizeCampusRepoAdminAdapter
}