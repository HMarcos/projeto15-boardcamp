import { selectAllGames, selectGamesByName } from "../services/gamesService.js";

import { debug } from "../logging/logging.js";

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
}