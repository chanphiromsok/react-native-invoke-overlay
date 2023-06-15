import { NativeModules, Platform } from 'react-native';
import type { CanDrawOverlayType } from '../types/DrawOverlayType';

const LINKING_ERROR =
  `The package 'react-native-draw-overlay' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const DrawOverlay = NativeModules.DrawOverlay
  ? NativeModules.DrawOverlay
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

/**
 * Support Only android
 * canDrawOverlays is async/await function
 * use to check if the app can draw overlays
 * ```ts
 * const results = await canDrawOverlays();
 * console.log(results);
 * // {
 * //   canDrawOverlays: "granted", whether your app can draw overlays
 * //   inBackground: "granted", when your app is in background
 * //   inLocked: "granted", when your phone is locked screen
 * // }
 * ```
 * @returns {Promise<CanDrawOverlayType>}
 */
export const canDrawOverlays = async (): Promise<CanDrawOverlayType> => {
  return await DrawOverlay.canDrawOverlays();
};

/**
 * @example
 * openOverlaySetting is function use to open overlay permission in setting
 * @returns {void}
 */
export const openOverlaySetting: () => void = DrawOverlay.openOverlaySetting;
export { DrawOverlay };
