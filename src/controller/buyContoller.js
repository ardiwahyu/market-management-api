'use strict'

const { query } = require('../db/query');
const { status, successMessage, errorMessage } = require('../helpers/payload');

module.exports = {
    getBuyHistory: async (req, res) => {
        const start_date = req.query.start_date || 'now()';
        const end_date = req.query.end_date || 'now()';
        const page = req.query.page || 1;
        const perPage = req.query.per_page || 15;

        const startFrom = (page - 1) * perPage;

        try {
            const count = await query(`SELECT COUNT(*) FROM buys WHERE (date >= $1 AND date <= $2)`,
                [start_date, end_date]);
            const { rows } = await query(
                `SELECT a.id, b.name, a.qyt, b.price_buy, b.price_buy*a.qyt AS price_total, a.date, c.name AS unit
                FROM buys AS a, items AS b, units AS c
                WHERE a.item_id = b.id AND b.unit_id = c.id AND
                (a.date >= $1 AND a.date <= $2) 
                ORDER BY a.date ASC
                LIMIT $3 OFFSET $4`,
                [start_date, end_date, perPage, startFrom]
            )
            successMessage.data = rows;
            successMessage.page = parseInt(page);
            successMessage.total_page = Math.ceil(parseInt(count.rows[0].count) / perPage);
            res.send(successMessage);
        } catch (error) {
            errorMessage.message = 'Gagal mengambil data';
            errorMessage.error = error;
            res.status(status.error).send(errorMessage);
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