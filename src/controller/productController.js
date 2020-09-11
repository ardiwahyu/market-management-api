const { query } = require('../db/query');
const { status, successMessage, errorMessage } = require('../helpers/payload');

module.exports = {
    getProduct: async (req, res) => {
        try {
            const { rows } = await query(
                `SELECT * FROM items`
            )
            console.log(rows);
            res.send(rows);
        } catch (error) {
            console.log(error);
        }
    },

    addProduct: async (req, res) => {
        const { name, qyt, price_buy, price_sale, unit_id } = req.body;

        try {
            const { rows } = await query(
                `INSERT INTO items (name, qyt, price_buy, price_sale, unit_id)
                values ($1, $2, $3, $4, $5)
                returning *`,
                [name, qyt, price_buy, price_sale, unit_id]
            )

            const dbResponse = rows[0];

            successMessage.data = dbResponse;
            successMessage.message = 'successfully created product';
            return res.status(status.created).send(successMessage);
        } catch (error) {
            console.log(error);
        }
    }
}