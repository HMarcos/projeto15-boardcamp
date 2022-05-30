/*INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
VALUES (1, 5, '2021-06-20', 3, null, 4500, null);*/

import db from "../db.js";

export async function selectAllRentals() {
    try {
        const result = await db.query(`
        SELECT rentals.*, customers.name as customer_name, games.name as game_name, 
        games."categoryId" as game_category_id, categories.name as category_name
        FROM rentals INNER JOIN customers
            ON rentals."customerId" = customers.id
        INNER JOIN games
            ON rentals."gameId" = games.id
        INNER JOIN categories
            ON games."categoryId" = categories.id;
        `);

        const rentals = formatRentalResult(result);

        return rentals;

    } catch (e) {
        throw e;
    }
};

export async function selectRentalsByCustomerId(customerId) {
    try {
        const result = await db.query(`
        SELECT rentals.*, customers.name as customer_name, games.name as game_name, 
        games."categoryId" as game_category_id, categories.name as category_name
        FROM rentals INNER JOIN customers
            ON rentals."customerId" = customers.id
        INNER JOIN games
            ON rentals."gameId" = games.id
        INNER JOIN categories
            ON games."categoryId" = categories.id
        WHERE rentals."customerId" = $1;
        `, [customerId]);

        const rentals = formatRentalResult(result);

        return rentals;

    } catch (e) {
        throw e;
    }
};

export async function selectRentalsByGameId(gameId) {
    try {
        const result = await db.query(`
        SELECT rentals.*, customers.name as customer_name, games.name as game_name, 
        games."categoryId" as game_category_id, categories.name as category_name
        FROM rentals INNER JOIN customers
            ON rentals."customerId" = customers.id
        INNER JOIN games
            ON rentals."gameId" = games.id
        INNER JOIN categories
            ON games."categoryId" = categories.id
        WHERE rentals."gameId" = $1;
        `, [gameId]);

        const rentals = formatRentalResult(result);

        return rentals;

    } catch (e) {
        throw e;
    }
};



function formatRentalResult(result) {
    const formatedResult = [];

    for (let i = 0; i < result.rows.length; i++) {
        let rental = { ...result.rows[i] };
        let customer = {
            id: rental.customerId,
            name: rental.customer_name
        };

        let game = {
            id: rental.gameId,
            name: rental.game_name,
            categoryId: rental.game_category_id,
            categoryName: rental.category_name
        }


        delete rental.customer_name;
        delete rental.game_name;
        delete rental.game_category_id;
        delete rental.category_name;

        rental = {
            ...rental,
            customer,
            game
        }
        formatedResult.push(rental);
    }

    return formatedResult;
};
