'use client';

import { useState, useEffect } from 'react';

interface CurrencyInputProps {
    value: number;
    onChange: (value: number) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
    autoFocus?: boolean;
}

export default function CurrencyInput({ value, onChange, placeholder, className, required, autoFocus }: CurrencyInputProps) {
    const [displayValue, setDisplayValue] = useState('');

    useEffect(() => {
        if (value === 0 && displayValue === '') return;
        setDisplayValue(formatNumber(value));
    }, [value]);

    const formatNumber = (num: number | string) => {
        if (!num) return '';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\./g, '');
        if (!/^\d*$/.test(rawValue)) return; // Only numbers

        const numValue = parseInt(rawValue || '0', 10);
        setDisplayValue(formatNumber(rawValue));
        onChange(numValue);
    };

    return (
        <div className="relative">
             <input
                type="text"
                inputMode="numeric"
                required={required}
                autoFocus={autoFocus}
                value={displayValue}
                onChange={handleChange}
                className={className}
                placeholder={placeholder}
            />
            {displayValue && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm font-bold pointer-events-none">
                    đ
                </span>
            )}
        </div>
    );
}
