/**
 * CanDrawOverlayType.
 * @example
 * ```
 * inBackground and  inLocked are represent the permission to draw overlay in background for restrict device like Xiaomi for other device will return "granted" when canDrawOverlays is granted
 * ```
 */
export type CanDrawOverlayType = {
  inBackground: 'granted' | 'denied';
  inLocked: 'granted' | 'denied';
  canDrawOverlays: 'granted' | 'denied';
};
export type DrawOverlayStatus = 'granted' | 'denied';
