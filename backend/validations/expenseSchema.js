const { z } = require('zod');

const addExpenseSchema = z.object({
    user_id: z.number().int().positive(),
    category_id: z.number().int().positive(),
    amount: z.number().positive(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD"),
    description: z.string().optional(),
});

const updateExpenseSchema = z.object({
    user_id: z.number().int().positive().optional(),
    category_id: z.number().int().positive().optional(),
    amount: z.number().positive().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD").optional(),
    description: z.string().optional(),
});

const getExpensesSchema = z.object({
    user_id: z.string().regex(/^\d+$/).transform(Number).optional(),
    category_id: z.string().regex(/^\d+$/).transform(Number).optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD").optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD").optional(),
});

module.exports = {
    addExpenseSchema,
    updateExpenseSchema,
    getExpensesSchema,
};
