import React, { useState, useEffect } from 'react';
import { OreCosts } from '../types';
import { ORE_ICONS } from '../constants';

interface PlayerOresDisplayProps {
    ores: OreCosts;
    onOresChange: (oreType: keyof OreCosts, value: number) => void;
}

const PlayerOresDisplay: React.FC<PlayerOresDisplayProps> = ({ ores, onOresChange }) => {

    const OreInput = ({ oreType, icon, value, colorClass }: { oreType: keyof OreCosts, icon: string, value: number, colorClass: string }) => {
        const [localValue, setLocalValue] = useState(value.toString());

        // Sync local state if prop changes from parent (e.g., on data import)
        useEffect(() => {
            // Only update if the parsed local value is different from the prop
            // to avoid resetting the input while the user is typing.
            if (parseInt(localValue, 10) !== value) {
                 setLocalValue(value.toString());
            }
        }, [value]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            // Allow only digits
            const sanitizedValue = e.target.value.replace(/[^0-9]/g, '');
            setLocalValue(sanitizedValue);
        };

        const handleBlur = () => {
            const numValue = parseInt(localValue, 10);
            if (!isNaN(numValue)) {
                onOresChange(oreType, Math.max(0, numValue));
            } else {
                onOresChange(oreType, 0);
            }
        };

        return (
            <div className="relative flex-shrink-0">
                <img 
                    src={icon} 
                    alt="" // Decorative, label is on the input
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none" 
                    aria-hidden="true"
                />
                <input 
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={localValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={(e) => e.target.select()}
                    className={`bg-gray-700 border border-gray-600 rounded-md w-32 py-2 pl-10 pr-2 text-base font-bold text-right shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-500 ${colorClass}`}
                    aria-label={`Current ${oreType} ore`}
                />
            </div>
        );
    };

    return (
        <div className="mb-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-center mb-4 text-gray-300">Your Current Ores</h2>
            <div className="bg-gray-800 border border-gray-700 shadow-lg rounded-lg p-3 flex flex-row flex-wrap items-center justify-center gap-2 sm:gap-4">
                <OreInput oreType="shiny" icon={ORE_ICONS.shiny} value={ores.shiny} colorClass="text-blue-300" />
                <OreInput oreType="glowy" icon={ORE_ICONS.glowy} value={ores.glowy} colorClass="text-purple-400" />
                <OreInput oreType="starry" icon={ORE_ICONS.starry} value={ores.starry} colorClass="text-yellow-500" />
            </div>
        </div>
    );
};

export default PlayerOresDisplay;