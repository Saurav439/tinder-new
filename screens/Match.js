import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Image, View, Text, TouchableOpacity} from 'react-native';
const Match = props => {
  const navigation = useNavigation();
  const {params} = useRoute();
  const {loggedInProfile, userSwipedRight} = params;
  return (
    <View
      style={{
        backgroundColor: '#F44336',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.89,
      }}>
      <Image
        source={{uri: 'https://links.papareact.com/mg9'}}
        style={{width: '80%', height: 100}}
        resizeMode={'contain'}
      />
      <Text style={{fontWeight: '600', color: '#fff', fontSize: 16}}>
        You and {userSwipedRight.name} have liked each other.
      </Text>
      {/*<View>*/}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          width: '100%',
          marginTop: 20,
        }}>
        <Image
          source={{uri: loggedInProfile.imageUrl ? loggedInProfile.imageUrl :"https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"}}
          style={{width: 120, height: 120, borderRadius: 99}}
          resizeMode={'cover'}
        />
        <Image
          source={{uri: userSwipedRight.imageUrl ? userSwipedRight.imageUrl:"https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"}}
          style={{width: 120, height: 120, borderRadius: 99}}
          resizeMode={'cover'}
        />
      </View>
      <TouchableOpacity
        style={{
          alignSelf: 'center',
          padding: 35,
          backgroundColor: '#fff',
          width: '80%',
          marginTop: '10%',
          borderRadius: 50,
        }}
        onPress={() => {
          navigation.goBack();
          navigation.navigate('Chat');
        }}>
        <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 16,color:"#000"}}>
          Send Message
        </Text>
      </TouchableOpacity>

      {/*</View>*/}
    </View>
  );
};
export default Match;
