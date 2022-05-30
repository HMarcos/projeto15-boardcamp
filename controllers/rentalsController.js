import { insertRental, selectAllRentals, selectRentalsByCustomerId, selectRentalsByGameId } from "../services/rentalsServices.js";

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

export async function setRental(req, res) {
    const rental = req.body;
    const game = res.locals.game;

    try {
        await insertRental(rental, game);
        console.log(debug("Rental inserted successfully...\n"));
        res.sendStatus(201);

    } catch (e) {
        console.log(error("Database server internal error...\n"), e);
        return res.sendStatus(500);
    }
}