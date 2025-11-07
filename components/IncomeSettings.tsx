import React from 'react';
import { OreIncomeSettings, OreCosts } from '../types';
import OreGainCalculator from './OreGainCalculator';
import PlayerOresDisplay from './PlayerOresDisplay';

interface IncomeSettingsProps {
    settings: OreIncomeSettings;
    onSettingsChange: (settings: OreIncomeSettings) => void;
    monthlyIncomeBreakdown: {
        total: OreCosts;
        dailyBonus: OreCosts;
        warIncome: OreCosts;
        traderIncome: OreCosts;
        traderGemsIncome: OreCosts;
        otherIncome: OreCosts;
    };
    playerOres: OreCosts;
    onOresChange: (oreType: keyof OreCosts, value: number) => void;
}

const IncomeSettings: React.FC<IncomeSettingsProps> = ({ settings, onSettingsChange, monthlyIncomeBreakdown, playerOres, onOresChange }) => {
    return (
        <>
            <PlayerOresDisplay ores={playerOres} onOresChange={onOresChange} />
            <OreGainCalculator 
                settings={settings}
                onSettingsChange={onSettingsChange}
                monthlyIncomeBreakdown={monthlyIncomeBreakdown}
            />
        </>
    );
};

export default IncomeSettings;