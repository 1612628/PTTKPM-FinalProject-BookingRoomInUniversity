import { DashboardOrder, Order, OrderFood, OrderTicket } from '../models/order'

export const getDashboardOrders = (n) => {
    let sampleOrder = new DashboardOrder(
        "leHauBoi",
        "02-04-19",
        "16:00",
        "384,000 VND"
    )
    return new Array(n).fill(sampleOrder)
}

export const getOrders = (n, options) => {
    let orders = [];
    while (orders.length < n) {
        let t = new Date()
        t.setHours(9, 30)
        let datetime = new Date(`2019/0${Math.floor(Math.random() * 9) + 1}/0${Math.floor(Math.random() * 9) + 1}`);
        let foods = [];
        let foodNum = Math.floor(Math.random() * 5) + 1;
        for (let i = 0; i < foodNum; i++) {
            foods.push(new OrderFood(
                1,
                Math.floor(Math.random() * 3) + 1,
            ))
        }
        let tickets = [];
        let ticketNum = Math.floor(Math.random() * 5) + 1;
        for (let i = 0; i < ticketNum; i++) {
            tickets.push(new OrderTicket(
                Math.floor(Math.random() * 3) + 1,
                new Date(t.getTime()),
                new Date(t.getTime() + 30 * 60 * 1000 * i),
                tickets.length + 1,
                tickets.length + 1,
                1
            ))
        }
        orders.push(new Order(
            orders.length + 1,
            'leHauBoi',
            datetime,
            tickets,
            foods,
            Math.floor(Math.random() * 3) + 1,
        ));
    }
    return orders
}