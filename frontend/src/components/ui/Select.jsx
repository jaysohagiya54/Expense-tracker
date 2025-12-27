import React from 'react';
import { cn } from '../../lib/utils';

export const Select = React.forwardRef(({ className, options, error, placeholder, ...props }, ref) => {
    return (
        <div className="w-full">
            <select
                ref={ref}
                className={cn(
                    "flex h-10 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
                    error && "border-red-500 focus:ring-red-500",
                    className
                )}
                {...props}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
});
Select.displayName = "Select";
