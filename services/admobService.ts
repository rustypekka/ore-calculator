// @ts-ignore
import { AdMob, RewardAdOptions, RewardAdPluginEvents, AdMobRewardItem } from '@capacitor-community/admob';

// IMPORTANT: This is your production Rewarded Ad Unit ID.
const REWARDED_AD_UNIT_ID_ANDROID = 'ca-app-pub-1783572368390458/5322302063';

export const initializeAdMob = async (): Promise<void> => {
  try {
    // AdMob is a native-only plugin, so it will only run on a device/emulator
    if (typeof window !== 'undefined' && window.navigator && typeof (window.navigator as any).getCapacitor === 'function') {
        await AdMob.initialize({
            testingDevices: [], // Add your test device IDs here for development
        });
    }
  } catch (error) {
    console.error("Error initializing AdMob", error);
  }
};

/**
 * Shows a rewarded video ad.
 * @returns A promise that resolves with an object indicating if the user was rewarded
 *          and an optional error reason if not.
 */
export const showRewardedAd = (): Promise<{ rewarded: boolean; error?: string }> => {
  return new Promise((resolve) => {
    // If running in a browser without Capacitor, resolve as if the ad was watched successfully.
    // This allows the core app functionality to work during web development.
    if (typeof window === 'undefined' || !window.navigator || typeof (window.navigator as any).getCapacitor !== 'function') {
        console.log("Not a native app. Skipping ad.");
        return resolve({ rewarded: true });
    }

    const options: RewardAdOptions = {
      adId: REWARDED_AD_UNIT_ID_ANDROID,
      isTesting: false, // Set to false for production
    };

    const setupListenersAndShowAd = async () => {
      const rewardedListener = await AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward: AdMobRewardItem) => {
        console.log('Reward received:', reward);
        removeListeners();
        resolve({ rewarded: true });
      });

      const dismissedListener = await AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
        console.log('Rewarded ad dismissed by user.');
        removeListeners();
        resolve({ rewarded: false, error: 'ad_dismissed' });
      });

      const failedListener = await AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (error: any) => {
        console.error('Failed to load rewarded ad', error);
        removeListeners();
        resolve({ rewarded: false, error: 'ad_failed_to_load' });
    });

      const removeListeners = () => {
        rewardedListener.remove();
        dismissedListener.remove();
        failedListener.remove();
      };

      try {
        await AdMob.prepareRewardVideoAd(options);
        await AdMob.showRewardVideoAd();
      } catch (error) {
        console.error("Error preparing or showing ad:", error);
        removeListeners();
        resolve({ rewarded: false, error: 'ad_prepare_or_show_failed' });
      }
    };

    setupListenersAndShowAd();
  });
};
