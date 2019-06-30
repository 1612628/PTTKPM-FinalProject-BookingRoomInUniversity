const express = require('express')
const path = require('path');
const { JwtMiddleware } = require('../middlewares/jwt-middleware')
const { AuthorizationHandlers } = require('./authorizations')
const { AdminHandlers } = require('./admins')
const { MemberHandlers } = require('./members')
const { DeviceHandlers } = require('./devices')
const { NormalRoomHandlers } = require('./normal-rooms')
const { HallRoomHandlers } = require('./hall-rooms')
const { CampusHandlers } = require('./campuses')
const { BuildingHandlers } = require('./buildings')
const { RoomHandlers } = require('./rooms')

const configRoutes = app => {
    const database = app.database
    // define new routers
    let apiRouter = express.Router()
    let viewRouter = express.Router()

    // hook view to view router
    viewRouter.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname + '/../views/index.html'))
    })

    // grouping handlers
    const handlers = []
    // authorization
    handlers.push(...AuthorizationHandlers(database.AdminRepo))
    // users
    handlers.push(...AdminHandlers(database.AdminRepo))
    handlers.push(...MemberHandlers(database.MemberRepo))
    // devices
    handlers.push(...DeviceHandlers(database.DeviceRepo))
    // rooms
    handlers.push(...NormalRoomHandlers(database.NormalRoomRepo))
    handlers.push(...HallRoomHandlers(database.HallRoomRepo))
    handlers.push(...RoomHandlers(database.RoomRepo,
        database.LectureTimeRepo,
        database.MemberRepo,
        database.BookingRepo,
        database.RoomDeviceRepo,
        app.mailerBuilder))
    // campuses
    handlers.push(...CampusHandlers(new database.CampusRepoAdminAdapter(database.CampusRepo)))
    // buildings
    handlers.push(...BuildingHandlers(database.BuildingRepo))

    // hook handlers to api router
    handlers.forEach(handler => {
        if (handler.insecure) {
            apiRouter[handler.method](handler.path, handler.handler)
        } else {
            apiRouter[handler.method](handler.path, JwtMiddleware, handler.handler)
        }
    })

    // hook api router into app
    app.app.use('/admin/api', apiRouter)

    // hook view router into app
    app.app.use('/admin', viewRouter)
    app.app.use('/admin/*', viewRouter)
}

module.exports = {
    configRoutes
}