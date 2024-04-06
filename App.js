import {StyleSheet} from 'react-native';
import StackNavigator from './StackNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {AuthProvider} from './hooks/useAuth';
import {NativeBaseProvider} from 'native-base';
export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <NativeBaseProvider>
          <StackNavigator />
        </NativeBaseProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
