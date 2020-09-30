'use strict'

const { query } = require('../db/query');
const format = require('pg-format');
const { status, successMessage, errorMessage } = require('../helpers/payload');

module.exports = {
    getExpenseHistory: async (req, res) => {
        const start_date = req.query.start_date || 'now()';
        const end_date = req.query.end_date || 'now()';
        const page = req.query.page || 1;
        const perPage = req.query.per_page || 15;

        const startFrom = (page - 1) * perPage;

        try {
            const count = await query(`SELECT COUNT(*) FROM expenses WHERE (date >= $1 AND date <= $2)`,
                [start_date, end_date]);
            const { rows } = await query(
                `SELECT *
                FROM expenses
                WHERE (date >= $1 AND date <= $2) 
                ORDER BY date ASC
                LIMIT $3 OFFSET $4`,
                [start_date, end_date, perPage, startFrom]
            )
            successMessage.data = rows;
            successMessage.page = parseInt(page);
            successMessage.total_page = Math.ceil(parseInt(count.rows[0].count) / perPage);
            successMessage.total_entry = parseInt(count.rows[0].count);
            res.send(successMessage);
        } catch (error) {
            errorMessage.message = 'Gagal mengambil data';
            errorMessage.error = error;
            res.status(status.error).send(errorMessage);
        }
    },

    addExpenseHistory: async (req, res) => {
        const { body } = req.body;
        try {
            const value = [];
            if (typeof body == "string") {
                const bodyJson = JSON.parse(body);
                value.push([bodyJson.name, bodyJson.price, bodyJson.date || 'now()', bodyJson.detail]);
            } else {
                body.forEach(element => {
                    element = JSON.parse(element);
                    value.push([element.name, element.price, element.date || 'now()', element.detail]);
                });
            }
            const sqlAdd = format(`INSERT INTO expenses (name, price, date, detail) VALUES %L`, value);
            await query(sqlAdd);
            successMessage.message = 'Berhasil menambahkan pengeluaran';
            res.status(status.created).send(successMessage);
        } catch (error) {
            errorMessage.message = 'Gagal menambahkan pengeluaran';
            errorMessage.error = error;
            res.status(status.error).send(errorMessage);
        }
    },

    deleteExpenseHistory: async (req, res) => {
        const id = req.params.id;
        try {
            const del = await query(
                `DELETE FROM expenses
                WHERE id=$1
                RETURNING *`,
                [id]
            )

            successMessage.message = 'Berhasil menghapus pengeluaran';
            res.status(status.success).send(successMessage);
        } catch (error) {
            errorMessage.message = 'Gagal menghapus pengeluaran';
            errorMessage.error = error;
            res.status(status.error).send(errorMessage);
        }
    },
}