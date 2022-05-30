import { selectAllRentals } from "../services/rentalsServices.js";

import { debug, error } from "../logging/logging.js";

export async function getRentals(req, res){
    try {
        const rentals = await selectAllRentals();
        console.log(debug("Rentals retrieved successfully...\n"));
        return res.send(rentals);

    } catch (e) {
        console.log(error("Database server internal error...\n"), e);
        return res.sendStatus(500);
    }
};