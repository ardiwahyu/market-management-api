'use strict'

const { query } = require('../db/query');
const { status, successMessage, errorMessage } = require('../helpers/payload');

module.exports = {
    getSaleHistory: async (req, res) => {
        const start_date = req.query.start_date || 'now()';
        const end_date = req.query.end_date || 'now()';
        const page = req.query.page || 1;
        const perPage = req.query.per_page || 15;

        const startFrom = (page - 1) * perPage;

        try {
            const count = await query(`SELECT COUNT(*) FROM sales WHERE (date >= $1 AND date <= $2)`,
                [start_date, end_date]);
            const { rows } = await query(
                `SELECT a.id, b.name, a.qyt, b.price_sale, a.discount, b.price_sale*a.qyt-a.discount AS price_total, a.date, c.name AS unit
                FROM sales AS a, items AS b, units AS c
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

    addSaleHistory: async (req, res) => {
        const { item_id, qyt, date, discount } = req.body;
        try {
            const { rows } = await query(
                `INSERT INTO sales (item_id, qyt, date, discount)
                VALUES ($1, $2, $3, $4)
                RETURNING *`,
                [item_id, qyt, date, discount]
            )

            const dbResponse = rows[0];

            successMessage.data = dbResponse;
            successMessage.message = 'Berhasil menambahkan penjualan';
            res.status(status.created).send(successMessage);
        } catch (error) {
            errorMessage.message = 'Gagal menambahkan penjualan';
            errorMessage.error = error;
            res.status(status.error).send(errorMessage);
        }
    },

    deleteSaleHistory: async (req, res) => {
        const id = req.params.id;
        try {
            const del = await query(
                `DELETE FROM sales
                WHERE id=$1
                RETURNING *`,
                [id]
            )

            successMessage.message = 'Berhasil menghapus penjualan';
            res.status(status.success).send(successMessage);
        } catch (error) {
            errorMessage.message = 'Gagal menghapus penjualan';
            errorMessage.error = error;
            res.status(status.error).send(errorMessage);
        }
    },
}