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

export async function checkCategoryValidity(categoryId) {
    try {
        const query = `
            SELECT * FROM categories WHERE id = $1;
        `;
        const values = [categoryId];

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

export async function checkGameAlreadyExists(gameName) {
    try {
        const query = `
            SELECT * FROM games WHERE name = $1;
        `;
        const values = [gameName];

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

export async function insertGame(game){
    const {name, image, stockTotal, categoryId, pricePerDay } = game;
    try {
        const query = `
        INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
        VALUES ($1, $2, $3, $4, $5);
        `;

        const values = [name, image, stockTotal, categoryId, pricePerDay];

        await db.query(query, values);

    }catch (e) {
        throw e;
    }
}