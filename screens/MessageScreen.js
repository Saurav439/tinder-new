import React, {useEffect, useState} from 'react';
import {
  View,
  Button,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import ChatHeader from './ChatHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import useAuth from '../hooks/useAuth';
import {Input} from 'native-base';
import SenderMessage from './SenderMessage';
import RecieverMessage from './RecieverMessage';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from '@firebase/firestore';
import senderMessage from './SenderMessage';
import {db} from '../firebase';
const MessageScreen = props => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(null);
  const [loginUser, setLoginUser] = useState(null);
  const {matchUser, usersMatches} = props.route.params;
  const {user} = useAuth();
  useEffect(() => {
    if (loginUser) {
      let matchId = usersMatches[0] + 'matches' + usersMatches[1];
      onSnapshot(
        query(
          collection(db, 'matches', matchId, 'messages'),
          orderBy('timestamp', 'desc'),
        ),
        snapshot =>
          setMessages(
            snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            })),
          ),
      );
    }
  }, [matchUser, db, loginUser]);
  useEffect(() => {
    async function getUserData() {
      const docRef = doc(db, 'users', user?.email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLoginUser(docSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log('No such document!');
      }
    }
    getUserData();
  }, []);
  const sendMessage = async () => {
    let matchId = usersMatches[0] + 'matches' + usersMatches[1];
    await addDoc(collection(db, 'matches', matchId, 'messages'), {
      timestamp: serverTimestamp(),
      userId: loginUser.email,
      displayName: loginUser.name,
      imageUrl: loginUser.imageUrl,
      message: input,
    });
    setInput(null);
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <ChatHeader title={matchUser[0]?.name} callEnabled={true} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={10}
        style={{flex: 1}}>
        <TouchableWithoutFeedback>
          <FlatList
            inverted={true}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({item: message}) =>
              message.userId === loginUser.email ? (
                <SenderMessage key={message.id} message={message} />
              ) : (
                <RecieverMessage key={message.id} message={message} />
              )
            }
          />
        </TouchableWithoutFeedback>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 5,
            backgroundColor: '#fff',
            paddingBottom:"10%"
          }}>
          <Input
            defaultValue={input}
            style={{
              fontSize: 16,
            }}
            w={'80%'}
            placeholder={'Send Message...'}
            variant={'unstyled'}
            onChangeText={e => setInput(e)}
          />
          <TouchableOpacity onPress={sendMessage}>
            <Text style={{color: '#ff5864', fontWeight: '500', fontSize: 16}}>
              Send
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default MessageScreen;
