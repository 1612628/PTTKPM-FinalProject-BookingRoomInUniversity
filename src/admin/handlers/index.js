const express = require('express')
const path = require('path');
const { JwtMiddleware } = require('../middlewares/jwt-middleware')
const { UserHandlers } = require('./users')

const configRoutes = app => {
    // define new routers
    let apiRouter = express.Router()
    let viewRouter = express.Router()

    // hook view to view router
    viewRouter.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname + '/../views/index.html'))
    })

    // hook user handlers to api router
    const userHandlers = UserHandlers(app.database.AdminRepo)
    userHandlers.forEach(handler => {
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