import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../store/slices/themeSlice';
import { Button } from './Button';

export function ThemeToggle() {
    const theme = useSelector((state) => state.theme.mode);
    const dispatch = useDispatch();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleTheme())}
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? (
                <Moon className="h-5 w-5 text-gray-600 hover:text-gray-900" />
            ) : (
                <Sun className="h-5 w-5 text-yellow-400 hover:text-yellow-300" />
            )}
        </Button>
    );
}
