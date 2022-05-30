import gamesSchema from "../schemas/gamesSchema.js";
import { checkCategoryValidity, checkGameAlreadyExists } from "../services/gamesService.js";

import { error } from "../logging/logging.js";


export async function validateGame(req, res, next) {
    const game = req.body;

    const gameValidation = gamesSchema.validate(game, { abortEarly: false });

    if (gameValidation.error) {
        const validationErrors = gameValidation.error.details.map(detail => detail.message);
        console.log(error(`Validation errors: \n`), validationErrors);
        return res.status(400).send(validationErrors);
    }

    try {
        const categoryExists = await checkCategoryValidity(game.categoryId);

        if (!categoryExists) {
            console.log(error("Category doesn't exist..."));
            return res.status(400).send("Category doesn't exist...");
        }

        const gameAlreadyExists = await checkGameAlreadyExists(game.name);

        if (gameAlreadyExists) {
            console.log(error(`This game is already registered.`));
            return res.status(409).send(`This game is already registered.`);
        }

        next();
    } catch (e) {
        console.log(error("Database server internal error...\n"), e);
        return res.sendStatus(500);
    }
}