export class DashboardTheater {
    constructor(name, address, ordered, capacity) {
        this.name = name;
        this.address = address;
        this.ordered = ordered;
        this.capacity = capacity;
    }
}

export class Theater {
    constructor(id, name, address, row, column, status) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.row = row;
        this.column = column;
        this.status = status;
    }
}

export class TheaterShowTime {
    constructor(id, time, movie, ticket, ordered) {
        this.id = id
        this.time = time
        this.movie = movie
        this.ticket = ticket
        this.ordered = ordered
    }
}