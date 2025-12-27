import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addExpense } from '../store/slices/expenseSlice';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';

export function AddExpense() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const today = new Date().toISOString().split('T')[0];

    const onSubmit = async (data) => {
        const payload = {
            user_id: Number(data.user),
            category_id: Number(data.category),
            amount: Number(data.amount),
            date: data.date, // data.date from <input type="date"> is already YYYY-MM-DD
            description: data.description
        };
        await dispatch(addExpense(payload)).unwrap();
        navigate('/expenses');
    };

    return (
        <div className="max-w-5xl">
            <Card className="p-8">
                <h2 className="text-2xl font-bold mb-8 dark:text-gray-100">Add New Expense</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">User</label>
                            <Select
                                {...register('user', { required: 'User is required' })}
                                error={errors.user?.message}
                                placeholder="Select User"
                                options={[
                                    { value: '1', label: 'John Doe' },
                                    { value: '2', label: 'Jane Smith' },
                                ]}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                            <Select
                                {...register('category', { required: 'Category is required' })}
                                error={errors.category?.message}
                                placeholder="Select Category"
                                options={[
                                    { value: '1', label: 'Food' },
                                    { value: '2', label: 'Transport' },
                                    { value: '3', label: 'Entertainment' },
                                    { value: '4', label: 'Utilities' },
                                    { value: '5', label: 'Shopping' },
                                    { value: '6', label: 'Health' },
                                ]}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Amount (₹)</label>
                            <Input
                                type="number"
                                step="0.01"
                                {...register('amount', { required: 'Amount is required', min: { value: 0.01, message: 'Amount must be positive' } })}
                                error={errors.amount?.message}
                                placeholder="0.00"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Date</label>
                            <Input
                                type="date"
                                max={today}
                                {...register('date', {
                                    required: 'Date is required',
                                    validate: value => value <= today || 'Future dates are not allowed'
                                })}
                                error={errors.date?.message}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description (Optional)</label>
                            <Input
                                {...register('description')}
                                placeholder="What was this expense for?"
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="pt-6 flex justify-start gap-4">
                        <Button type="submit" size="lg" className="px-8">Add Expense</Button>
                        <Button type="button" variant="secondary" size="lg" onClick={() => navigate(-1)}>Cancel</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
