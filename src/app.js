class App {
    constructor(name, expressApp, database, mailerBuilder) {
        this.name = name
        this.app = expressApp
        this.database = database
        this.mailerBuilder = mailerBuilder
    }
    addComponent(component) {
        component.configApplication(this)
    }
}

module.exports = {
    App
}