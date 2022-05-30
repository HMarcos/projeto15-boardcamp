import { insertGame, selectAllGames, selectGamesByName } from "../services/gamesService.js";

import { debug, error } from "../logging/logging.js";

export async function getGames(req, res) {
    const queryString = req.query.name;
    let games = null;

    try {
        if (queryString) {
            games = await selectGamesByName(queryString);
        }
        else {
            games = await selectAllGames();
        }

        console.log(debug('Games retrived successfully...'));
        return res.send(games);

    } catch (e) {
        console.log(error("Database server internal error...\n"), e);
        return res.sendStatus(500);
    }
};

export async function setGame(req, res) {
    const game = req.body;

    try {
        await insertGame(game);
        console.log(debug("Game inserted successfully...\n"));
        res.sendStatus(201);

    } catch (e) {
        console.log(error("Database server internal error...\n"), e);
        return res.sendStatus(500);
    }
}