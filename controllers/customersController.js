import dayjs from "dayjs";

import { insertCustomer, selectAllCustomers, selectCustomersByCpf, selectCustomersById, updateCustomer } from "../services/customersService.js";

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
        let customer = await selectCustomersById(customerId);

        if (customer === null) {
            console.log(error("Customer not found..."));
            return res.status(404).send("Customer not found");
        }
        else {
            console.log(debug('Customer retrived successfully...\n'));
            const formatedBirthday = dayjs(customer.birthday).format('YYYY-MM-DD').toString();
            customer = {
                ...customer,
                birthday: formatedBirthday
            }
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

export async function changeCustomer(req, res) {
    const customerId = parseInt(req.params.id);
    const newCustomer = req.body;

    try {
        const customer = await selectCustomersById(customerId);

        if (customer === null) {
            console.log(error("Customer not found..."));
            return res.status(404).send("Customer not found");
        }
        
        await updateCustomer(customerId, newCustomer);
        
        console.log(debug('Customer updated successfully...\n'));
        return res.sendStatus(200);


    } catch (e) {
        console.log(error("Database server internal error...\n"), e);
        return res.sendStatus(500);
    }
};