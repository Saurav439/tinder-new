import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import useAuth from '../hooks/useAuth';
import {useNavigation} from '@react-navigation/native';
const ChatRow = ({matchDetails}) => {
  const navigation = useNavigation();
  const [matchUser, setMatchUser] = useState([]);
  const {user} = useAuth();
  useEffect(() => {
    if (user) {
      getMatchedUserDetails();
    }
  }, []);
  const getMatchedUserDetails = () => {
    const currentUserEmail = user?.email;
    const otherUsers = Object.values(matchDetails.users).filter(
      user => user.email !== currentUserEmail,
    );
    console.log('othee', otherUsers);
    setMatchUser(otherUsers);
  };
  return (
    <TouchableOpacity
      style={{
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: '#e6e6e6',
        borderRadius: 8,
        margin: 10,
      }}
      onPress={() => {
        navigation.navigate('MessageScreen', {
          matchUser,
          usersMatches: matchDetails.usersMatches,
        });
      }}>
      {matchUser.length > 0 ? (
        <>
          <Image
            source={{
              uri: matchUser[0]?.imageUrl ? matchUser[0].imageUrl:"https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
            }}
            resizeMode={'cover'}
            style={{width: 50, height: 50, borderRadius: 99}}
          />
          <View style={{marginLeft: 10}}>
            <Text style={{fontWeight: 'bold', color: '#333', fontSize: 18}}>
              {matchUser[0]?.name}
            </Text>
            <Text style={{color:"#000"}}>Say Hi!</Text>
          </View>
        </>
      ) : null}
    </TouchableOpacity>
  );
};
export default ChatRow;
