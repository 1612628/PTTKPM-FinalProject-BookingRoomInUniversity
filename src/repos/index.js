// base repos
const AdminRepo = require('./admin-repo')
const MemberRepo = require('./member-repo')
const DeviceRepo = require('./device-repo')
const NormalRoomRepo = require('./normal-room-repo')
const HallRoomRepo = require('./hall-room-repo')
const RoomRepo = require('./room-repo')
const CampusRepo = require('./campus-repo')
const BuildingRepo = require('./building-repo')
const LectureTimeRepo = require('./lecture-time-repo')
const BookingRepo = require('./booking-repo')
const RoomDeviceRepo = require('./room-device-repo')

// adapters
const CampusRepoAdminAdapter = require('../admin/adapters/campus-repo-adapter')

class SequelizeDatabase {
    constructor(models) {
        // base repos
        this.AdminRepo = new AdminRepo.SequelizeAdminRepo(models)
        this.MemberRepo = new MemberRepo.SequelizeMemberRepo(models)
        this.DeviceRepo = new DeviceRepo.SequelizeDeviceRepo(models)
        this.NormalRoomRepo = new NormalRoomRepo.SequelizeNormalRoomRepo(models)
        this.HallRoomRepo = new HallRoomRepo.SequelizeHallRoomRepo(models)
        this.RoomRepo = new RoomRepo.SequelizeRoomRepo(models, models)
        this.CampusRepo = new CampusRepo.SequelizeCampusRepo(models)
        this.BuildingRepo = new BuildingRepo.SequelizeBuildingRepo(models)
        this.LectureTimeRepo = new LectureTimeRepo.SequelizeLectureTimeRepo(models)
        this.BookingRepo = new BookingRepo.SequelizeBookingRepo(models)
        this.RoomDeviceRepo = new RoomDeviceRepo.SequelizeRoomDeviceRepo(models)

        // adapters
        this.CampusRepoAdminAdapter = CampusRepoAdminAdapter.SequelizeCampusRepoAdminAdapter
    }
}

module.exports = {
    SequelizeDatabase
}