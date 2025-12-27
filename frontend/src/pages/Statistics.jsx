import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import api from '../lib/api';

export function Statistics() {
    const { items: expenses } = useSelector((state) => state.expenses);
    const { mode: theme } = useSelector((state) => state.theme);
    const [selectedUser, setSelectedUser] = useState('');
    const [stats, setStats] = useState({
        topDays: [],
        momChange: 0,
        momMessage: '',
        currentMonthTotal: 0,
        previousMonthTotal: 0,
        predictedNextMonth: 0,
        predictionMessage: '',
        predictionNote: '',
        predictionConfidence: ''
    });

    // Derive users from expenses for the dropdown
    const uniqueUsers = Array.from(new Set(expenses.map(e => JSON.stringify({ id: e.user_id, name: e.user }))))
        .map(s => JSON.parse(s))
        .filter(u => u.id && u.name);

    useEffect(() => {
        const fetchStats = async () => {
            if (!selectedUser) return;

            try {
                const [topDaysRes, momRes, predRes] = await Promise.all([
                    api.get(`/stats/top-days/${selectedUser}`),
                    api.get(`/stats/monthly-change/${selectedUser}`),
                    api.get(`/stats/prediction/${selectedUser}`)
                ]);

                setStats({
                    topDays: Array.isArray(topDaysRes.data) ? topDaysRes.data : topDaysRes.data.data,
                    momChange: momRes.data.percentageChange,
                    momMessage: momRes.data.message,
                    currentMonthTotal: momRes.data.currentMonth,
                    previousMonthTotal: momRes.data.previousMonth,
                    predictedNextMonth: predRes.data.predictedAmount,
                    predictionMessage: predRes.data.message,
                    predictionNote: predRes.data.note,
                    predictionConfidence: predRes.data.confidence
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, [selectedUser]);

    const filteredExpenses = selectedUser
        ? expenses.filter(exp => exp.user_id === Number(selectedUser))
        : expenses;

    // Frontend calculation for "All Users" case (or if API fails)
    const calculateFrontendStats = () => {
        const dailySpending = filteredExpenses.reduce((acc, curr) => {
            const date = curr.date.split('T')[0];
            acc[date] = (acc[date] || 0) + Number(curr.amount);
            return acc;
        }, {});

        const topDays = Object.entries(dailySpending)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([date, amount]) => ({ date, amount }));

        const currentMonth = new Date().getMonth();
        const currentMonthTotal = filteredExpenses
            .filter(exp => new Date(exp.date).getMonth() === currentMonth)
            .reduce((acc, curr) => acc + Number(curr.amount), 0);

        const lastMonthTotal = filteredExpenses
            .filter(exp => new Date(exp.date).getMonth() === currentMonth - 1)
            .reduce((acc, curr) => acc + Number(curr.amount), 0);

        const momChange = lastMonthTotal === 0 ? 100 : ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;

        const last3MonthsTotal = filteredExpenses
            .filter(exp => {
                const expMonth = new Date(exp.date).getMonth();
                return expMonth >= currentMonth - 3 && expMonth < currentMonth;
            })
            .reduce((acc, curr) => acc + Number(curr.amount), 0);

        const predictedNextMonth = last3MonthsTotal / 3;

        return { topDays, momChange, predictedNextMonth, dailySpending };
    };

    const frontendStats = calculateFrontendStats();

    // Use API stats if user selected
    const displayStats = stats;

    // Chart data
    const chartData = Object.entries(frontendStats.dailySpending || {})
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold dark:text-gray-100">User Statistics</h2>
                <Select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    placeholder="Select a User to view stats"
                    options={uniqueUsers.map(u => ({ value: u.id, label: u.name }))}
                    className="w-full md:w-64"
                />
            </div>

            {!selectedUser ? (
                <Card className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4">
                        <TrendingUp className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">No User Selected</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                        Please select a user from the dropdown above to view their spending trends, growth, and predictions.
                    </p>
                </Card>
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                                    <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">MoM Growth</p>
                                    <h3 className="text-2xl font-bold dark:text-gray-100">
                                        {displayStats.momChange !== null ? `${Number(displayStats.momChange).toFixed(1)}%` : 'N/A'}
                                    </h3>
                                    <div className="flex flex-col gap-1 mt-1">
                                        {displayStats.currentMonthTotal !== undefined && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Current: <span className="font-semibold text-gray-900 dark:text-gray-100">₹{Number(displayStats.currentMonthTotal).toFixed(2)}</span>
                                            </p>
                                        )}
                                        {displayStats.previousMonthTotal !== undefined && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Previous: <span className="font-semibold text-gray-900 dark:text-gray-100">₹{Number(displayStats.previousMonthTotal).toFixed(2)}</span>
                                            </p>
                                        )}
                                        {displayStats.momMessage && (
                                            <p className="text-xs text-gray-400 italic">{displayStats.momMessage}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-full">
                                    <ArrowRight className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Predicted Next Month</p>
                                    <h3 className="text-2xl font-bold dark:text-gray-100">
                                        {displayStats.predictedNextMonth !== null ? `₹${Number(displayStats.predictedNextMonth).toFixed(2)}` : 'N/A'}
                                    </h3>
                                    {displayStats.predictionConfidence && (
                                        <div className="mt-1">
                                            <p className={`text-xs font-semibold uppercase tracking-wider ${displayStats.predictionConfidence === 'high' ? 'text-green-500' :
                                                displayStats.predictionConfidence === 'medium' ? 'text-blue-500' :
                                                    displayStats.predictionConfidence === 'low' ? 'text-orange-500' :
                                                        'text-gray-400'
                                                }`}>
                                                {displayStats.predictionConfidence} Confidence
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {displayStats.predictionConfidence === 'high' && "Based on a solid 3-month spending history."}
                                                {displayStats.predictionConfidence === 'medium' && "Based on 2 months of data; trends are starting to form."}
                                                {displayStats.predictionConfidence === 'low' && "Based on only 1 month of data; may not be accurate."}
                                                {displayStats.predictionConfidence === 'none' && "Not enough historical data to generate a reliable prediction."}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                                    <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Highest Spending Day</p>
                                    <h3 className="text-xl font-bold dark:text-gray-100">{displayStats.topDays[0] ? new Date(displayStats.topDays[0].date).toLocaleDateString() : 'N/A'}</h3>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="col-span-1 md:col-span-2">
                            <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Daily Spending Trend</h3>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
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
                                            labelFormatter={(date) => new Date(date).toLocaleDateString()}
                                            contentStyle={{
                                                borderRadius: '8px',
                                                border: 'none',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                                                color: theme === 'dark' ? '#f3f4f6' : '#111827'
                                            }}
                                        />
                                        <Line type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card className="col-span-1 md:col-span-2">
                            <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Top 3 Spending Days</h3>
                            <div className="space-y-4">
                                {displayStats.topDays.map((day, index) => (
                                    <div key={day.date} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center justify-center w-8 h-8 bg-white dark:bg-gray-700 rounded-full font-bold text-gray-500 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                                                {index + 1}
                                            </span>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">{new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(day.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-gray-900 dark:text-gray-100">₹{Number(day.amount || day.total_amount).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
}
