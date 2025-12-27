import { configureStore } from '@reduxjs/toolkit';
import expenseReducer from './slices/expenseSlice';
import themeReducer from './slices/themeSlice';

export const store = configureStore({
    reducer: {
        expenses: expenseReducer,
        theme: themeReducer,
    },
});
