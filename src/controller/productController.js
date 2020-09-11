const { query } = require('../db/query');
const { status, successMessage, errorMessage } = require('../helpers/payload');

module.exports = {
    getProduct: async (req, res) => {
        try {
            const { rows } = await query(
                `SELECT * FROM items ORDER BY name ASC`
            )
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
            successMessage.message = 'Berhasil menambahkan produk';
            res.status(status.created).send(successMessage);
        } catch (error) {
            errorMessage.message = 'Gagal menambahkan produk';
            errorMessage.error = error;
            res.status(status.error).send(errorMessage);
        }
    },

    updateProduct: async (req, res) => {
        const id = req.params.id
        const { name, qyt, price_buy, price_sale, unit_id } = req.body;

        try {
            const update = await query(
                `UPDATE items SET (name, qyt, price_buy, price_sale, unit_id) = 
                ($1, $2, $3, $4, $5) WHERE id = $6 returning *`,
                [name, qyt, price_buy, price_sale, unit_id, id]
            );
            successMessage.message = 'Berhasil memperbarui produk';
            res.status(status.success).send(successMessage);
        } catch (error) {
            errorMessage.message = 'Gagal memperbarui produk';
            errorMessage.error = error;
            res.status(status.error).send(errorMessage);
        }
    },

    searchProduct: async (req, res) => {
        const name = req.query.name;

        try {
            const { rows } = await query(
                `SELECT * FROM items WHERE name = $1`,
                [name]
            );
            res.send(rows);
        } catch (error) {
            console.log(error);
        }
    },

    deleteProduct: async (req, res) => {
        const id = req.params.id;

        try {
            const del = await query(
                `DELETE FROM items WHERE id=$1 returning *`,
                [id]
            );
            successMessage.message = 'Berhasil menghapus produk';
            res.status(status.success).send(successMessage);
        } catch (error) {
            errorMessage.message = 'Gagal menghapus produk';
            errorMessage.error = error;
            res.status(status.error).send(errorMessage);
        }
    }
}