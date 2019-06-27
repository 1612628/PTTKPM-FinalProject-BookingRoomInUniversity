import { Ticket } from '../models/ticket'

export const getTickets = (n, options) => {
    let tickets = [];
    while (tickets.length < 10) {
        tickets.push(new Ticket(
            tickets.length + 1,
            `Ve 2D loai ${tickets.length + 1}`,
            (Math.floor(Math.random() * 5) + 4) * 10000,
            Math.floor(Math.random() * 2) + 1
        ));
    }
    return tickets
}