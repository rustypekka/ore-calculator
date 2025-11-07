import React, { useState, useEffect } from 'react';
import { EquipmentPlan } from '../types';

interface EquipmentCardProps {
    plan: EquipmentPlan;
    onUpdate: (id: number, updatedPlan: Partial<EquipmentPlan>) => void;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ plan, onUpdate }) => {
    
    // Local state for the input fields
    const [currentLevelInput, setCurrentLevelInput] = useState(plan.currentLevel.toString());
    const [targetLevelInput, setTargetLevelInput] = useState(plan.targetLevel.toString());

    // Sync local state if props change from parent
    useEffect(() => {
        setCurrentLevelInput(plan.currentLevel.toString());
        setTargetLevelInput(plan.targetLevel.toString());
    }, [plan.currentLevel, plan.targetLevel]);


    const handleLevelChange = (type: 'current' | 'target', value: string) => {
        // Allow only digits
        const sanitizedValue = value.replace(/[^0-9]/g, '');
        if (type === 'current') {
            setCurrentLevelInput(sanitizedValue);
        } else {
            setTargetLevelInput(sanitizedValue);
        }
    };

    const handleBlur = (type: 'current' | 'target') => {
        const value = type === 'current' ? currentLevelInput : targetLevelInput;
        const parsedValue = parseInt(value, 10);
        const level = isNaN(parsedValue) ? 0 : parsedValue;

        if (type === 'current') {
            const clampedLevel = Math.max(0, Math.min(plan.equipment.maxLevel, level));
            if (clampedLevel > plan.targetLevel) {
                onUpdate(plan.id, { currentLevel: clampedLevel, targetLevel: clampedLevel });
            } else {
                onUpdate(plan.id, { currentLevel: clampedLevel });
            }
        } else { // type === 'target'
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
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={currentLevelInput}
                    onChange={(e) => handleLevelChange('current', e.target.value)}
                    onBlur={() => handleBlur('current')}
                    onFocus={(e) => e.target.select()}
                    className="bg-white text-black font-bold rounded-md p-1 w-12 text-center shadow-inner"
                    aria-label={`${plan.equipment.name} current level`}
                />
                <span className="text-slate-500 font-bold text-lg">/</span>
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={targetLevelInput}
                    onChange={(e) => handleLevelChange('target', e.target.value)}
                    onBlur={() => handleBlur('target')}
                    onFocus={(e) => e.target.select()}
                    className="bg-slate-900 border border-slate-700 text-white font-bold rounded-md p-1 w-12 text-center shadow-inner"
                    aria-label={`${plan.equipment.name} target level`}
                />
            </div>
        </div>
    );
};

export default EquipmentCard;