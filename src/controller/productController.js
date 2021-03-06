'use strict'

const { query } = require('../db/query');
const { status, successMessage, errorMessage } = require('../helpers/payload');

module.exports = {
    getProduct: async (req, res) => {
        const page = req.query.page || 1;
        const perPage = req.query.perPage || 15;

        const startFrom = (page - 1) * perPage;

        try {
            const count = await query(`SELECT COUNT(*) FROM items WHERE is_delete = false`);
            const { rows } = await query(
                `SELECT a.id, a.name, a.qyt, a.price_buy, a.price_sale, b.name AS unit
                FROM items AS a, units AS b
                WHERE a.unit_id = b.id AND a.is_delete = false
                ORDER BY a.name ASC
                LIMIT $1 OFFSET $2`,
                [perPage, startFrom]
            );
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

    getAllProduct: async (req, res) => {
        try {
            const { rows } = await query(
                `SELECT a.id, a.name, a.qyt, a.price_sale, b.name AS unit
                FROM items AS a, units AS b
                WHERE a.unit_id = b.id AND a.is_delete = false
                ORDER BY a.name ASC`
            );
            successMessage.data = rows;
            res.send(successMessage);
        } catch (error) {
            errorMessage.message = 'Gagal mengambil data';
            errorMessage.error = error;
            res.status(status.error).send(errorMessage);
        }
    },

    addProduct: async (req, res) => {
        const { name, qyt, price_buy, price_sale, unit_id } = req.body;
        try {
            const { rows } = await query(
                `INSERT INTO items (name, qyt, price_buy, price_sale, unit_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *`,
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
            console.log(req.body);
            console.log(error);
        }
    },

    updateProduct: async (req, res) => {
        const id = req.params.id
        const { name, qyt, price_buy, price_sale, unit_id } = req.body;

        try {
            const update = await query(
                `UPDATE items SET (name, qyt, price_buy, price_sale, unit_id) = 
                ($1, $2, $3, $4, $5) WHERE id = $6 RETURNING *`,
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
        const name = '%' + req.query.name + '%';
        try {
            const { rows } = await query(
                `SELECT a.id, a.name, a.qyt, a.price_buy, a.price_sale, b.name AS unit
                FROM items AS a, units AS b
                WHERE a.unit_id = b.id AND a.name LIKE $1 AND a.is_delete = false
                ORDER BY a.name ASC`,
                [name]
            );
            successMessage.data = rows;
            successMessage.page = 1;
            successMessage.total_page = 1;
            successMessage.total_entry = rows.length;
            res.status(status.success).send(successMessage);
        } catch (error) {
            errorMessage.message = 'Gagal mengambil data';
            errorMessage.error = error;
            res.status(status.error).send(errorMessage);
        }
    },

    deleteProduct: async (req, res) => {
        const id = req.params.id;

        try {
            const del = await query(
                `UPDATE items SET is_delete = true WHERE id=$1 RETURNING *`,
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