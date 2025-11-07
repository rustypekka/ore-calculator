import React from 'react';
import { OreIncomeSettings, OreCosts } from '../types';
import OreGainCalculator from './OreGainCalculator';

interface IncomeSettingsProps {
    settings: OreIncomeSettings;
    onSettingsChange: (settings: OreIncomeSettings) => void;
    monthlyIncomeBreakdown: {
        total: OreCosts;
        dailyBonus: OreCosts;
        warIncome: OreCosts;
        traderIncome: OreCosts;
        traderGemsIncome: OreCosts;
    };
}

const IncomeSettings: React.FC<IncomeSettingsProps> = ({ settings, onSettingsChange, monthlyIncomeBreakdown }) => {
    return (
        <OreGainCalculator 
            settings={settings}
            onSettingsChange={onSettingsChange}
            monthlyIncomeBreakdown={monthlyIncomeBreakdown}
         />
    );
};

export default IncomeSettings;