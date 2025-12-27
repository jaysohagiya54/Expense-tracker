const db = require('../config/db');

// @desc    Get all expenses with filters
// @route   GET /api/expenses
const getExpenses = async (req, res, next) => {
    try {
        const { user_id, category_id, startDate, endDate } = req.query;

        let sql = 'SELECT e.*, u.name as user_name, c.name as category_name FROM Expenses e LEFT JOIN Users u ON e.user_id = u.id LEFT JOIN Categories c ON e.category_id = c.id WHERE 1=1';
        const params = [];

        if (user_id) {
            sql += ' AND e.user_id = ?';
            params.push(user_id);
        }

        if (category_id) {
            sql += ' AND e.category_id = ?';
            params.push(category_id);
        }

        if (startDate) {
            sql += ' AND e.date >= ?';
            params.push(startDate);
        }

        if (endDate) {
            sql += ' AND e.date <= ?';
            params.push(endDate);
        }

        sql += ' ORDER BY e.date DESC';

        const [rows] = await db.query(sql, params);
        res.json(rows);
    } catch (error) {
        next(error);
    }
};

// @desc    Add a new expense
// @route   POST /api/expenses
const addExpense = async (req, res, next) => {
    try {
        const { user_id, category_id, amount, date, description } = req.body;

        const sql = 'INSERT INTO Expenses (user_id, category_id, amount, date, description) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.query(sql, [user_id, category_id, amount, date, description]);

        const [newExpense] = await db.query('SELECT * FROM Expenses WHERE id = ?', [result.insertId]);

        res.status(201).json(newExpense[0]);
    } catch (error) {
        next(error);
    }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
const updateExpense = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { user_id, category_id, amount, date, description } = req.body;

        const [exists] = await db.query('SELECT * FROM Expenses WHERE id = ?', [id]);
        if (exists.length === 0) {
            res.status(404);
            throw new Error('Expense not found');
        }

        const sql = 'UPDATE Expenses SET user_id = ?, category_id = ?, amount = ?, date = ?, description = ? WHERE id = ?';
        await db.query(sql, [user_id, category_id, amount, date, description, id]);

        const [updatedExpense] = await db.query('SELECT * FROM Expenses WHERE id = ?', [id]);
        res.json(updatedExpense[0]);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
const deleteExpense = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [exists] = await db.query('SELECT * FROM Expenses WHERE id = ?', [id]);
        if (exists.length === 0) {
            res.status(404);
            throw new Error('Expense not found');
        }

        await db.query('DELETE FROM Expenses WHERE id = ?', [id]);
        res.json({ message: 'Expense deleted' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense
};
