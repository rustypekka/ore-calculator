import React from 'react';
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
    return (
        <>
            <PlayerOresDisplay ores={playerOres} onOresChange={onOresChange} />
            <PlayerTagInput onImport={onImportData} isLoading={isLoading} error={error} />
            <main className="mt-8">
                {heroes.map(hero => {
                    const heroPlans = plans.filter(p => p.equipment.hero === hero);
                    if (heroPlans.length === 0) return null;
                    return (
                        <div key={hero} className="mb-12 bg-black bg-opacity-20 p-4 rounded-xl">
                            <h2 
                                className="text-2xl sm:text-3xl font-bold text-center text-white mb-6" 
                                style={{
                                    textShadow: '3px 3px 0px rgba(0,0,0,0.7), 0 0 15px rgba(255,255,255,0.5)'
                                }}
                            >
                                {hero}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {heroPlans.map(plan => (
                                    <EquipmentCard
                                        key={plan.id}
                                        plan={plan}
                                        onUpdate={onUpdatePlan}
                                    />
                                ))}
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