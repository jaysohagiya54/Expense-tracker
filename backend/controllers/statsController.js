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

        const sql = `
      SELECT 
        YEAR(date) AS year,
        MONTH(date) AS month,
        SUM(amount) AS total
      FROM Expenses
      WHERE user_id = ?
        AND date >= DATE_SUB(DATE_FORMAT(CURDATE(), '%Y-%m-01'), INTERVAL 3 MONTH)
        AND date < DATE_FORMAT(CURDATE(), '%Y-%m-01')
      GROUP BY year, month
      ORDER BY year DESC, month DESC
    `;

        const [rows] = await db.query(sql, [userId]);

        // ❌ No data at all
        if (rows.length === 0) {
            return res.json({
                predictedAmount: null,
                confidence: "none",
                message: "No historical data available for prediction"
            });
        }

        // ✅ Calculate average
        const total = rows.reduce((sum, r) => sum + Number(r.total), 0);
        const monthsCount = rows.length;
        const predictedAmount = total / monthsCount;

        // 🎯 Confidence logic
        let confidence = "low";
        if (monthsCount === 2) confidence = "medium";
        if (monthsCount >= 3) confidence = "high";

        return res.json({
            predictedAmount,
            confidence,
            monthsAnalyzed: monthsCount
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
