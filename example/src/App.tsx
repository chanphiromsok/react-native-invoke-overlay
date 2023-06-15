import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { canDrawOverlays, openOverlaySetting } from 'react-native-draw-overlay';

export default function App() {
  const [state, setState] = React.useState({});
  React.useEffect(() => {
    canDrawOverlays().then((res) => {
      console.log('canDrawOverlays', res);
      setState(res);
      if (res.inBackground === 'denied' || res.inLocked === 'denied') {
        openOverlaySetting();
      }
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
