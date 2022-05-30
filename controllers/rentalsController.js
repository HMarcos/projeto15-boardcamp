import { selectAllRentals, selectRentalsByCustomerId, selectRentalsByGameId } from "../services/rentalsServices.js";

import { debug, error } from "../logging/logging.js";

export async function getRentals(req, res){
    const customerId = parseInt(req.query.customerId);
    const gameId = parseInt(req.query.gameId); 

    let rentals = null;
    
    try {

        if (customerId) {
            rentals = await selectRentalsByCustomerId(customerId);
        }
        else if (gameId) {
            rentals = await selectRentalsByGameId(gameId);
        }
        else {
            rentals = await selectAllRentals();
        }

        console.log(debug("Rentals retrieved successfully...\n"));
        return res.send(rentals);

    } catch (e) {
        console.log(error("Database server internal error...\n"), e);
        return res.sendStatus(500);
    }
};