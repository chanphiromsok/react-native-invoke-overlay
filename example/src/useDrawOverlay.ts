import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import type { CanDrawOverlayType } from 'react-native-invoke-overlay';
import {
  canDrawOverlays,
  openOverlaySetting,
} from 'react-native-invoke-overlay';
import useAppState from './useAppState';

type State = {
  unlessGranted: boolean;
};
export const useDrawerOverlay = ({ unlessGranted }: State) => {
  const [state, setState] = useState<CanDrawOverlayType | undefined>();
  const onCheck = () => {
    canDrawOverlays().then((res) => {
      console.log('canDrawOverlays', res);
      setState(res);
      if (
        res.inBackground === 'denied' ||
        res.inLocked === 'denied' ||
        res.canDrawOverlays === 'denied'
      ) {
        Alert.alert(
          'Please allow permission to draw overlay',
          'Please allow permission to draw overlay',
          [{ text: 'OK', onPress: () => openOverlaySetting() }]
        );
      }
    });
  };
  const isAllGranted =
    state?.inBackground === 'granted' &&
    state?.inLocked === 'granted' &&
    state?.canDrawOverlays === 'granted';
  useEffect(() => {
    onCheck();
  }, []);

  useAppState({
    onResumeFromBackground: useCallback(() => {
      onCheck();
    }, []),
    onAppBackground: useCallback(() => {
      if (unlessGranted && isAllGranted) return;
      // onCheck();
    }, [unlessGranted, isAllGranted]),
  });

  return state;
};
