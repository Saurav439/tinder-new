import React from 'react';
import {View, Text} from 'react-native';
const SenderMessage = ({message}) => {
  return (
    <View
      style={{
        backgroundColor: 'purple',
        padding: 10,
        margin: 10,
        alignSelf: 'flex-start',
        marginLeft: 'auto',
        borderRadius: 6,
      }}>
      <Text style={{color: 'white'}}>{message.message}</Text>
    </View>
  );
};
export default SenderMessage;
