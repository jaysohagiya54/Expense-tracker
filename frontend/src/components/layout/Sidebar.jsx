import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, List, PieChart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../ui/ThemeToggle';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
    { icon: PlusCircle, label: 'Add Expense', to: '/add-expense' },
    { icon: List, label: 'Expense List', to: '/expenses' },
    { icon: PieChart, label: 'Statistics', to: '/statistics' },
];

export function Sidebar() {
    return (
        <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen fixed left-0 top-0 overflow-y-auto z-10">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                    Expensify
                </h1>
                <ThemeToggle />
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                            )
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase mb-1">Pro Tip</p>
                    <p className="text-xs text-blue-800 dark:text-blue-300">Track your daily expenses to save more!</p>
                </div>
            </div>
        </aside>
    );
}
