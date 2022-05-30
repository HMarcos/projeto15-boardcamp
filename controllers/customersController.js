import { insertCustomer, selectAllCustomers, selectCustomersByCpf, selectCustomersById } from "../services/customersService.js";

import { debug, error } from "../logging/logging.js";

export async function getCustomers(req, res) {
    const queryString = req.query.cpf;

    let customers = null;

    try {
        if (queryString) {
            customers = await selectCustomersByCpf(queryString);
        } else {
            customers = await selectAllCustomers();
        }

        console.log(debug('Customers retrived successfully...\n'));
        return res.send(customers);

    } catch (e) {
        console.log(error("Database server internal error...\n"), e);
        return res.sendStatus(500);
    }
};

export async function getCustomer(req, res) {
    const customerId = parseInt(req.params.id);

    try {
        const customer = await selectCustomersById(customerId);

        if (customer === null) {
            console.log(error("Customer not foud..."));
            return res.status(404).send("Customer not foud");
        }
        else {
            console.log(debug('Customer retrived successfully...\n'));
            return res.send(customer);
        }

    } catch (e) {
        console.log(error("Database server internal error...\n"), e);
        return res.sendStatus(500);
    }
};

export async function setCustomer(req, res) {
    const customer = req.body;

    try {
        await insertCustomer(customer);
        console.log(debug("Customer inserted successfully...\n"));
        res.sendStatus(201);

    } catch (e) {
        console.log(error("Database server internal error...\n"), e);
        return res.sendStatus(500);
    }
};