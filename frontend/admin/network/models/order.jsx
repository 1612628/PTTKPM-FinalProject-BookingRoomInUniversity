export class DashboardOrder {
    constructor(username, date, time, total) {
        this.username = username;
        this.date = date;
        this.time = time;
        this.total = total;
    }
}

export class Order {
    constructor(id, username, datetime, tickets, foods, status) {
        this.id = id;
        this.username = username;
        this.datetime = datetime;
        this.tickets = tickets
        this.foods = foods
        this.status = status;
    }
}

export class OrderFood {
    constructor(id, quantity) {
        this.id = id
        this.quantity = quantity
    }
}

export class OrderTicket {
    constructor(theater, date, time, row, column, ticket) {
        this.theater = theater
        this.date = date
        this.time = time
        this.row = row
        this.column = column
        this.ticket = ticket
    }
}