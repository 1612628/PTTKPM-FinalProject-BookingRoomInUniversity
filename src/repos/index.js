const AdminRepo = require('./admin-repo')
const MemberRepo = require('./member-repo')
const DeviceRepo = require('./device-repo')

class SequelizeDatabase {
    constructor(models) {
        this.AdminRepo = new AdminRepo.SequelizeAdminRepo(models)
        this.MemberRepo = new MemberRepo.SequelizeMemberRepo(models)
        this.DeviceRepo = new DeviceRepo.SequelizeDeviceRepo(models)
    }
}

module.exports = {
    SequelizeDatabase
}