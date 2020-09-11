const { query } = require('../db/query');
const { status, successMessage, errorMessage } = require('../helpers/payload');

module.exports = {
    getBuyHistory: async (req, res) => {
        const page = req.query.page || 1;
        const perPage = 15

        const startFrom = (page - 1) * perPage;

        try {
            const count = await query(`SELECT COUNT(*) FROM buys`);
            const { rows } = await query(
                `SELECT * FROM buys ORDER BY date ASC LIMIT $1 OFFSET $2`,
                [perPage, startFrom]
            )
            successMessage.data = rows;
            successMessage.page = parseInt(page);
            successMessage.total_page = Math.ceil(parseInt(count.rows[0].count) / perPage);
            res.send(successMessage);
        } catch (error) {
            console.log(error);
        }
    },

    addBuyHistory: async (req, res) => {
        const { item_id, qyt, date } = req.body;
        try {
            const { rows } = await query(
                `INSERT INTO buys (item_id, qyt, date)
                values ($1, $2, $3)
                returning *`,
                [item_id, qyt, date]
            )

            const dbResponse = rows[0];

            successMessage.data = dbResponse;
            successMessage.message = 'Berhasil menambahkan pembelian';
            res.status(status.created).send(successMessage);
        } catch (error) {
            errorMessage.message = 'Gagal menambahkan pembelian';
            errorMessage.error = error;
            res.status(status.error).send(errorMessage);
        }
    },

    deleteBuyHistory: async (req, res) => {
        const id = req.params.id;
        try {
            const del = await query(
                `DELETE FROM buys
                WHERE id=$1
                returning *`,
                [id]
            )

            successMessage.message = 'Berhasil menghapus pembelian';
            res.status(status.success).send(successMessage);
        } catch (error) {
            errorMessage.message = 'Gagal menghapus pembelian';
            errorMessage.error = error;
            res.status(status.error).send(errorMessage);
        }
    },
}