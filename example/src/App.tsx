import messaging from '@react-native-firebase/messaging';
import * as React from 'react';
import { DeviceEventEmitter, StyleSheet, Text, View } from 'react-native';
import { notificationListener, requestUserPermission } from './notifcation';
import { useDrawerOverlay } from './useDrawOverlay';
import { DrawOverlay } from 'react-native-draw-overlay';

const isOnline = true;
export default function App() {
  const state = useDrawerOverlay({ unlessGranted: true });
  React.useEffect(() => {
    messaging()
      .getToken()
      .then((token) => {
        console.log('FIRE_BASE_TOKEN', token);
      });
    if (isOnline) {
      DrawOverlay.registerKeepAwakeScreen();
    } else {
      DrawOverlay.removeKeepAwakeScreenOn();
    }

    requestUserPermission();
    notificationListener();
    DeviceEventEmitter.addListener('data', (data) => {
      console.log('DeviceEventEmitter', data);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {JSON.stringify(state, null, 2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
