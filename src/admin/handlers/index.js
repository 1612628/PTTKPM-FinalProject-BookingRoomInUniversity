const express = require('express')
const path = require('path');
const { JwtMiddleware } = require('../middlewares/jwt-middleware')
const { AuthorizationHandlers } = require('./authorizations')
const { AdminHandlers } = require('./admins')
const { MemberHandlers } = require('./members')
const { DeviceHandlers } = require('./devices')

const configRoutes = app => {
    // define new routers
    let apiRouter = express.Router()
    let viewRouter = express.Router()

    // hook view to view router
    viewRouter.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname + '/../views/index.html'))
    })

    // hook authorization handlers to api router
    const authHandlers = AuthorizationHandlers(app.database.AdminRepo)
    authHandlers.forEach(handler => {
        if (handler.sercure) {
            apiRouter[handler.method](handler.path, JwtMiddleware, handler.handler)
        } else {
            apiRouter[handler.method](handler.path, handler.handler)
        }
    })

    // hook admin handlers to api router
    const adminHandlers = AdminHandlers(app.database.AdminRepo)
    adminHandlers.forEach(handler => {
        apiRouter[handler.method](handler.path, JwtMiddleware, handler.handler)
    })

    // hook member handlers to api router
    const memberHandlers = MemberHandlers(app.database.MemberRepo)
    memberHandlers.forEach(handler => {
        apiRouter[handler.method](handler.path, JwtMiddleware, handler.handler)
    })

    // hook device handlers to api router
    const deviceHandlers = DeviceHandlers(app.database.DeviceRepo)
    deviceHandlers.forEach(handler => {
        apiRouter[handler.method](handler.path, JwtMiddleware, handler.handler)
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