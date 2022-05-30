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




