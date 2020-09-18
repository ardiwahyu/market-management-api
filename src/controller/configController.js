'use strict'

const format = require('pg-format');
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
        const { add, remove } = req.body;
        try {
            if (add != "") {
                const value = []
                add.split(",").forEach(element => {
                    if (element != "") {
                        value.push([element]);
                    }
                });
                const sqlAdd = format(`INSERT INTO units (name) VALUES %L RETURNING *`, value);
                await query(sqlAdd);
            }
            if (remove != "") {
                const sqlRemove = `UPDATE units SET is_delete = true WHERE id in (${remove}) RETURNING *`
                await query(sqlRemove);
            }

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