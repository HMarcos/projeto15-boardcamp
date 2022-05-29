import db from "../db.js";

export async function selectAllCategories(){
    try {
        const query = await db.query(`
            SELECT * FROM categories; 
        `);

        return query.rows;
        
    } catch (e) {
        throw e;
    }
}