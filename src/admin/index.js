const handlers = require('./handlers')

class Admin {
    configApplication(app) {
        handlers.configRoutes(app)
    }
}

module.exports = {
    Admin
}