import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteExpense, editExpense } from '../store/slices/expenseSlice';
import { Card } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Trash2, Edit2, Check, X, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { ConfirmationModal } from '../components/ui/Modal';

export function ExpenseList() {
    const { items: expenses } = useSelector((state) => state.expenses);
    const dispatch = useDispatch();
    const [filterUser, setFilterUser] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
    const today = new Date().toISOString().split('T')[0];

    // Editing state
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        user_id: '',
        category_id: '',
        amount: '',
        date: '',
        description: ''
    });

    // Delete confirmation state
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const handleEdit = (expense) => {
        setEditingId(expense.id);
        setEditForm({
            user_id: expense.user_id.toString(),
            category_id: expense.category_id.toString(),
            amount: expense.amount.toString(),
            date: expense.date.split('T')[0],
            description: expense.description || ''
        });
    };

    const handleCancel = () => {
        setEditingId(null);
    };

    const handleSave = async (id) => {
        if (editForm.date > today) {
            alert('Future dates are not allowed');
            return;
        }
        const updatedExpense = {
            user_id: Number(editForm.user_id),
            category_id: Number(editForm.category_id),
            amount: Number(editForm.amount),
            date: editForm.date,
            description: editForm.description
        };
        await dispatch(editExpense({ id, updatedExpense })).unwrap();
        setEditingId(null);
    };

    const handleDelete = async () => {
        if (deleteConfirmId) {
            await dispatch(deleteExpense(deleteConfirmId)).unwrap();
            setDeleteConfirmId(null);
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" />;
        return sortConfig.direction === 'asc' ?
            <ArrowUp className="w-4 h-4 ml-1" /> :
            <ArrowDown className="w-4 h-4 ml-1" />;
    };

    const processedExpenses = [...expenses]
        .filter(expense => {
            const matchUser = filterUser ? expense.user === filterUser : true;
            const matchCategory = filterCategory ? expense.category === filterCategory : true;
            const expenseDate = new Date(expense.date);

            let matchStartDate = true;
            if (dateRange.start) {
                const startDate = new Date(dateRange.start);
                startDate.setHours(0, 0, 0, 0);
                matchStartDate = expenseDate >= startDate;
            }

            let matchEndDate = true;
            if (dateRange.end) {
                const endDate = new Date(dateRange.end);
                endDate.setHours(23, 59, 59, 999);
                matchEndDate = expenseDate <= endDate;
            }

            return matchUser && matchCategory && matchStartDate && matchEndDate;
        })
        .sort((a, b) => {
            const { key, direction } = sortConfig;
            let aValue = a[key];
            let bValue = b[key];

            if (key === 'amount') {
                aValue = Number(aValue);
                bValue = Number(bValue);
            } else if (key === 'date') {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            } else {
                aValue = String(aValue).toLowerCase();
                bValue = String(bValue).toLowerCase();
            }

            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
        });

    const userOptions = [
        { value: '1', label: 'John Doe' },
        { value: '2', label: 'Jane Smith' },
    ];

    const categoryOptions = [
        { value: '1', label: 'Food' },
        { value: '2', label: 'Transport' },
        { value: '3', label: 'Entertainment' },
        { value: '4', label: 'Utilities' },
        { value: '5', label: 'Shopping' },
        { value: '6', label: 'Health' },
    ];

    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-xl font-bold mb-6 dark:text-gray-100">Expense List</h2>
                <div className="flex flex-col md:flex-row gap-4 mb-6 md:items-end">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by User</label>
                        <Select
                            value={filterUser}
                            onChange={(e) => setFilterUser(e.target.value)}
                            placeholder="All Users"
                            options={[
                                { value: 'John Doe', label: 'John Doe' },
                                { value: 'Jane Smith', label: 'Jane Smith' },
                            ]}
                            className="md:w-48"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Category</label>
                        <Select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            placeholder="All Categories"
                            options={[
                                { value: 'Food', label: 'Food' },
                                { value: 'Transport', label: 'Transport' },
                                { value: 'Entertainment', label: 'Entertainment' },
                                { value: 'Utilities', label: 'Utilities' },
                            ]}
                            className="md:w-48"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                        <Input
                            type="date"
                            max={dateRange.end || today}
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className="md:w-auto"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                        <Input
                            type="date"
                            min={dateRange.start}
                            max={today}
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className="md:w-auto"
                        />
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setFilterUser('');
                            setFilterCategory('');
                            setDateRange({ start: '', end: '' });
                            setSortConfig({ key: 'date', direction: 'desc' });
                        }}
                    >
                        Reset
                    </Button>
                </div>

                <Table wrapperClassName="h-[calc(100vh-280px)] overflow-y-auto border rounded-lg dark:border-gray-800">
                    <TableHeader className="sticky top-0 bg-white dark:bg-gray-900 z-10 shadow-sm">
                        <TableRow>
                            <TableHead className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={() => handleSort('date')}>
                                <div className="flex items-center">Date {getSortIcon('date')}</div>
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={() => handleSort('user')}>
                                <div className="flex items-center">User {getSortIcon('user')}</div>
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={() => handleSort('category')}>
                                <div className="flex items-center">Category {getSortIcon('category')}</div>
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={() => handleSort('description')}>
                                <div className="flex items-center">Description {getSortIcon('description')}</div>
                            </TableHead>
                            <TableHead className="text-right cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={() => handleSort('amount')}>
                                <div className="flex items-center justify-end">Amount {getSortIcon('amount')}</div>
                            </TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {processedExpenses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    No expenses found
                                </TableCell>
                            </TableRow>
                        ) : (
                            processedExpenses.map((expense) => (
                                <TableRow key={expense.id}>
                                    {editingId === expense.id ? (
                                        <>
                                            <TableCell>
                                                <Input
                                                    type="date"
                                                    max={today}
                                                    value={editForm.date}
                                                    onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                                    className="w-32"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={editForm.user_id}
                                                    onChange={(e) => setEditForm({ ...editForm, user_id: e.target.value })}
                                                    options={userOptions}
                                                    className="w-32"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={editForm.category_id}
                                                    onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value })}
                                                    options={categoryOptions}
                                                    className="w-32"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    value={editForm.description}
                                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                    placeholder="Description"
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={editForm.amount}
                                                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                                                    className="w-24 ml-auto text-right"
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-green-600" onClick={() => handleSave(expense.id)}>
                                                        <Check className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-red-600" onClick={handleCancel}>
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell className="dark:text-gray-300">{new Date(expense.date).toLocaleDateString()}</TableCell>
                                            <TableCell className="dark:text-gray-300">{expense.user}</TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                    {expense.category}
                                                </span>
                                            </TableCell>
                                            <TableCell className="dark:text-gray-300">{expense.description}</TableCell>
                                            <TableCell className="text-right font-medium dark:text-gray-100">₹{Number(expense.amount).toFixed(2)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(expense)}>
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => setDeleteConfirmId(expense.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            <ConfirmationModal
                isOpen={!!deleteConfirmId}
                onClose={() => setDeleteConfirmId(null)}
                onConfirm={handleDelete}
                title="Delete Expense"
                message="Are you sure you want to delete this expense? This action cannot be undone."
                confirmText="Delete"
                variant="danger"
            />
        </div>
    );
}

