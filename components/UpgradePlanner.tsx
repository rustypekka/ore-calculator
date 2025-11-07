import React, { useState } from 'react';
import { EquipmentPlan, OreCosts } from '../types';
import PlayerOresDisplay from './PlayerOresDisplay';
import PlayerTagInput from './PlayerTagInput';
import EquipmentCard from './EquipmentCard';
import TotalsDisplay from './TotalsDisplay';

interface UpgradePlannerProps {
    plans: EquipmentPlan[];
    playerOres: OreCosts;
    heroes: string[];
    onUpdatePlan: (id: number, updatedPlan: Partial<EquipmentPlan>) => void;
    onOresChange: (oreType: keyof OreCosts, value: number) => void;
    onImportData: (playerTag: string) => void;
    isLoading: boolean;
    error: string | null;
    netCosts: OreCosts;
    timeToFarm: { days: number; weeks: number; months: number; years: number; };
    monthlyOreIncome: OreCosts;
}

const UpgradePlanner: React.FC<UpgradePlannerProps> = ({
    plans,
    playerOres,
    heroes,
    onUpdatePlan,
    onOresChange,
    onImportData,
    isLoading,
    error,
    netCosts,
    timeToFarm,
    monthlyOreIncome
}) => {
    const [openHero, setOpenHero] = useState<string | null>(null);

    const toggleHero = (heroName: string) => {
        setOpenHero(prevOpenHero => (prevOpenHero === heroName ? null : heroName));
    };

    return (
        <>
            <PlayerOresDisplay ores={playerOres} onOresChange={onOresChange} />
            <PlayerTagInput onImport={onImportData} isLoading={isLoading} error={error} />
            <main className="mt-8">
                {heroes.map(hero => {
                    const heroPlans = plans.filter(p => p.equipment.hero === hero);
                    if (heroPlans.length === 0) return null;

                    const isOpen = openHero === hero;
                    const heroId = hero.replace(/\s+/g, '-');

                    return (
                        <div key={hero} className="mb-4 bg-black bg-opacity-20 rounded-xl overflow-hidden transition-all duration-300">
                            <button
                                onClick={() => toggleHero(hero)}
                                className="w-full flex justify-between items-center p-4 text-left focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                                aria-expanded={isOpen}
                                aria-controls={`hero-section-${heroId}`}
                            >
                                <h2 
                                    className="text-2xl sm:text-3xl font-bold text-white" 
                                    style={{
                                        textShadow: '3px 3px 0px rgba(0,0,0,0.7), 0 0 15px rgba(255,255,255,0.5)'
                                    }}
                                >
                                    {hero}
                                </h2>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-8 w-8 text-white transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            
                            <div
                                id={`hero-section-${heroId}`}
                                className={`transition-all duration-500 ease-in-out grid ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                            >
                                <div className="overflow-hidden">
                                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                        {heroPlans.map(plan => (
                                            <EquipmentCard
                                                key={plan.id}
                                                plan={plan}
                                                onUpdate={onUpdatePlan}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
                <TotalsDisplay costs={netCosts} time={timeToFarm} monthlyIncome={monthlyOreIncome} />
            </main>
        </>
    );
};

export default UpgradePlanner;