import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreens';
import useAuth from './hooks/useAuth';
import LoginScreen from './screens/LoginScreen';
import UpdateProfile from './screens/UpdateProfile';
import Match from './screens/Match';
import MessageScreen from './screens/MessageScreen';
import Drawer from './screens/Drawer';
const StackNavigator = () => {
  const {user} = useAuth();
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {user ? (
        <>
          <Stack.Group>
            <Stack.Screen name={'Drawer'} component={Drawer} />
            <Stack.Screen name={'Chat'} component={ChatScreen} />
          </Stack.Group>
          <Stack.Group
            screenOptions={{
              presentation: 'modal',
            }}>
            <Stack.Screen
              options={() => ({
                presentation: 'modal',
              })}
              name={'Profile'}
              component={UpdateProfile}
            />
          </Stack.Group>
          <Stack.Group
            screenOptions={{
              presentation: 'transparentModal',
            }}>
            <Stack.Screen
              options={() => ({
                presentation: 'transparentModal',
              })}
              name={'Match'}
              component={Match}
            />
          </Stack.Group>
          <Stack.Screen name={'MessageScreen'} component={MessageScreen} />
        </>
      ) : (
        <Stack.Screen name={'Login'} component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};
export default StackNavigator;
