import db from "../db.js";

export async function selectAllCategories() {
    try {
        const result = await db.query(`
            SELECT * FROM categories; 
        `);

        return result.rows;

    } catch (e) {
        throw e;
    }
};

export async function checkCategoryAlreadyExists(categoryName) {
    try {
        const query = `
            SELECT * FROM categories WHERE name = $1;
        `;
        const values = [categoryName];

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

export async function insertCategory(category){
    try {
        const query = `
        INSERT INTO categories (name)
        VALUES ($1);
        `;
        
        const values = [category.name];

        await db.query(query, values);

    } catch (e) {
        throw e;
    }
}