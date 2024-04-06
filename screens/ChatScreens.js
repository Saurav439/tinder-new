import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import useAuth from '../hooks/useAuth';
import {SafeAreaView} from 'react-native-safe-area-context';
import ChatHeader from './ChatHeader';
import {onSnapshot, query, collection, where} from '@firebase/firestore';
import {db} from '../firebase';
import ChatRow from './ChatRow';
import {Spinner} from 'native-base';
const ChatScreen = () => {
  const {user} = useAuth();
  const [matches, setMatches] = useState([]);
  const [loader, setLoader] = useState(true);
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, 'matches'),
          where('usersMatches', 'array-contains', user?.email),
        ),
        snapshot =>
          setMatches(
            snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            })),
          ),
      ),
    [user],
  );
  useEffect(() => {
    setLoader(false);
  }, [matches]);
  return (
    <SafeAreaView style={{backgroundColor: '#fff', flex: 1}}>
      <ChatHeader title={'Chat'} />
      {matches.length > 0 ? (
        <FlatList
          data={matches}
          keyExtractor={item => item.id}
          renderItem={({item}) => <ChatRow matchDetails={item} />}
        />
      ) : loader ? (
        <Spinner />
      ) : (
        <View style={{padding: 20, alignSelf: 'center'}}>
          <Text style={{fontWeight: 'bold', fontSize: 18, color: 'gray'}}>
            No Matches at the moment 🥲
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};
export default ChatScreen;
