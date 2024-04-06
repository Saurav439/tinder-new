import React, {useEffect, useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from './HomeScreen';
import {Button, Dimensions, Image, Text, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getDoc, doc} from '@firebase/firestore';
import {db} from '../firebase';
import useAuth from '../hooks/useAuth';
import {getDownloadURL, getStorage, ref} from '@firebase/storage';
import {useNavigation} from '@react-navigation/native';


const Drawer = createDrawerNavigator();
let imageUrl;
function MyDrawer() {
    const navigattion = useNavigation()
  const [image, setImage] = useState(null);
  const {user, logout, refresh} = useAuth();
  useEffect(() => {
    console.log('hello');
    const getPublicImageUrl = () => {
      try {
        const storage = getStorage();
        getDownloadURL(
          ref(storage, `gs://tinder-2-tin.appspot.com/${user?.email}`),
        )
          .then(url => {
            // `url` is the download URL for 'images/stars.jpg'

            // This can be downloaded directly:
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = event => {
              const blob = xhr.response;
            };
            xhr.open('GET', url);
            xhr.send();
            console.log('url', url);
            setImage(url);
          })
          .catch(error => {
            // Handle any errors
            console.log('error', error);
          });
      } catch (e) {
        console.log('error fetching url', e);
      }
    };
    getPublicImageUrl();
  }, [refresh]);
  console.log('refresh', refresh);
  return (
    <Drawer.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureResponseDistance: {
          horizontal: Dimensions.get('window').width,
          vertical: Dimensions.get('window').height,
        },
      }}
      initialRouteName={'Home'}
      drawerType={'slide'}
      drawerPosition={'left'}
      drawerContent={() => (
        <SafeAreaView style={{padding: 20}}>
          {console.log('imageURl', image)}
          <Image
            style={{
              height: 78,
              width: 78,
              borderRadius: 99,
              alignSelf: 'center',
            }}
            resizeMode={'cover'}
            source={{
              uri: image
                ? image
                : 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg',
            }}
          />
          <Text
            style={{
              fontSize: 18,
              color: 'crimson',
              fontWeight: '600',
              marginTop: 10,
            }}>
            Reels (coming soon)
          </Text>
            <TouchableOpacity onPress={()=>{navigattion.navigate("Profile")}}>
            <Text
              style={{
                fontSize: 18,
                color: 'black',
                fontWeight: '600',
                marginTop: 20,
              }}>
               Update Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout}>
            <Text
              style={{
                fontSize: 18,
                color: 'black',
                fontWeight: '600',
                marginTop: 20,
              }}>
              Logout
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      )}>
      <Drawer.Screen
        options={{headerShown: false}}
        name="Home"
        component={HomeScreen}
      />
    </Drawer.Navigator>
  );
}
export default MyDrawer;
