import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import { invokeApp } from 'react-native-draw-overlay';
import { name as appName } from './app.json';
import App from './src/App';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage.data);
  if (remoteMessage?.data) {
    invokeApp({ data: remoteMessage }).then((isLocked) => {
      console.log('isLocked', isLocked);
    });
  }
});
AppRegistry.registerComponent(appName, () => App);
