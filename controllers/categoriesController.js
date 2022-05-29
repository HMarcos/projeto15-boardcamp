import { debug, error } from "../logging/logging.js";
import { selectAllCategories } from "../services/categoriesService.js";

export async function getCategories(req, res){
    try {
        const categories = await selectAllCategories();
        console.log(debug("Categories retrieved successfully...\n"), categories);
        return res.send(categories);

    } catch (e) {
        console.log(error("Database server internal error...\n"), e);
        return res.sendStatus(500);
    }
}