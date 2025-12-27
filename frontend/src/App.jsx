import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { AddExpense } from './pages/AddExpense';
import { ExpenseList } from './pages/ExpenseList';
import { Statistics } from './pages/Statistics';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchExpenses } from './store/slices/expenseSlice';

function App() {
  const theme = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/expenses" element={<ExpenseList />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
