import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import {Input, Spinner} from 'native-base';
import {SafeAreaView} from 'react-native-safe-area-context';
import {doc, getDoc, setDoc} from '@firebase/firestore';
import useAuth from '../hooks/useAuth';
import {db} from '../firebase';
// import * as ImagePicker from 'expo-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {uploadBytes, getStorage, ref, getDownloadURL} from '@firebase/storage';
// import * as FileSystem from 'expo-file-system';
import {useNavigation} from '@react-navigation/native';
// import {Entypo} from '@expo/vector-icons';
import Entypo from 'react-native-vector-icons/Entypo';
// import {serverTimestamp} from '@react-native-firebase/database/lib/modular';

const UpdateProfile = () => {
  const navigation = useNavigation();
  const {user, refreshApp} = useAuth();
  const [userData, setUserData] = useState(null);
  const [image, setImage] = useState(null);
  const [loader, setLoader] = useState(false);
  const [profile, setProfile] = useState({
    name: null,
    job: null,
    age: null,
    imageUrl: null,
  });
  useEffect(() => {
      getPublicImageUrl()
    getUserData();
  }, []);

  const getPublicImageUrl = () => {
    try {
      const storage = getStorage();
      getDownloadURL(
        ref(storage, `gs://tinder-2-tin.appspot.com/${user.email}`),
      )
        .then(url => {
          console.log('url', url);
          // `url` is the download URL for 'images/stars.jpg'

          // This can be downloaded directly:
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = event => {
            const blob = xhr.response;
          };
          xhr.open('GET', url);
          xhr.send();
          setImage(url);
          console.log('url url', url);
          setDoc(doc(db, 'users', user.email), {
            name: userData.name,
            email: userData.email,
            timestamp: new Date(),
            job: userData.job,
            age: userData.age,
            imageUrl: url,
          });
        })
        .catch(error => {
          // Handle any errors
          console.log('error', error);
        });
    } catch (e) {
      console.log('error fetching url', e);
    }
  };
  async function getUserData() {
    const docRef = doc(db, 'users', user?.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserData(docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log('No such document!');
    }
  }
  const selectImageAndUpload = async () => {
    ImagePicker.openPicker({
      cropping: true,
      maxFiles: 5,
      width: 1200,
      height: 1500,
      freeStyleCropEnabled: Platform.OS === 'android',
    })
      .then(async img => {
        console.log('image', img);
        const uri = img.path;
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = () => {
            resolve(xhr.response);
          };
          xhr.onerror = e => {
            reject(new TypeError('Network request failed'));
          };
          xhr.responseType = 'blob';
          xhr.open('GET', uri, true);
          xhr.send(null);
        });
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const storage = getStorage();
        const storageRef = ref(storage, user.email);

        // 'file' comes from the Blob or File API
        uploadBytes(storageRef, blob).then(snapshot => {});
        setTimeout(() => {
          getPublicImageUrl();
        }, 1000);

        // Alert.alert("photo uploaded successfully");
        navigation.navigate('Home', {reload: 'refresh'});
        refreshApp();
      })
      .catch(e => {
        console.log('e', e);
        if (e && e.code && e.code === 'E_PICKER_CANCELLED') {
          return;
        }
        // Alert.alert(
        //   'Photos gallery access denied',
        //   'Please change your settings to allow to access your photos gallery',
        //   [
        //     {text: 'Cancel'},
        //     {
        //       text: 'Go to Settings',
        //       onPress: () => Linking.openSettings(),
        //     },
        //   ],
        //   {cancelable: false},
        // );
      });
  };
  const updateProfile = () => {
    setLoader(true);
    setDoc(doc(db, 'users', user.email), {
      name: profile.name,
      email: user.email,
      timestamp: new Date(),
      job: profile.job,
      age: profile.age,
      imageUrl: image,
    })
      .then(() => {
        setLoader(false);
        setProfile({
          name: null,
          job: null,
          age: null,
          imageUrl: null,
        });
        getUserData();
      })
      .catch(e => {
        setLoader(false);
      });
  };
  return (
    <SafeAreaView style={{position: 'relative', flex: 1}}>
      <Image
        style={{height: 105, width: 105, alignSelf: 'center'}}
        resizeMode={'contain'}
        source={{uri: 'https://links.papareact.com/2pf'}}
      />
      <Text
        style={{
          fontSize: 18,
          alignSelf: 'center',
          fontWeight: '500',
          color: '#000',
        }}>
        Welcome {userData?.name}
      </Text>
      <ScrollView>
        <View style={{marginTop: 10}}>
          <Text style={{color: 'crimson', fontSize: 16, alignSelf: 'center'}}>
            Step 1: The profile pic
          </Text>
          <TouchableOpacity
            style={{
              height: 80,
              width: 80,
              borderRadius: 99,
              borderWidth: image ? 0.1 : 1,
              textAlign: 'center',
              alignSelf: 'center',
              // paddingTop: 30,
              marginTop: 5,
              borderColor: !image ? 'gray' : 'crimson',
              color: 'gray',
              fontWeight: 500,
              position: 'relative',
            }}
            onPress={selectImageAndUpload}>
            {!image ? (
              <Text style={{textAlign: 'center', marginTop: 30,color:"#000"}}>Upload </Text>
            ) : (
              <Image
                style={{height: 80, width: 80, borderRadius: 99}}
                resizeMode={'cover'}
                source={{
                  uri: image
                    ? image
                    : 'https://source.unsplash.com/random/1920x1080/?human',
                }}
              />
            )}
            <Entypo
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                borderWidth: 1,
                borderRadius: 10,
                padding: 3,
                backgroundColor: image ? 'crimson' : '#000',
                borderColor: image ? 'crimson' : '#000',
              }}
              color={'#fff'}
              name={'edit'}
              size={12}
            />
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 10, alignItems: 'center'}}>
          <Text style={{color: 'crimson', fontSize: 16}}>
            Step 2: The Display Name
          </Text>
          <Input
            defaultValue={profile.name}
            variant="underlined"
            placeholder="Enter the name"
            width={Dimensions.get('window').width * 0.6}
            onChangeText={e => {
              setProfile({
                ...profile,
                name: e,
              });
            }}
          />
        </View>
        <View style={{marginTop: 10, alignItems: 'center'}}>
          <Text style={{color: 'crimson', fontSize: 16, alignSelf: 'center'}}>
            Step 3: The Job
          </Text>

          <Input
            defaultValue={profile.job}
            variant="underlined"
            placeholder="Enter the job"
            width={Dimensions.get('window').width * 0.6}
            onChangeText={e => {
              setProfile({
                ...profile,
                job: e,
              });
            }}
          />
        </View>
        <View style={{marginTop: 10, alignItems: 'center'}}>
          <Text style={{color: 'crimson', fontSize: 16, alignSelf: 'center'}}>
            Step 4: The Age
          </Text>
          <Input
            defaultValue={profile.age}
            variant="underlined"
            placeholder="Enter the age"
            width={Dimensions.get('window').width * 0.6}
            onChangeText={e => {
              setProfile({
                ...profile,
                age: e,
              });
            }}
          />
        </View>
      </ScrollView>
      {console.log('profile', profile)}
      <TouchableOpacity
        onPress={updateProfile}
        style={{
          position: 'absolute',
          bottom: '5%',
          alignSelf: 'center',
          backgroundColor:
            profile.name || profile.job || profile.age
              ? 'crimson'
              : 'lightgray',
          padding: 15,
          width: '80%',
          alignItems: 'center',
          borderRadius: 8,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        {loader ? (
          <Spinner color="warning.500" />
        ) : (
          <Text
            style={{
              color:
                profile.name || profile.job || profile.age ? '#fff' : 'crimson',
              fontSize: 15,
              fontWeight: 'bold',
            }}>
            Update Profile
          </Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};
export default UpdateProfile;
