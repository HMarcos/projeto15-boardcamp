import customersSchema from "../schemas/customersSchema.js";
import { checkCustomerAlreadyExists, checkCustomerforUpdate } from "../services/customersService.js";

import { error } from "../logging/logging.js";

export async function validateCustomer(req, res, next) {
    const customer = req.body;

    const customerValidation = customersSchema.validate(customer, { abortEarly: false });

    if (customerValidation.error) {
        const validationErrors = customerValidation.error.details.map(detail => detail.message);
        console.log(error(`Validation errors: \n`), validationErrors);
        return res.status(400).send(validationErrors);
    }

    try {
        if (req.method === "POST") {
            const customerExists = await checkCustomerAlreadyExists(customer.cpf);

            if (customerExists) {
                console.log(error(`This customer is already registered.`));
                return res.status(409).send(`This customer is already registered.`);
            }
        }
        else if (req.method === "PUT") {
            const customerId = req.params.id;
            const customerAvailableforUpdate = await checkCustomerforUpdate(customer.cpf, customerId);
            if (!customerAvailableforUpdate) {
                console.log(error(`This customer is already registered.`));
                return res.status(409).send(`This customer is already registered.`);
            }
        }

        next();
    } catch (e) {
        console.log(error("Database server internal error...\n"), e);
        return res.sendStatus(500);
    }
}