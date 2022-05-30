import { debug, error } from "../logging/logging.js";
import { insertCategory, selectAllCategories } from "../services/categoriesService.js";

export async function getCategories(req, res){
    try {
        const categories = await selectAllCategories();
        console.log(debug("Categories retrieved successfully...\n"));
        return res.send(categories);

    } catch (e) {
        console.log(error("Database server internal error...\n"), e);
        return res.sendStatus(500);
    }
}

export async function setCategory(req, res){
    const category = req.body;

    try {
        await insertCategory(category);
        console.log(debug("Category inserted successfully...\n"), category);
        res.sendStatus(201);
        
    } catch (e) {
        console.log(error("Database server internal error...\n"), e);
        return res.sendStatus(500);
    }
}