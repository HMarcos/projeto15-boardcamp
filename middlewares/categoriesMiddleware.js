import { checkCategoryAlreadyExists } from "../services/categoriesService.js";
import categoriesSchema from "../schemas/categoriesSchema.js";

import { error } from "../logging/logging.js";


export async function validateCategory(req, res, next) {
    const category = req.body;

    const categoryValidation = categoriesSchema.validate(category, { abortEarly: false });

    if (categoryValidation.error) {
        const validationErrors = categoryValidation.error.details.map(detail => detail.message);
        console.log(error(`Validation errors: \n`), validationErrors);
        return res.status(400).send(validationErrors);
    }

    try {
        const categoryAlreadyExists = await checkCategoryAlreadyExists(category.name);

        if (categoryAlreadyExists) {
            console.log(error(`This category is already registered.`));
            return res.status(409).send(`This category is already registered.`);
        }

        next();

    } catch (e) {
        console.log(error("Database server internal error...\n"), e);
        return res.sendStatus(500);
    }
}
