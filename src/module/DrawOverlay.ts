import { NativeModules } from 'react-native';
import type { CanDrawOverlayType } from '../types/DrawOverlayType';

const LINKING_ERROR =
  `The package 'react-native-invoke-overlay' doesn't seem to be linked. Make sure: \n\n` +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const DrawOverlay: DrawOverlays = NativeModules.DrawOverlay
  ? NativeModules.DrawOverlay
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

type Async<T = boolean> = () => Promise<T>;
type InvokeFunction<T = object> = (data: T) => void;
type DrawOverlays = {
  canDrawOverlays: Async<CanDrawOverlayType>;
  openOverlaySetting: () => void;
  // if return false is already registered
  removeKeepAwakeScreenOn: Async;
  // if return false is already registered
  registerKeepAwakeScreen: Async;
  // return true if screen on
  invokeApp: InvokeFunction;
};

export const canDrawOverlays: () => Promise<CanDrawOverlayType> =
  DrawOverlay.canDrawOverlays;
export const openOverlaySetting: () => void = DrawOverlay.openOverlaySetting;
export const removeKeepAwakeScreenOn: () => void =
  DrawOverlay.removeKeepAwakeScreenOn;
export const registerKeepAwakeScreen: () => void =
  DrawOverlay.registerKeepAwakeScreen;
export const invokeApp: InvokeFunction = (data) =>
  DrawOverlay.invokeApp({
    data: {
      data,
    },
  });
export { DrawOverlay };
