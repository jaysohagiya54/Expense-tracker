const express = require('express');
const router = express.Router();
const {
    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense
} = require('../controllers/expenseController');

const validate = require('../middleware/validate');
const { addExpenseSchema, updateExpenseSchema, getExpensesSchema } = require('../validations/expenseSchema');

router.route('/')
    .get(validate(getExpensesSchema, 'query'), getExpenses)
    .post(validate(addExpenseSchema), addExpense);

router.route('/:id')
    .put(validate(updateExpenseSchema), updateExpense)
    .delete(deleteExpense);

module.exports = router;
