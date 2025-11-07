export interface OreCosts {
    shiny: number;
    glowy: number;
    starry: number;
}

export interface UpgradeLevel extends OreCosts {
    level: number;
}

export interface Equipment {
    name: string;
    hero: 'Barbarian King' | 'Archer Queen' | 'Grand Warden' | 'Royal Champion' | 'Minion Prince';
    maxLevel: number;
    levels: UpgradeLevel[];
    icon: string; // URL or path to icon
}

export interface EquipmentPlan {
    id: number;
    equipment: Equipment;
    currentLevel: number;
    targetLevel: number;
}

export interface PlayerEquipmentData {
    name: string;
    level: number;
}

export interface FullPlayerData {
    equipment: PlayerEquipmentData[];
    ores: OreCosts;
}

export interface OreIncomeSettings {
    leagueIndex: number;
    warTownHall: number;
    warAttacksPerWeek: number;
    warWinRatio: number;
    traderShinyPurchases: number;
    traderGlowyPurchases: number;
    traderStarryPurchases: number;
    traderGemsShinyPurchases: number;
    traderGemsGlowyPurchases: number;
    traderGemsStarryPurchases: number;
    traderGemsFreeGlowy: boolean;
}