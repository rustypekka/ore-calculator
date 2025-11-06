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


    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg max-w-4xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-center mb-2 text-yellow-400">Ore Gain Calculator</h2>
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
                                    <img src={ORE_ICONS.shiny} alt="Shiny Ore" className="w-5 h-5" />
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
                                    <img src={ORE_ICONS.glowy} alt="Glowy Ore" className="w-5 h-5" />
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
                                    <img src={ORE_ICONS.starry} alt="Starry Ore" className="w-5 h-5" />
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
                                    <img src={ORE_ICONS.shiny} alt="Shiny Ore" className="w-5 h-5" />
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
                                    <img src={ORE_ICONS.glowy} alt="Glowy Ore" className="w-5 h-5" />
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
                                    <img src={ORE_ICONS.starry} alt="Starry Ore" className="w-5 h-5" />
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
                <div className="grid grid-cols-4 gap-x-4 gap-y-2 text-center text-sm sm:text-base">
                    {/* Header */}
                    <div className="font-bold text-left text-gray-400">Source</div>
                    <div className="font-bold text-gray-400 flex items-center justify-center gap-1">
                        <img src={ORE_ICONS.shiny} alt="Shiny Ore" className="w-5 h-5" /> Shiny
                    </div>
                    <div className="font-bold text-gray-400 flex items-center justify-center gap-1">
                        <img src={ORE_ICONS.glowy} alt="Glowy Ore" className="w-5 h-5" /> Glowy
                    </div>
                    <div className="font-bold text-gray-400 flex items-center justify-center gap-1">
                        <img src={ORE_ICONS.starry} alt="Starry Ore" className="w-5 h-5" /> Starry
                    </div>

                    {/* Star Bonus Row */}
                    <div className="text-left py-2">Star Bonus</div>
                    <div className="py-2">{monthlyIncomeBreakdown.dailyBonus.shiny.toLocaleString()}</div>
                    <div className="py-2">{monthlyIncomeBreakdown.dailyBonus.glowy.toLocaleString()}</div>
                    <div className="py-2">{monthlyIncomeBreakdown.dailyBonus.starry.toLocaleString()}</div>

                    {/* War Row */}
                    <div className="text-left py-2">Clan Wars</div>
                    <div className="py-2">{monthlyIncomeBreakdown.warIncome.shiny.toLocaleString()}</div>
                    <div className="py-2">{monthlyIncomeBreakdown.warIncome.glowy.toLocaleString()}</div>
                    <div className="py-2">{monthlyIncomeBreakdown.warIncome.starry.toLocaleString()}</div>

                    {/* Trader (Raids) Row */}
                    <div className="text-left py-2">Trader (Raids)</div>
                    <div className="py-2">{monthlyIncomeBreakdown.traderIncome.shiny.toLocaleString()}</div>
                    <div className="py-2">{monthlyIncomeBreakdown.traderIncome.glowy.toLocaleString()}</div>
                    <div className="py-2">{monthlyIncomeBreakdown.traderIncome.starry.toLocaleString()}</div>

                    {/* Trader (Gems) Row */}
                    <div className="text-left py-2">Trader (Gems)</div>
                    <div className="py-2">{monthlyIncomeBreakdown.traderGemsIncome.shiny.toLocaleString()}</div>
                    <div className="py-2">{monthlyIncomeBreakdown.traderGemsIncome.glowy.toLocaleString()}</div>
                    <div className="py-2">{monthlyIncomeBreakdown.traderGemsIncome.starry.toLocaleString()}</div>
                    
                    {/* Divider */}
                    <div className="col-span-4 border-t border-gray-600 my-1"></div>

                    {/* Total Row */}
                    <div className="text-left font-bold text-lg">Total</div>
                    <div className="font-bold text-lg text-blue-300">{monthlyIncomeBreakdown.total.shiny.toLocaleString()}</div>
                    <div className="font-bold text-lg text-purple-400">{monthlyIncomeBreakdown.total.glowy.toLocaleString()}</div>
                    <div className="font-bold text-lg text-yellow-500">{monthlyIncomeBreakdown.total.starry.toLocaleString()}</div>
                </div>
            </div>
        </div>
    );
};

export default OreGainCalculator;