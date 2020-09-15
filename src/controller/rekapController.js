'use strict'

const { query } = require('../db/query');
const { status, successMessage, errorMessage } = require('../helpers/payload');

module.exports = {
    getRekapDayMonth: async (req, res) => {
        try {
            const { rows } = await query(
                `SELECT 1, SUM(a.qyt*(b.price_sale - b.price_buy)-a.discount)
                FROM sales AS a, items AS b 
                WHERE a.item_id = b.id AND (a.date >= current_date AND a.date <= current_date)
                UNION
                SELECT 2, SUM(a.qyt*(b.price_sale - b.price_buy)-a.discount)
                FROM sales AS a, items AS b 
                WHERE a.item_id = b.id AND 
                EXTRACT (month FROM a.date) = EXTRACT (month FROM current_date) AND 
                EXTRACT (year FROM a.date) = EXTRACT (year FROM current_date)
                ORDER BY 1`);

            const perDay = await query(
                `SELECT a.date, SUM(a.qyt*(b.price_sale - b.price_buy)-a.discount) AS profit
                FROM sales AS a, items AS b 
                WHERE a.item_id = b.id AND EXTRACT(MONTH FROM a.date) = EXTRACT(MONTH FROM now()) 
                GROUP BY a.date`);

            successMessage.data = { harian: rows[0].sum, bulanan: rows[1].sum, perHari: perDay.rows };
            res.send(successMessage);
        } catch (error) {
            errorMessage.message = 'Gagal mengambil data';
            errorMessage.error = error;
            res.status(status.error).send(errorMessage);
        }
    }
}