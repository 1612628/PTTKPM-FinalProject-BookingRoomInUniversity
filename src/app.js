class App {
    constructor(name, expressApp, database) {
        this.name = name
        this.app = expressApp
        this.database = database
    }
    addComponent(component) {
        component.configApplication(this)
    }
}

module.exports = {
    App
}