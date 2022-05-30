import dayjs from "dayjs";
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

export async function checkCustomerValidity(customerId) {
    try {
        const query = `
            SELECT * FROM customers WHERE id = $1;
        `;
        const values = [customerId];

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

export async function checkGameValidity(gameId) {
    try {
        const query = `
            SELECT * FROM games WHERE id = $1;
        `;
        const values = [gameId];

        const result = await db.query(query, values);

        if (result.rows.length > 0) {
            return {
                exists: true,
                game: result.rows[0]
            };
        }
        else {
            return {
                exists: false,
                game: null
            };
        }
    } catch (e) {
        throw e;
    }
};

export async function checkStockAvailability(game) {
    try {
        const query = `
        SELECT COUNT(rentals.id) as "rentedQuantity"
        FROM rentals 
        WHERE rentals."gameId" = $1 AND rentals."returnDate" IS NULL;
        `;
        const values = [game.id];

        const result = await db.query(query, values);
        const rentedQuantity = parseInt(result.rows[0].rentedQuantity);

        if (rentedQuantity >= parseInt(game.stockTotal)) {
            return false;
        }

        return true;

    } catch (e) {
        throw e;
    }
};

export async function insertRental(rental, game) {
    const { customerId, gameId, daysRented } = rental;
    const { pricePerDay } = game;
    const rentDate = dayjs().format('YYYY-MM-DD').toString();
    const originalPrice = parseInt(daysRented) * parseFloat(pricePerDay);
    const returnDate = null;
    const delayFee = null;

    try {
        const query = `
        INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
        VALUES ($1, $2, $3, $4, $5, $6, $7);
        `;

        const values = [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee];

        await db.query(query, values);

    } catch (e) {
        throw e;
    }
};

export async function checkRentalAlreadyExists(rentalId) {
    try {
        const query = `
            SELECT * FROM rentals WHERE id = $1;
        `;
        const values = [rentalId];

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

export async function checkRentalIsClosed(rentalId) {
    try {
        const query = `
            SELECT * FROM rentals WHERE id = $1 and "returnDate" IS NOT NULL;
        `;
        const values = [rentalId];

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

export async function updateRental(rentalId) {
    const returnDate = dayjs();
    let delayFee = null;

    try {
        const rental = await selectRentalWithDateInfos(rentalId);
        const { rentDate, daysRented, pricePerDay } = rental;
        
        const expectedReturnDate = dayjs(rentDate).add(parseInt(daysRented), 'day');
        
        if (returnDate.isBefore(expectedReturnDate)){
            delayFee = 0;
        }
        else {
            const daysDifference = returnDate.diff(expectedReturnDate, 'day');
            delayFee = daysDifference * parseFloat(pricePerDay);
        }

        const query = `
            UPDATE rentals
            SET "returnDate" = $1, "delayFee" = $2
            WHERE id = $3;
        `;

        const values = [returnDate.format('YYYY-MM-DD').toString(), delayFee, rentalId];

        await db.query(query, values);

    } catch (e) {
        throw e;
    }
}

export async function selectRentalWithDateInfos(rentalId) {
    try {
        const query = `
        SELECT rentals.*, games."pricePerDay"
        FROM rentals INNER JOIN games
        ON rentals."gameId" = games.id
        WHERE rentals.id = $1;
        `;

        const values = [rentalId];

        const result = await db.query(query, values);

        return result.rows[0];

    } catch (e) {
        throw e;
    }
};

export async function deleteRental(rentalId){
    try {
        const query = `
            DELETE FROM rentals WHERE id = $1;
        `;

        const values = [rentalId];

        await db.query(query, values);
        
    } catch (e) {
        throw e;
    }
}

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