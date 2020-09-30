'use strict'

const { query } = require('../db/query');
const format = require('pg-format');
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
                `SELECT a.id, b.name, a.qyt, b.price_sale, a.discount, b.price_sale*a.qyt AS price, b.price_sale*a.qyt-a.discount AS price_total, a.date, c.name AS unit
                FROM sales AS a, items AS b, units AS c
                WHERE a.item_id = b.id AND b.unit_id = c.id AND
                (a.date >= $1 AND a.date <= $2) 
                ORDER BY a.date ASC
                LIMIT $3 OFFSET $4`,
                [start_date, end_date, perPage, startFrom]
            )
            successMessage.message = 'Berhasil mengambil data';
            successMessage.data = rows;
            successMessage.page = parseInt(page);
            successMessage.total_entry = parseInt(count.rows[0].count);
            successMessage.total_page = Math.ceil(parseInt(count.rows[0].count) / perPage);
            res.send(successMessage);
        } catch (error) {
            errorMessage.message = 'Gagal mengambil data';
            errorMessage.error = error;
            res.status(status.error).send(errorMessage);
        }
    },

    addSaleHistory: async (req, res) => {
        const { body } = req.body;
        try {
            const value = [];
            if (typeof body == "string") {
                const bodyJson = JSON.parse(body);
                value.push([bodyJson.id, bodyJson.qyt, bodyJson.date || 'now()', bodyJson.discount])
            } else {
                body.forEach(element => {
                    element = JSON.parse(element);
                    value.push([element.id, element.qyt, element.date || 'now()', element.discount])
                });
            }
            const sqlAdd = format(`INSERT INTO sales (item_id, qyt, date, discount) VALUES %L`, value);
            await query(sqlAdd);
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