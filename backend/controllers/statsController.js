const db = require('../config/db');

// @desc    Get top 3 spending days
// @route   GET /api/stats/top-days/:userId
const getTopSpendingDays = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const sql = `
      SELECT date, SUM(amount) as total_amount 
      FROM Expenses 
      WHERE user_id = ? 
      GROUP BY date 
      ORDER BY total_amount DESC 
      LIMIT 3
    `;

        const [rows] = await db.query(sql, [userId]);

        if (rows.length === 0) {
            return res.json({
                data: [],
                message: "No spending data available for this user"
            });
        }

        res.json(rows);
    } catch (error) {
        next(error);
    }
};

// @desc    Get monthly percentage change
// @route   GET /api/stats/monthly-change/:userId
const getMonthlyChange = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const currentMonth = new Date().getMonth() + 1;
        const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const currentYear = new Date().getFullYear();
        const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

        const sqlCurrent = `
      SELECT SUM(amount) as total 
      FROM Expenses 
      WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ?
    `;

        const sqlPrevious = `
      SELECT SUM(amount) as total 
      FROM Expenses 
      WHERE user_id = ? AND MONTH(date) = ? AND YEAR(date) = ?
    `;

        const [currResult] = await db.query(sqlCurrent, [userId, currentMonth, currentYear]);
        const [prevResult] = await db.query(sqlPrevious, [userId, previousMonth, previousYear]);

        const currentTotal = currResult[0].total || 0;
        const previousTotal = prevResult[0].total || 0;

        if (previousTotal === 0) {
            return res.json({
                currentMonth: currentTotal,
                previousMonth: previousTotal,
                percentageChange: null,
                message: "Insufficient data to calculate month-over-month change"
            });
        }

        const percentageChange = ((currentTotal - previousTotal) / previousTotal) * 100;

        res.json({
            currentMonth: currentTotal,
            previousMonth: previousTotal,
            percentageChange
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get expense prediction for next month
// @route   GET /api/stats/prediction/:userId
const getPrediction = async (req, res, next) => {
    try {
        const { userId } = req.params;

        // Get monthly totals for the last 3 months (excluding current month)
        const sql = `
            SELECT MONTH(date) as month, YEAR(date) as year, SUM(amount) as total
            FROM Expenses
            WHERE user_id = ? 
            AND date >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 3 MONTH)
            AND date < DATE_FORMAT(CURDATE(), '%Y-%m-01')
            GROUP BY year, month
            ORDER BY year DESC, month DESC
        `;

        const [rows] = await db.query(sql, [userId]);

        if (rows.length === 0) {
            return res.json({
                predictedAmount: null,
                message: "Not enough data to generate prediction"
            });
        }

        const totalSum = rows.reduce((acc, row) => acc + Number(row.total), 0);
        const monthCount = rows.length;
        const predictedAmount = totalSum / monthCount;

        if (monthCount === 1) {
            return res.json({
                predictedAmount,
                confidence: "low",
                note: "Prediction based on only 1 month of data"
            });
        }

        res.json({
            predictedAmount,
            confidence: monthCount === 3 ? "high" : "medium",
            monthsAnalyzed: monthCount
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTopSpendingDays,
    getMonthlyChange,
    getPrediction
};
