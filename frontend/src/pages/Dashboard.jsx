import React from 'react';
import { useSelector } from 'react-redux';
import { Card } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

export function Dashboard() {
    const { items: expenses } = useSelector((state) => state.expenses);
    const { mode: theme } = useSelector((state) => state.theme);

    // Calculate totals
    const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

    const currentMonth = new Date().getMonth();
    const currentMonthExpenses = expenses
        .filter(exp => new Date(exp.date).getMonth() === currentMonth)
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const lastMonthExpenses = expenses
        .filter(exp => new Date(exp.date).getMonth() === currentMonth - 1)
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const percentageChange = lastMonthExpenses === 0
        ? 100
        : ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;

    // Prepare chart data
    const monthlyData = expenses.reduce((acc, curr) => {
        const month = new Date(curr.date).toLocaleString('default', { month: 'short' });
        const existing = acc.find(item => item.name === month);
        if (existing) {
            existing.amount += Number(curr.amount);
        } else {
            acc.push({ name: month, amount: Number(curr.amount) });
        }
        return acc;
    }, []);

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expenses</p>
                            <h3 className="text-2xl font-bold mt-1 dark:text-gray-100">₹{totalExpenses.toFixed(2)}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                            <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Month</p>
                            <h3 className="text-2xl font-bold mt-1 dark:text-gray-100">₹{currentMonthExpenses.toFixed(2)}</h3>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-full">
                            <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Change from Last Month</p>
                            <div className="flex items-center mt-1">
                                <h3 className="text-2xl font-bold dark:text-gray-100">₹{Math.abs(currentMonthExpenses - lastMonthExpenses).toFixed(2)}</h3>
                                <span className={cn(
                                    "ml-2 flex items-center text-sm font-medium",
                                    percentageChange > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                                )}>
                                    {percentageChange > 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                                    {Math.abs(percentageChange).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-1 md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Monthly Spending</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => `₹${value}`}
                                    tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                                />
                                <Tooltip
                                    cursor={{ fill: theme === 'dark' ? '#374151' : '#f3f4f6' }}
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                                        color: theme === 'dark' ? '#f3f4f6' : '#111827'
                                    }}
                                />
                                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}
