import React, { useMemo } from 'react';

interface CalculatorSliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (value: number) => void;
    displayValue: React.ReactNode;
    ticks?: number[];
}

const CalculatorSlider: React.FC<CalculatorSliderProps> = ({ label, value, min, max, step = 1, onChange, displayValue, ticks }) => {
    
    const valuePercent = useMemo(() => {
        return ((value - min) / (max - min)) * 100;
    }, [value, min, max]);

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-300 text-center">{label}</label>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
                className="w-full mt-2"
                style={{ '--value-percent': `${valuePercent}%` } as React.CSSProperties}
            />
            {ticks && (
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    {ticks.map(tick => (
                        <span key={tick} className="flex-1 text-center">{tick}</span>
                    ))}
                </div>
            )}
            {displayValue}
        </div>
    );
};

export default CalculatorSlider;