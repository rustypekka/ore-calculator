import React from 'react';
import { OreIncomeSettings, OreCosts } from '../types';
import { LEAGUES, ORE_ICONS, TRADER_ORE_PURCHASE, TRADER_GEMS_ORE_PURCHASE } from '../constants';
import CalculatorSlider from './CalculatorSlider';

interface OreGainCalculatorProps {
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

const OreGainCalculator: React.FC<OreGainCalculatorProps> = ({ settings, onSettingsChange, monthlyIncomeBreakdown }) => {

    const handleSettingChange = (key: keyof OreIncomeSettings, value: number | boolean) => {
        onSettingsChange({ ...settings, [key]: value });
    };

    const currentLeague = LEAGUES[settings.leagueIndex];
    
    const thTicks = Array.from({ length: 10 }, (_, i) => i + 8);
    const attackTicks = Array.from({ length: 8 }, (_, i) => i);
    const traderRaidTicks = [0, 1, 2];
    const traderGemsShinyTicks = [0,1,2,3,4,5];
    const traderGemsGlowyTicks = [0,1,2];
    const traderGemsStarryTicks = [0,1];

    const BreakdownRow = ({ title, ores }: { title: string, ores: OreCosts }) => (
        <div className="bg-gray-700 p-3 rounded-lg">
            <h4 className="font-bold text-gray-300 mb-2 text-center sm:text-left">{title}</h4>
            <div className="flex justify-around text-center">
                <div className="flex flex-col items-center">
                    <img src={ORE_ICONS.shiny} alt="Shiny Ore" className="w-7 h-7 mb-1" />
                    <span className="font-semibold text-blue-300">{ores.shiny.toLocaleString()}</span>
                </div>
                 <div className="flex flex-col items-center">
                    <img src={ORE_ICONS.glowy} alt="Glowy Ore" className="w-7 h-7 mb-1" />
                    <span className="font-semibold text-purple-400">{ores.glowy.toLocaleString()}</span>
                </div>
                 <div className="flex flex-col items-center">
                    <img src={ORE_ICONS.starry} alt="Starry Ore" className="w-7 h-7 mb-1" />
                    <span className="font-semibold text-yellow-500">{ores.starry.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-6 shadow-lg max-w-4xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-2 text-yellow-400">Ore Gain Calculator</h2>
            <p className="text-center text-sm text-gray-400 mb-6">Enter the details below to calculate how many ores you gain per month.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <CalculatorSlider
                    label="Current Trophies"
                    min={0}
                    max={LEAGUES.length - 1}
                    value={settings.leagueIndex}
                    onChange={(val) => handleSettingChange('leagueIndex', val)}
                    displayValue={
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <img src={currentLeague.icon} alt={currentLeague.name} className="w-10 h-10" />
                            <span className="text-lg font-semibold">{currentLeague.name}</span>
                        </div>
                    }
                />

                <CalculatorSlider
                    label="War Town Hall"
                    min={8}
                    max={17}
                    value={settings.warTownHall}
                    onChange={(val) => handleSettingChange('warTownHall', val)}
                    displayValue={
                        <div className="text-center text-lg font-semibold mt-2">
                           TH {settings.warTownHall}
                        </div>
                    }
                    ticks={thTicks}
                />
                
                <CalculatorSlider
                    label="War Attacks Per Week"
                    min={0}
                    max={7}
                    value={settings.warAttacksPerWeek}
                    onChange={(val) => handleSettingChange('warAttacksPerWeek', val)}
                    displayValue={<div className="text-center text-lg font-semibold mt-2">{settings.warAttacksPerWeek}</div>}
                    ticks={attackTicks}
                />

                <CalculatorSlider
                    label="War Win Ratio"
                    min={0}
                    max={100}
                    step={5}
                    value={settings.warWinRatio}
                    onChange={(val) => handleSettingChange('warWinRatio', val)}
                    displayValue={<div className="text-center text-lg font-semibold mt-2">{settings.warWinRatio}%</div>}
                />

                <div className="md:col-span-2 pt-4 mt-4 border-t border-gray-700">
                    <h3 className="block text-sm font-medium text-gray-300 text-center mb-4">Weekly Trader Purchases (Raid Medals)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <CalculatorSlider
                            label="Shiny Ore"
                            min={0}
                            max={2}
                            value={settings.traderShinyPurchases}
                            onChange={(val) => handleSettingChange('traderShinyPurchases', val)}
                            displayValue={
                                <div className="flex items-center justify-center gap-2 mt-2 text-lg font-semibold">
                                    <img src={ORE_ICONS.shiny} alt="Shiny Ore" className="w-6 h-6" />
                                    <span>{(settings.traderShinyPurchases * TRADER_ORE_PURCHASE.shiny).toLocaleString()}</span>
                                </div>
                            }
                            ticks={traderRaidTicks}
                        />
                        <CalculatorSlider
                            label="Glowy Ore"
                            min={0}
                            max={2}
                            value={settings.traderGlowyPurchases}
                            onChange={(val) => handleSettingChange('traderGlowyPurchases', val)}
                            displayValue={
                                <div className="flex items-center justify-center gap-2 mt-2 text-lg font-semibold">
                                    <img src={ORE_ICONS.glowy} alt="Glowy Ore" className="w-6 h-6" />
                                    <span>{(settings.traderGlowyPurchases * TRADER_ORE_PURCHASE.glowy).toLocaleString()}</span>
                                </div>
                            }
                            ticks={traderRaidTicks}
                        />
                        <CalculatorSlider
                            label="Starry Ore"
                            min={0}
                            max={2}
                            value={settings.traderStarryPurchases}
                            onChange={(val) => handleSettingChange('traderStarryPurchases', val)}
                            displayValue={
                                <div className="flex items-center justify-center gap-2 mt-2 text-lg font-semibold">
                                    <img src={ORE_ICONS.starry} alt="Starry Ore" className="w-6 h-6" />
                                    <span>{(settings.traderStarryPurchases * TRADER_ORE_PURCHASE.starry).toLocaleString()}</span>
                                </div>
                            }
                            ticks={traderRaidTicks}
                        />
                    </div>
                </div>

                 <div className="md:col-span-2 pt-4 mt-4 border-t border-gray-700">
                    <h3 className="block text-sm font-medium text-gray-300 text-center mb-4">Weekly Trader Purchases (Gems)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <CalculatorSlider
                            label="Shiny Ore"
                            min={0}
                            max={5}
                            value={settings.traderGemsShinyPurchases}
                            onChange={(val) => handleSettingChange('traderGemsShinyPurchases', val)}
                            displayValue={
                                <div className="flex items-center justify-center gap-2 mt-2 text-lg font-semibold">
                                    <img src={ORE_ICONS.shiny} alt="Shiny Ore" className="w-6 h-6" />
                                    <span>{(settings.traderGemsShinyPurchases * TRADER_GEMS_ORE_PURCHASE.shiny).toLocaleString()}</span>
                                </div>
                            }
                            ticks={traderGemsShinyTicks}
                        />
                        <CalculatorSlider
                            label="Glowy Ore"
                            min={0}
                            max={2}
                            value={settings.traderGemsGlowyPurchases}
                            onChange={(val) => handleSettingChange('traderGemsGlowyPurchases', val)}
                            displayValue={
                                <div className="flex items-center justify-center gap-2 mt-2 text-lg font-semibold">
                                    <img src={ORE_ICONS.glowy} alt="Glowy Ore" className="w-6 h-6" />
                                    <span>{(settings.traderGemsGlowyPurchases * TRADER_GEMS_ORE_PURCHASE.glowy).toLocaleString()}</span>
                                </div>
                            }
                            ticks={traderGemsGlowyTicks}
                        />
                        <CalculatorSlider
                            label="Starry Ore"
                            min={0}
                            max={1}
                            value={settings.traderGemsStarryPurchases}
                            onChange={(val) => handleSettingChange('traderGemsStarryPurchases', val)}
                            displayValue={
                                <div className="flex items-center justify-center gap-2 mt-2 text-lg font-semibold">
                                    <img src={ORE_ICONS.starry} alt="Starry Ore" className="w-6 h-6" />
                                    <span>{(settings.traderGemsStarryPurchases * TRADER_GEMS_ORE_PURCHASE.starry).toLocaleString()}</span>
                                </div>
                            }
                             ticks={traderGemsStarryTicks}
                        />
                    </div>
                    <div className="mt-6 flex items-center justify-center">
                        <input
                            type="checkbox"
                            id="freeGlowy"
                            checked={settings.traderGemsFreeGlowy}
                            onChange={(e) => handleSettingChange('traderGemsFreeGlowy', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-yellow-500 focus:ring-yellow-600"
                        />
                        <label htmlFor="freeGlowy" className="ml-2 block text-sm text-gray-300">
                            Claim 10 Free Weekly Glowy Ores
                        </label>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-xl font-bold text-center mb-4 text-gray-300">Monthly Ore Gain Breakdown</h3>
                <div className="space-y-2 max-w-md mx-auto">
                    <BreakdownRow title="Star Bonus" ores={monthlyIncomeBreakdown.dailyBonus} />
                    <BreakdownRow title="Clan Wars" ores={monthlyIncomeBreakdown.warIncome} />
                    <BreakdownRow title="Trader (Raids)" ores={monthlyIncomeBreakdown.traderIncome} />
                    <BreakdownRow title="Trader (Gems)" ores={monthlyIncomeBreakdown.traderGemsIncome} />

                    <div className="pt-3 mt-3 border-t-2 border-gray-600">
                        <div className="bg-gray-900 p-3 rounded-lg">
                             <h4 className="font-extrabold text-lg text-yellow-400 mb-2 text-center">Total Monthly Gain</h4>
                            <div className="flex justify-around text-center text-lg">
                                <div className="flex flex-col items-center">
                                    <img src={ORE_ICONS.shiny} alt="Shiny Ore" className="w-8 h-8 mb-1" />
                                    <span className="font-bold text-blue-300">{monthlyIncomeBreakdown.total.shiny.toLocaleString()}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <img src={ORE_ICONS.glowy} alt="Glowy Ore" className="w-8 h-8 mb-1" />
                                    <span className="font-bold text-purple-400">{monthlyIncomeBreakdown.total.glowy.toLocaleString()}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <img src={ORE_ICONS.starry} alt="Starry Ore" className="w-8 h-8 mb-1" />
                                    <span className="font-bold text-yellow-500">{monthlyIncomeBreakdown.total.starry.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OreGainCalculator;