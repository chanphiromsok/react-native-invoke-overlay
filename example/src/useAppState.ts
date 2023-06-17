import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import type { AppStateStatus } from 'react-native';

type Props = {
  onResumeFromBackground: () => void;
  delay?: number;
  onAppBackground?(): void;
};

export default function useAppState({
  onResumeFromBackground,
  onAppBackground,
}: Props) {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  useEffect(() => {
    let timeout: any;
    const listener = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          onResumeFromBackground();
        } else if (nextAppState === 'background') {
          onAppBackground?.();
        }
        appState.current = nextAppState;
        setAppStateVisible(appState.current);
      }
    );
    return () => {
      clearTimeout(timeout);
      listener?.remove();
    };
  }, [onResumeFromBackground, onAppBackground]);
  return appStateVisible;
}
