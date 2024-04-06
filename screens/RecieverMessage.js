import React from 'react';
import {View, Text, Image} from 'react-native';
const RecieverMessage = ({message}) => {
  return (
    <View
      style={{
        backgroundColor: 'crimson',
        padding: 10,
        margin: 10,
        alignSelf: 'flex-start',
        marginLeft: '15%',
        borderRadius: 6,
      }}>

      <Image
        style={{
          height: 40,
          width: 40,
          borderRadius: 99,
          position: 'absolute',
          top: 0,
          left: '-15%',
        }}
        resizeMode={'cover'}
        source={{
          uri: message.imageUrl ? message.imageUrl : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
        }}
      />
      <Text
        style={{
          color: '#fff',
        }}>
        {message.message}
      </Text>
    </View>
  );
};
export default RecieverMessage;
