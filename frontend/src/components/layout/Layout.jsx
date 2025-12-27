import React from 'react';
import { Sidebar } from './Sidebar';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, List, PieChart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../ui/ThemeToggle';

export function Layout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Sidebar />

            {/* Mobile Header */}
            <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between sticky top-0 z-20">
                <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                    Expensify
                </h1>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 dark:text-gray-400">
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-10 bg-gray-800/50 pt-16" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="bg-white dark:bg-gray-900 w-64 h-full p-4 shadow-xl" onClick={e => e.stopPropagation()}>
                        <nav className="space-y-1">
                            {[
                                { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
                                { icon: PlusCircle, label: 'Add Expense', to: '/add-expense' },
                                { icon: List, label: 'Expense List', to: '/expenses' },
                                { icon: PieChart, label: 'Statistics', to: '/statistics' },
                            ].map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    onClick={() => setIsMobileMenuOpen(false)}
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
                    </div>
                </div>
            )}

            <main className="md:pl-64 p-4 md:p-8 max-w-[1600px] mx-auto">
                {children}
            </main>
        </div>
    );
}
