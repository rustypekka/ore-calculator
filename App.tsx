import React, { useState, useMemo, useEffect } from 'react';
import { EQUIPMENT_DATA, LEAGUES, WAR_TOWN_HALL_LOOT, TRADER_ORE_PURCHASE, TRADER_GEMS_ORE_PURCHASE } from './constants';
import { EquipmentPlan, OreCosts, OreIncomeSettings, BookmarkedPlayer } from './types';
import { fetchPlayerData } from './services/clashOfClansService';
import { initializeAdMob, showRewardedAd } from './services/admobService';
import UpgradePlanner from './components/UpgradePlanner';
import IncomeSettings from './components/IncomeSettings';

const initialPlans: EquipmentPlan[] = EQUIPMENT_DATA.map((eq, index) => ({
    id: index + 1,
    equipment: eq,
    currentLevel: 1,
    targetLevel: eq.maxLevel,
}));


const App: React.FC = () => {
    const [plans, setPlans] = useState<EquipmentPlan[]>(initialPlans);
    const [playerOres, setPlayerOres] = useState<OreCosts>({ shiny: 0, glowy: 0, starry: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('planner');
    const [playerTagInput, setPlayerTagInput] = useState('');
    const [bookmarkedPlayers, setBookmarkedPlayers] = useState<BookmarkedPlayer[]>([]);
    const [currentPlayer, setCurrentPlayer] = useState<{ tag: string; name: string } | null>(null);
    
    const [oreIncomeSettings, setOreIncomeSettings] = useState<OreIncomeSettings>({
        leagueIndex: 33, // Default to Legend League
        warTownHall: 17,
        warAttacksPerWeek: 7,
        warWinRatio: 100,
        traderShinyPurchases: 2, // Raid Medals
        traderGlowyPurchases: 2,
        traderStarryPurchases: 2,
        traderGemsShinyPurchases: 0, // Gems
        traderGemsGlowyPurchases: 0,
        traderGemsStarryPurchases: 0,
        traderGemsFreeGlowy: true,
        otherShiny: 0,
        otherGlowy: 0,
        otherStarry: 0,
    });

    useEffect(() => {
        // Initialize AdMob when the app starts
        initializeAdMob();

        try {
            const savedBookmarks = localStorage.getItem('bookmarkedPlayerTags');
            if (savedBookmarks) {
                setBookmarkedPlayers(JSON.parse(savedBookmarks));
            }
        } catch (e) {
            console.error("Failed to parse bookmarks from localStorage", e);
            localStorage.removeItem('bookmarkedPlayerTags');
        }
    }, []); // Runs only on mount

    const dailyOreIncomeBreakdown = useMemo(() => {
        const settings = oreIncomeSettings;
        const avgDaysInMonth = 30;
        const dailyBonus = LEAGUES[settings.leagueIndex].dailyStarBonus;

        const thLoot = WAR_TOWN_HALL_LOOT[settings.warTownHall as keyof typeof WAR_TOWN_HALL_LOOT];
        const winRate = settings.warWinRatio / 100;
        const lossRate = 1 - winRate;
        const dailyAttacks = settings.warAttacksPerWeek / 7;
        const warIncome = {
            shiny: dailyAttacks * (thLoot.win.shiny * winRate + thLoot.loss.shiny * lossRate),
            glowy: dailyAttacks * (thLoot.win.glowy * winRate + thLoot.loss.glowy * lossRate),
            starry: dailyAttacks * (thLoot.win.starry * winRate + thLoot.loss.starry * lossRate),
        };

        const traderIncome = {
            shiny: (settings.traderShinyPurchases * TRADER_ORE_PURCHASE.shiny) / 7,
            glowy: (settings.traderGlowyPurchases * TRADER_ORE_PURCHASE.glowy) / 7,
            starry: (settings.traderStarryPurchases * TRADER_ORE_PURCHASE.starry) / 7,
        };

        const traderGemsIncome = {
            shiny: (settings.traderGemsShinyPurchases * TRADER_GEMS_ORE_PURCHASE.shiny) / 7,
            glowy: ((settings.traderGemsGlowyPurchases * TRADER_GEMS_ORE_PURCHASE.glowy) + (settings.traderGemsFreeGlowy ? TRADER_GEMS_ORE_PURCHASE.freeGlowy : 0)) / 7,
            starry: (settings.traderGemsStarryPurchases * TRADER_GEMS_ORE_PURCHASE.starry) / 7,
        };
        
        const otherIncome = {
            shiny: settings.otherShiny / avgDaysInMonth,
            glowy: settings.otherGlowy / avgDaysInMonth,
            starry: settings.otherStarry / avgDaysInMonth,
        };

        const total = {
            shiny: dailyBonus.shiny + warIncome.shiny + traderIncome.shiny + traderGemsIncome.shiny + otherIncome.shiny,
            glowy: dailyBonus.glowy + warIncome.glowy + traderIncome.glowy + traderGemsIncome.glowy + otherIncome.glowy,
            starry: dailyBonus.starry + warIncome.starry + traderIncome.starry + traderGemsIncome.starry + otherIncome.starry,
        };
        
        return { total, dailyBonus, warIncome, traderIncome, traderGemsIncome, otherIncome };

    }, [oreIncomeSettings]);

    const dailyOreIncome = dailyOreIncomeBreakdown.total;

    const monthlyOreIncomeBreakdown = useMemo(() => {
        const avgDaysInMonth = 30;
        const multiplyBy30 = (ores: OreCosts) => ({
            shiny: Math.round(ores.shiny * avgDaysInMonth),
            glowy: Math.round(ores.glowy * avgDaysInMonth),
            starry: Math.round(ores.starry * avgDaysInMonth),
        });
        return {
            total: multiplyBy30(dailyOreIncomeBreakdown.total),
            dailyBonus: multiplyBy30(dailyOreIncomeBreakdown.dailyBonus),
            warIncome: multiplyBy30(dailyOreIncomeBreakdown.warIncome),
            traderIncome: multiplyBy30(dailyOreIncomeBreakdown.traderIncome),
            traderGemsIncome: multiplyBy30(dailyOreIncomeBreakdown.traderGemsIncome),
            otherIncome: multiplyBy30(dailyOreIncomeBreakdown.otherIncome)
        };
    }, [dailyOreIncomeBreakdown]);

    const monthlyOreIncome = monthlyOreIncomeBreakdown.total;

    const handleUpdatePlan = (id: number, updatedPlan: Partial<EquipmentPlan>) => {
        setPlans(prevPlans =>
            prevPlans.map(plan => (plan.id === id ? { ...plan, ...updatedPlan } : plan))
        );
    };
    
    const handleOresChange = (oreType: keyof OreCosts, value: number) => {
        setPlayerOres(prev => ({ ...prev, [oreType]: value }));
    };

    const handleImportData = async (playerTag: string) => {
        setIsLoading(true);
        setError(null);
        setPlayerTagInput(playerTag);
        
        // Show a rewarded ad. The promise resolves with an object indicating success.
        const adResult = await showRewardedAd();

        if (adResult.rewarded) {
             // User watched the ad, now fetch the data
            try {
                const importedData = await fetchPlayerData(playerTag);
                
                const newPlans: EquipmentPlan[] = EQUIPMENT_DATA.map((equipment, index) => {
                    const importedEquipment = importedData.equipment.find(e => e.name === equipment.name);
                    const currentPlan = plans.find(p => p.equipment.name === equipment.name);

                    return {
                        id: index + 1,
                        equipment,
                        currentLevel: importedEquipment ? importedEquipment.level : 0,
                        // Preserve user's target level if it exists, otherwise default to max
                        targetLevel: currentPlan ? currentPlan.targetLevel : equipment.maxLevel
                    };
                });
                setPlans(newPlans);
                setCurrentPlayer({ tag: playerTag, name: importedData.name });
            } catch (e) {
                setError(e instanceof Error ? e.message : 'An unknown error occurred.');
                setCurrentPlayer(null);
            } finally {
                setIsLoading(false);
            }
        } else {
             // User did not complete the ad or it failed to load
            const errorMessage = adResult.error === 'ad_failed_to_load' 
                ? 'Ad could not be loaded. Please check your connection and try again.'
                : 'Please watch the full ad to import player data.';
            setError(errorMessage);
            setIsLoading(false);
        }
    };
    
    const handlePlayerTagInputChange = (tag: string) => {
        setPlayerTagInput(tag);
        setCurrentPlayer(null);
    };

    const handleBookmarkPlayer = () => {
        if (!currentPlayer || bookmarkedPlayers.some(p => p.tag === currentPlayer.tag)) {
            return;
        }
        const newBookmarks = [...bookmarkedPlayers, { tag: currentPlayer.tag, name: currentPlayer.name }];
        setBookmarkedPlayers(newBookmarks);
        localStorage.setItem('bookmarkedPlayerTags', JSON.stringify(newBookmarks));
    };

    const handleRemoveBookmark = (tagToRemove: string) => {
        const newBookmarks = bookmarkedPlayers.filter(p => p.tag !== tagToRemove);
        setBookmarkedPlayers(newBookmarks);
        localStorage.setItem('bookmarkedPlayerTags', JSON.stringify(newBookmarks));
    };

    const totalCosts = useMemo<OreCosts>(() => {
        return plans.reduce(
            (acc, plan) => {
                if (plan.currentLevel >= plan.targetLevel) return acc;

                for (let level = plan.currentLevel; level < plan.targetLevel; level++) {
                    const upgradeCost = plan.equipment.levels[level]; 
                     if (upgradeCost) {
                        acc.shiny += upgradeCost.shiny;
                        acc.glowy += upgradeCost.glowy;
                        acc.starry += upgradeCost.starry;
                    }
                }
                return acc;
            },
            { shiny: 0, glowy: 0, starry: 0 }
        );
    }, [plans]);

    const netCosts = useMemo<OreCosts>(() => {
        return {
            shiny: Math.max(0, totalCosts.shiny - playerOres.shiny),
            glowy: Math.max(0, totalCosts.glowy - playerOres.glowy),
            starry: Math.max(0, totalCosts.starry - playerOres.starry),
        }
    }, [totalCosts, playerOres]);

    const timeToFarm = useMemo(() => {
        const daysShiny = dailyOreIncome.shiny > 0 ? (netCosts.shiny / dailyOreIncome.shiny) : Infinity;
        const daysGlowy = dailyOreIncome.glowy > 0 ? (netCosts.glowy / dailyOreIncome.glowy) : Infinity;
        const daysStarry = dailyOreIncome.starry > 0 ? (netCosts.starry / dailyOreIncome.starry) : Infinity;

        const maxDays = Math.max(daysShiny, daysGlowy, daysStarry);
        if (maxDays === Infinity || maxDays === 0) return { days: 0, weeks: 0, months: 0, years: 0 };
        
        const years = Math.floor(maxDays / 365);
        const remainingDaysAfterYears = maxDays % 365;
        const months = Math.floor(remainingDaysAfterYears / 30);
        const remainingDaysAfterMonths = remainingDaysAfterYears % 30;
        const weeks = Math.floor(remainingDaysAfterMonths / 7);
        const days = Math.round(remainingDaysAfterMonths % 7);

        return { days, weeks, months, years };

    }, [netCosts, dailyOreIncome]);
    
    const heroes = ['Barbarian King', 'Archer Queen', 'Minion Prince', 'Grand Warden', 'Royal Champion'];

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-400 tracking-wider" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                        COC Ore Calculator
                    </h1>
                    <p className="text-base sm:text-lg text-gray-400 mt-2">Plan your Hero Equipment upgrades with ease.</p>
                </header>

                <div className="flex justify-center border-b-2 border-gray-700 mb-8">
                    <button
                        onClick={() => setActiveTab('planner')}
                        className={`py-3 px-4 text-base sm:px-6 sm:text-lg font-bold transition-colors duration-300 ${activeTab === 'planner' ? 'text-yellow-400 border-b-4 border-yellow-400' : 'text-gray-500 hover:text-yellow-300'}`}
                        aria-pressed={activeTab === 'planner'}
                    >
                        Upgrade Planner
                    </button>
                    <button
                        onClick={() => setActiveTab('income')}
                        className={`py-3 px-4 text-base sm:px-6 sm:text-lg font-bold transition-colors duration-300 ${activeTab === 'income' ? 'text-yellow-400 border-b-4 border-yellow-400' : 'text-gray-500 hover:text-yellow-300'}`}
                        aria-pressed={activeTab === 'income'}
                    >
                        Income Settings
                    </button>
                </div>
                
                {activeTab === 'planner' && (
                    <UpgradePlanner 
                        plans={plans}
                        heroes={heroes}
                        onUpdatePlan={handleUpdatePlan}
                        onImportData={handleImportData}
                        isLoading={isLoading}
                        error={error}
                        netCosts={netCosts}
                        timeToFarm={timeToFarm}
                        monthlyOreIncome={monthlyOreIncome}
                        playerTagInput={playerTagInput}
                        onPlayerTagInputChange={handlePlayerTagInputChange}
                        currentPlayer={currentPlayer}
                        bookmarkedPlayers={bookmarkedPlayers}
                        onBookmarkPlayer={handleBookmarkPlayer}
                        onRemoveBookmark={handleRemoveBookmark}
                    />
                )}

                {activeTab === 'income' && (
                     <IncomeSettings 
                        settings={oreIncomeSettings}
                        onSettingsChange={setOreIncomeSettings}
                        monthlyIncomeBreakdown={monthlyOreIncomeBreakdown}
                        playerOres={playerOres}
                        onOresChange={handleOresChange}
                     />
                )}
                
                 <footer className="text-center mt-12 text-gray-500 text-sm">
                    <p>This is a fan-made tool and is not affiliated with Supercell.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;