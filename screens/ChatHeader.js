import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
// import {AntDesign, Ionicons} from '@expo/vector-icons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
const ChatScreen = ({title, callEnabled}) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        alignItems: 'center',
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{padding: 5}}>
          <AntDesign name={'left'} size={24} color={'crimson'} />
        </TouchableOpacity>
        <Text style={{fontSize: 22, fontWeight: 'bold', color: '#000'}}>
          {' '}
          {'  '}
          {title}
        </Text>
      </View>
      {callEnabled ? (
        <Ionicons name={'call'} size={20} color={'crimson'} />
      ) : null}
    </View>
  );
};
export default ChatScreen;
