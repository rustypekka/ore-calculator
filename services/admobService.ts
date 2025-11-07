// @ts-ignore
import { AdMob, RewardAdOptions, RewardAdPluginEvents, AdMobRewardItem, BannerAdOptions, BannerAdPosition } from '@capacitor-community/admob';

// IMPORTANT: Production Ad Unit IDs.
const REWARDED_AD_UNIT_ID_ANDROID = 'ca-app-pub-1783572368390458/8742205079';
const BANNER_AD_UNIT_ID_ANDROID = 'ca-app-pub-1783572368390458/4164117071';

const isNativePlatform = (): boolean => {
    return typeof window !== 'undefined' && window.navigator && typeof (window.navigator as any).getCapacitor === 'function';
}

export const initializeAdMob = async (): Promise<void> => {
  try {
    if (isNativePlatform()) {
        await AdMob.initialize({
            testingDevices: [], // Add your test device IDs here for development
        });
    }
  } catch (error) {
    console.error("Error initializing AdMob", error);
  }
};

export const showBannerAd = async (): Promise<boolean> => {
    if (!isNativePlatform()) {
        console.log("Not a native app. Skipping banner ad.");
        return false;
    }

    const options: BannerAdOptions = {
        adId: BANNER_AD_UNIT_ID_ANDROID,
        // FIX: Use BannerAdPosition enum instead of string literal for type safety.
        position: BannerAdPosition.TOP_CENTER,
        margin: 0,
        isTesting: false, // Set to false for production
    };
    
    try {
        await AdMob.showBanner(options);
        return true;
    } catch (error) {
        console.error("Error showing banner ad:", error);
        return false;
    }
};

/**
 * Shows a rewarded video ad.
 * @returns A promise that resolves with an object indicating if the user was rewarded
 *          and an optional error reason if not.
 */
export const showRewardedAd = (): Promise<{ rewarded: boolean; error?: string }> => {
  return new Promise((resolve) => {
    if (!isNativePlatform()) {
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
