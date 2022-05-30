import db from "./../db.js";

export async function selectAllGames() {
    try {
        const query = `
        SELECT games.*, categories.name as "categoryName"
        FROM games INNER JOIN categories
        ON games."categoryId" = categories.id; 
        `;

        const result = await db.query(query);
        return result.rows;

    } catch (e) {
        throw e;
    }
}

export async function selectGamesByName(filter) {
    const nameFilter = `${filter}%`;

    try {
        const query = `
        SELECT games.*, categories.name as "categoryName"
        FROM games INNER JOIN categories
        ON games."categoryId" = categories.id 
        WHERE games.name ILIKE $1; 
        `;

        const values = [nameFilter];

        const result = await db.query(query, values);

        return result.rows;

    } catch (e) {
        throw e;
    }
}