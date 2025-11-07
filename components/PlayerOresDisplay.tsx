import React from 'react';
import { OreCosts } from '../types';
import { ORE_ICONS } from '../constants';

interface PlayerOresDisplayProps {
    ores: OreCosts;
    onOresChange: (oreType: keyof OreCosts, value: number) => void;
}

const PlayerOresDisplay: React.FC<PlayerOresDisplayProps> = ({ ores, onOresChange }) => {

    const handleInputChange = (oreType: keyof OreCosts, value: string) => {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue)) {
            onOresChange(oreType, Math.max(0, numValue));
        } else if (value === '') {
            onOresChange(oreType, 0);
        }
    };

    const OreInput = ({ oreType, icon, value, colorClass }: { oreType: keyof OreCosts, icon: string, value: number, colorClass: string }) => (
        <div className="flex items-center space-x-2">
            <img src={icon} alt={`${oreType} Ore`} className="w-8 h-8" />
            <input 
                type="number"
                value={value.toString()}
                onChange={(e) => handleInputChange(oreType, e.target.value)}
                onFocus={(e) => e.target.select()}
                min="0"
                className={`bg-gray-700 border border-gray-600 rounded-md w-24 sm:w-28 py-1 px-2 text-lg sm:text-xl font-bold text-center shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-500 ${colorClass}`}
                aria-label={`Current ${oreType} ore`}
            />
        </div>
    );

    return (
        <div className="mb-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-center mb-4 text-gray-300">Your Current Ores</h2>
            <div className="bg-gray-800 border border-gray-700 shadow-lg rounded-lg p-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <OreInput oreType="shiny" icon={ORE_ICONS.shiny} value={ores.shiny} colorClass="text-blue-300" />
                <OreInput oreType="glowy" icon={ORE_ICONS.glowy} value={ores.glowy} colorClass="text-purple-400" />
                <OreInput oreType="starry" icon={ORE_ICONS.starry} value={ores.starry} colorClass="text-yellow-500" />
            </div>
        </div>
    );
};

export default PlayerOresDisplay;