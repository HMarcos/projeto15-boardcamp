import db from "../db.js";

export async function selectAllCustomers() {
    try {
        const result = await db.query(`
            SELECT * FROM customers; 
        `);

        return result.rows;

    } catch (e) {
        throw e;
    }
};

export async function selectCustomersByCpf(filter) {
    const cpfFilter = `${filter}%`;

    try {
        const query = `
        SELECT *
        FROM customers 
        WHERE cpf ILIKE $1; 
        `;

        const values = [cpfFilter];

        const result = await db.query(query, values);

        return result.rows;

    } catch (e) {
        throw e;
    }
};

export async function selectCustomersById(id) {

    try {
        const query = `
        SELECT *
        FROM customers 
        WHERE id = $1; 
        `;

        const values = [id];

        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0];

    } catch (e) {
        throw e;
    }
};

export async function checkCustomerAlreadyExists(customerCpf) {
    try {
        const query = `
            SELECT * FROM customers WHERE cpf = $1;
        `;
        const values = [customerCpf];

        const result = await db.query(query, values);

        if (result.rows.length > 0) {
            return true;
        }
        else {
            return false;
        }
    } catch (e) {
        throw e;
    }
};

export async function checkCustomerforUpdate(customerCpf, customerId) {
    try {
        let query = `
            SELECT * FROM customers WHERE cpf = $1;
        `;
        let values = [customerCpf];

        let result = await db.query(query, values);

        if (result.rows.length > 0) {

            if (parseInt(result.rows[0].id) === parseInt(customerId)) {
                return true;
            } else {
                return false;
            }
        }
        else {
            return true;
        }
    } catch (e) {
        throw e;
    }
};


export async function insertCustomer(customer) {
    const { name, phone, cpf, birthday } = customer;
    try {
        const query = `
        INSERT INTO customers (name, phone, cpf, birthday)
        VALUES ($1, $2, $3, $4);
        `;

        const values = [name, phone, cpf, birthday];

        await db.query(query, values);

    } catch (e) {
        throw e;
    }
};

export async function updateCustomer(id, customer) {
    const { name, phone, cpf, birthday } = customer;
    try {
        const query = `
        UPDATE customers 
        SET name = $1, phone = $2, cpf = $3, birthday = $4
        WHERE id = $5;
        `;

        const values = [name, phone, cpf, birthday, id];

        await db.query(query, values);

    } catch (e) {
        throw e;
    }
};




