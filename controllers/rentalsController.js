import { deleteRental, insertRental, selectAllRentals, selectRentalsByCustomerId, selectRentalsByGameId, updateRental } from "../services/rentalsServices.js";

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
};

export async function setReturnRental(req, res) {
    const rentalId = req.params.id;

    try {
        await updateRental(rentalId);
        console.log(debug("Return rental updated successfully...\n"));
        res.sendStatus(200);

    } catch (e) {
        console.log(error("Database server internal error...\n"), e);
        return res.sendStatus(500);
    }
};

export async function excludeRental(req, res) {
    const rentalId = req.params.id;
    
    try {
        await deleteRental(rentalId);
        console.log(debug("Rental deleted successfully...\n"));
        res.sendStatus(200);

    } catch (e) {
        console.log(error("Database server internal error...\n"), e);
        return res.sendStatus(500);
    }
}