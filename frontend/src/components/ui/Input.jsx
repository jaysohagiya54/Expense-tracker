import React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef(({ className, error, ...props }, ref) => {
    return (
        <div className="w-full">
            <input
                ref={ref}
                className={cn(
                    "flex h-10 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
                    error && "border-red-500 focus:ring-red-500",
                    className
                )}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
});
Input.displayName = "Input";
