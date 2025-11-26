import React from 'react';

// Simple reusable Button component compatible with Tailwind-style classes
export function Button({ className = '', children, ...props }) {
    return (
        <button
            className={
                `inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors ` +
                `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ` +
                `disabled:opacity-50 disabled:pointer-events-none ` +
                `bg-slate-900 text-white hover:bg-slate-800 ` +
                className
            }
            {...props}
        >
            {children}
        </button>
    );
}


