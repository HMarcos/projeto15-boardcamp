import rentalsSchema from "../schemas/rentalsSchema.js";
import {checkCustomerValidity, checkGameValidity, checkStockAvailability} from "../services/rentalsServices.js";

import { error } from "../logging/logging.js";

export async function validateRental(req, res, next) {
    const rental = req.body;

    const rentalValidation = rentalsSchema.validate(rental, { abortEarly: false });

    if (rentalValidation.error) {
        const validationErrors = rentalValidation.error.details.map(detail => detail.message);
        console.log(error(`Validation errors: \n`), validationErrors);
        return res.status(400).send(validationErrors);
    }

    try {
        const customerExists = await checkCustomerValidity(rental.customerId);

        if (!customerExists) {
            console.log(error("Customer doesn't exist..."));
            return res.status(400).send("Customer doesn't exist...");
        }

        const gameValidity = await checkGameValidity(rental.gameId);

        if (!gameValidity.exists) {
            console.log(error("Game doesn't exist..."));
            return res.status(400).send("Game doesn't exist...");
        }

        const game = gameValidity.game;

        const stockAvailability = await checkStockAvailability(game);
        if (!stockAvailability) {
            console.log(error("Product Unavailable..."));
            return res.status(400).send("Product Unavailable...");
        }

        res.locals.game = game;
        next();

    } catch (e) {
        console.log(error("Database server internal error...\n"), e);
        return res.sendStatus(500);
    }
};