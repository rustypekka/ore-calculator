import { AdMob, RewardAdOptions, RewardAdPluginEvents, AdmobRewardItem } from '@capacitor-community/admob';

// IMPORTANT: This is your production Rewarded Ad Unit ID.
const REWARDED_AD_UNIT_ID_ANDROID = 'ca-app-pub-1783572368390458/5322302063';

export const initializeAdMob = async (): Promise<void> => {
  try {
    // AdMob is a native-only plugin, so it will only run on a device/emulator
    // FIX: Cast window.navigator to any to resolve TypeScript error for getCapacitor
    if (typeof window !== 'undefined' && window.navigator && typeof (window.navigator as any).getCapacitor === 'function') {
        await AdMob.initialize({
            requestTrackingAuthorization: true,
            testingDevices: [], // Add your test device IDs here for development
        });
    }
  } catch (e) {
    console.error("Error initializing AdMob", e);
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
    // FIX: Cast window.navigator to any to resolve TypeScript error for getCapacitor
    if (typeof window === 'undefined' || !window.navigator || typeof (window.navigator as any).getCapacitor !== 'function') {
        console.log("Not a native app. Skipping ad.");
        return resolve({ rewarded: true });
    }

    const options: RewardAdOptions = {
      adId: REWARDED_AD_UNIT_ID_ANDROID,
      isTesting: false, // Set to false for production
    };

    const removeAllListeners = () => {
        AdMob.removeAllListeners();
    };

    AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward: AdmobRewardItem) => {
      console.log('Reward received:', reward);
      removeAllListeners();
      resolve({ rewarded: true });
    });

    AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
      console.log('Rewarded ad dismissed by user.');
      removeAllListeners();
      resolve({ rewarded: false, error: 'ad_dismissed' });
    });

    AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (error) => {
        console.error('Failed to load rewarded ad', error);
        removeAllListeners();
        resolve({ rewarded: false, error: 'ad_failed_to_load' });
    });

    AdMob.prepareRewardVideoAd(options)
      .then(() => AdMob.showRewardVideoAd())
      .catch((e) => {
        console.error("Error preparing or showing ad:", e);
        removeAllListeners();
        resolve({ rewarded: false, error: 'ad_prepare_or_show_failed' });
      });
  });
};
