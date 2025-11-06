import React from 'react';
import { EquipmentPlan } from '../types';

interface EquipmentCardProps {
    plan: EquipmentPlan;
    onUpdate: (id: number, updatedPlan: Partial<EquipmentPlan>) => void;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ plan, onUpdate }) => {
    
    const handleLevelChange = (type: 'current' | 'target', value: string) => {
        const parsedValue = parseInt(value, 10);
        // Default to 0 if input is cleared or invalid
        const level = isNaN(parsedValue) ? 0 : parsedValue;

        if (type === 'current') {
            const clampedLevel = Math.max(0, Math.min(plan.equipment.maxLevel, level));
            if (clampedLevel > plan.targetLevel) {
                // If current level exceeds target, sync target with it
                onUpdate(plan.id, { currentLevel: clampedLevel, targetLevel: clampedLevel });
            } else {
                onUpdate(plan.id, { currentLevel: clampedLevel });
            }
        } else { // type === 'target'
            // Ensure target is not less than current, and not more than max
            const clampedLevel = Math.max(plan.currentLevel, Math.min(plan.equipment.maxLevel, level));
            onUpdate(plan.id, { targetLevel: clampedLevel });
        }
    };

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 mr-2">
                <img src={plan.equipment.icon} alt={plan.equipment.name} className="w-12 h-12 sm:w-14 sm:h-14"/>
                <h3 className="text-white font-bold text-sm sm:text-base">
                    {plan.equipment.name}
                </h3>
            </div>

            <div className="flex items-center space-x-1">
                <input
                    type="number"
                    value={plan.currentLevel.toString()}
                    onChange={(e) => handleLevelChange('current', e.target.value)}
                    onFocus={(e) => e.target.select()}
                    min="0"
                    max={plan.equipment.maxLevel}
                    className="bg-white text-black font-bold rounded-md p-1 w-12 text-center shadow-inner"
                    aria-label={`${plan.equipment.name} current level`}
                />
                <span className="text-slate-500 font-bold text-lg">/</span>
                <input
                    type="number"
                    value={plan.targetLevel.toString()}
                    onChange={(e) => handleLevelChange('target', e.target.value)}
                    onFocus={(e) => e.target.select()}
                    min={plan.currentLevel}
                    max={plan.equipment.maxLevel}
                    className="bg-slate-900 border border-slate-700 text-white font-bold rounded-md p-1 w-12 text-center shadow-inner"
                    aria-label={`${plan.equipment.name} target level`}
                />
            </div>
        </div>
    );
};

export default EquipmentCard;