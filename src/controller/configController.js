'use strict'

const { query } = require('../db/query');
const { status, successMessage, errorMessage } = require('../helpers/payload');

module.exports = {
    getUnit: async (req, res) => {
        try {
            const { rows } = await query(`SELECT * FROM units WHERE is_delete = false`);
            successMessage.data = rows;
            res.send(successMessage);
        } catch (error) {
            errorMessage.message = 'Gagal mengambil data';
            errorMessage.error = error;
            res.status(status.error).send(errorMessage);
        }
    },

    addUnit: async (req, res) => {
        const { name } = req.body;
        try {
            const { rows } = await query(`INSERT INTO units (name) 
                VALUES ($1) RETURNING *`,
                [name]
            )

            const dbResponse = rows[0];

            successMessage.data = dbResponse;
            successMessage.message = 'Berhasil menambahkan unit';
            res.status(status.created).send(successMessage);
        } catch (error) {
            errorMessage.message = 'Gagal menambahkan unit';
            errorMessage.error = error;
            res.status(status.error).send(errorMessage);
        }
    },

    deleteUnit: async (req, res) => {
        const id = req.params.id;
        try {
            const del = await query(
                `UPDATE units SET is_delete = true
                WHERE id=$1
                RETURNING *`,
                [id]
            )

            successMessage.message = 'Berhasil menghapus unit';
            res.status(status.success).send(successMessage);
        } catch (error) {
            errorMessage.message = 'Gagal menghapus unit';
            errorMessage.error = error;
            res.status(status.error).send(errorMessage);
        }
    },
}