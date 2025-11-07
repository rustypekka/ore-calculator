import React from 'react';
import { OreCosts } from '../types';
import { ORE_ICONS } from '../constants';

interface TotalsDisplayProps {
    costs: OreCosts;
    time: {
        days: number;
        weeks: number;
        months: number;
        years: number;
    };
    monthlyIncome: OreCosts;
}

const TotalsDisplay: React.FC<TotalsDisplayProps> = ({ costs, time, monthlyIncome }) => {
    return (
        <div className="mt-10 p-4 sm:p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-yellow-400">Upgrade Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-center mb-4 text-gray-300">Net Ore Required</h3>
                    <div className="space-y-3">
                        <div className="bg-gray-700 p-3 rounded-lg flex items-center justify-between">
                             <span className="flex items-center text-base sm:text-lg font-semibold text-blue-300">
                                <img src={ORE_ICONS.shiny} alt="Shiny Ore" className="w-7 h-7 mr-2" />
                                Shiny Ore
                             </span>
                            <span className="text-xl sm:text-2xl font-bold">{costs.shiny.toLocaleString()}</span>
                        </div>
                         <div className="bg-gray-700 p-3 rounded-lg flex items-center justify-between">
                             <span className="flex items-center text-base sm:text-lg font-semibold text-purple-400">
                                <img src={ORE_ICONS.glowy} alt="Glowy Ore" className="w-7 h-7 mr-2" />
                                Glowy Ore
                            </span>
                            <span className="text-xl sm:text-2xl font-bold">{costs.glowy.toLocaleString()}</span>
                        </div>
                         <div className="bg-gray-700 p-3 rounded-lg flex items-center justify-between">
                             <span className="flex items-center text-base sm:text-lg font-semibold text-yellow-500">
                                <img src={ORE_ICONS.starry} alt="Starry Ore" className="w-7 h-7 mr-2" />
                                Starry Ore
                            </span>
                            <span className="text-xl sm:text-2xl font-bold">{costs.starry.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-center mb-4 text-gray-300">Your Monthly Income</h3>
                     <div className="space-y-3">
                        <div className="bg-gray-700 p-3 rounded-lg flex items-center justify-between">
                             <span className="flex items-center text-base sm:text-lg font-semibold text-blue-300">
                                <img src={ORE_ICONS.shiny} alt="Shiny Ore" className="w-7 h-7 mr-2" />
                                Shiny Ore
                             </span>
                            <span className="text-xl sm:text-2xl font-bold">{monthlyIncome.shiny.toLocaleString()}/mo</span>
                        </div>
                         <div className="bg-gray-700 p-3 rounded-lg flex items-center justify-between">
                             <span className="flex items-center text-base sm:text-lg font-semibold text-purple-400">
                                <img src={ORE_ICONS.glowy} alt="Glowy Ore" className="w-7 h-7 mr-2" />
                                Glowy Ore
                            </span>
                            <span className="text-xl sm:text-2xl font-bold">{monthlyIncome.glowy.toLocaleString()}/mo</span>
                        </div>
                         <div className="bg-gray-700 p-3 rounded-lg flex items-center justify-between">
                             <span className="flex items-center text-base sm:text-lg font-semibold text-yellow-500">
                                <img src={ORE_ICONS.starry} alt="Starry Ore" className="w-7 h-7 mr-2" />
                                Starry Ore
                            </span>
                            <span className="text-xl sm:text-2xl font-bold">{monthlyIncome.starry.toLocaleString()}/mo</span>
                        </div>
                    </div>
                </div>
            </div>


            <div className="mt-8 pt-6 border-t border-gray-700 text-center">
                <h3 className="text-lg sm:text-xl font-bold text-gray-300">Estimated Time to Farm All Ores</h3>
                <p className="text-2xl sm:text-3xl mt-2 font-bold text-white">
                    {time.years > 0 && `${time.years}y `}
                    {time.months > 0 && `${time.months}m `}
                    {time.weeks > 0 && `${time.weeks}w `}
                    {time.days > 0 && `${time.days}d`}
                    {time.years === 0 && time.months === 0 && time.weeks === 0 && time.days === 0 && "0d"}
                </p>
                <p className="text-sm text-gray-500 mt-1">(Based on your configured monthly income)</p>
            </div>
        </div>
    );
};

export default TotalsDisplay;