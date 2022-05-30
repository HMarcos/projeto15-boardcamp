import db from "../db.js";

export async function selectAllCustomers(){
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

        if (result.rows.length === 0){
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

export async function insertCustomer(customer){
    const {name, phone, cpf, birthday } = customer;
    try {
        const query = `
        INSERT INTO customers (name, phone, cpf, birthday)
        VALUES ($1, $2, $3, $4);
        `;

        const values = [name, phone, cpf, birthday];

        await db.query(query, values);

    }catch (e) {
        throw e;
    }
};




