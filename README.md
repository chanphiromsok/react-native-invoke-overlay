# react-native-draw-overlay

This package for invoke app while in lock screen app ,quite state,background and app killed (Android only)

## Installation

```sh
npm install react-native-draw-overlay
```

## Usage

```js
import { DrawOverlay,
        canDrawOverlays,
        openOverlaySetting,
        removeKeepAwakeScreenOn,
        registerKeepAwakeScreen ,
        invokeApp} from 'react-native-draw-overlay';
```

## Definition
| Function                              | Props                                 | Desc| Return                             |
| ------------------------------------- | ------------------------------------- | --- | ----------------------------------------------------------------------------------------------------------------- |
| `canDrawOverlays`                     | NO                                    | Return the permissions of device if can invoke from background or when locked screen | `Promise` `{inBackground: 'granted' or 'denied'; inLocked: 'granted' or 'denied'; canDrawOverlays: 'granted' or 'denied';}`    | 
| `openOverlaySetting`                  | NO                                  |  Open the setting overlay permission in android device                            |     `void`                   |
| `registerKeepAwakeScreen`             | NO                                    | In order  to the invoke app when locked screen or background must register this function                            |  `Promise<boolean>` if return false is already registered or started            |
| `removeKeepAwakeScreenOn`             | NO                                    | To stop invoke your app when locked screen but when screen is on it still invoke your app if you don't want to invoke when screen is on don't call `invokeApp`                            |    `Promise<boolean>` if return false is already registered or removed                   | 
| `invokeApp`                           | YES                                   | Invoke App from background or app lock screen             |  boolean `isScreenOn` return `true` is screen on else if screen is locked return `false`             |

## Example

You can check run clone repository and test from your own,
I used firebase push message from background you can create project from firebase then download `google-services.json` after downloaded go to `example/android/app` and update it then test push.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
