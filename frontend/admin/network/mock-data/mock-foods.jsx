import { Food } from '../models/food'

export const getFoods = (n, options) => {
    let foods = [];
    while (foods.length < n) {
        foods.push(new Food(
            foods.length + 1,
            `Bap rang bo ${foods.length + 1}`,
            (foods.length + 1) * 10000,
            Math.floor(Math.random() * 2) + 1
        ));
    }
    return foods
}