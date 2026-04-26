import { Alert, Platform, ToastAndroid } from 'react-native';

export const showFeedback = (message: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
    return;
  }

  Alert.alert('CatatUangku', message);
};
