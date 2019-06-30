
class SequelizeCampusRepo {
    constructor(SequelizeModels) {
        this.campuses = SequelizeModels.co_so;
    }

    getAllCampuses() {
        return new Promise((resolver, rejector) => {
            this.campuses.findAll()
                .then(coso => {
                    if (coso) {
                        resolver(coso);
                    } else {
                        rejector(null);
                    }
                })
                .catch(err => {
                    rejector(err)
                })
        });
    }
}


module.exports = {
    SequelizeCampusRepo
}