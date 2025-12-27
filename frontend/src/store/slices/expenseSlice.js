import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api';

// Async Thunks
export const fetchExpenses = createAsyncThunk(
    'expenses/fetchExpenses',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/expenses');
            // Map backend fields to frontend expectations
            return response.data.map(expense => ({
                ...expense,
                user: expense.user_name,
                category: expense.category_name
            }));
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to load expenses');
        }
    }
);

export const addExpense = createAsyncThunk(
    'expenses/addExpense',
    async (expense, { dispatch, rejectWithValue }) => {
        try {
            const response = await api.post('/expenses', expense);
            // Refresh the list to get joined data (user_name, category_name)
            dispatch(fetchExpenses());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to add expense');
        }
    }
);

export const deleteExpense = createAsyncThunk(
    'expenses/deleteExpense',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/expenses/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete expense');
        }
    }
);

export const editExpense = createAsyncThunk(
    'expenses/editExpense',
    async ({ id, updatedExpense }, { dispatch, rejectWithValue }) => {
        try {
            const response = await api.put(`/expenses/${id}`, updatedExpense);
            dispatch(fetchExpenses());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update expense');
        }
    }
);

const expenseSlice = createSlice({
    name: 'expenses',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Expenses
            .addCase(fetchExpenses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Expense
            .addCase(addExpense.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Delete Expense
            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            })
            .addCase(deleteExpense.rejected, (state, action) => {
                state.error = action.payload;
            })
            // Edit Expense
            .addCase(editExpense.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(editExpense.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export default expenseSlice.reducer;
