import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import useAuth from '../hooks/useAuth';
import ActionSheet from 'react-native-actions-sheet';
import {
  HStack,
  Link,
  Center,
  Heading,
  Box,
  VStack,
  Input,
  FormControl,
  Button,
  Spinner,
} from 'native-base';
const LoginScreen = () => {
  const actionSheetRef = useRef(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [loader, setLoader] = useState(false);
  const [password, setPassword] = useState(null);
  const [errorMsg, setError] = useState(null);
  const [errorMsgReg, setErrorReg] = useState(null);
  const {register, signIn, errorLogin, errorRegister,checking} = useAuth();
  useEffect(() => {
    setLoader(false);
    setError(errorLogin);
  }, [errorLogin]);
  useEffect(() => {
    setLoader(false);
    setErrorReg(errorRegister);
  }, [errorRegister]);
  useEffect(() => {
    setError(false);
  }, []);
  return (
    <View style={{flex: 1}}>
      <ImageBackground
        resizeMode={'cover'}
        style={{flex: 1}}
        source={{
          uri: 'https://tinder.com/static/tinder.png',
        }}>
          {!checking ?<TouchableOpacity
          onPress={() => {
            actionSheetRef.current.show();
          }}
          style={{
            position: 'absolute',
            bottom: '18%',
            alignSelf: 'center',
            backgroundColor: '#fff',
            padding: 15,
            width: '60%',
            alignItems: 'center',
            borderRadius: 8,
          }}>
          <Text style={{color: 'crimson', fontSize: 15, fontWeight: 'bold'}}>
            Sign in & get swiping
          </Text>
        </TouchableOpacity> :null}

      </ImageBackground>
      <ActionSheet
        bounceOnOpen={true}
        bounciness={5}
        defaultOverlayOpacity={0.3}
        keyboardShouldPersistTaps="handled"
        containerStyle={{
          height: Dimensions.get('window').height * 0.8,
          width: '100%',
          backgroundColor: '#fff',
        }}
        onClose={() => {
          setError(false);
        }}
        ref={actionSheetRef}>
        <Center w="100%">
          <Box safeArea p="2" py="8" w="90%" maxW="290">
            <Heading
              size="lg"
              fontWeight="600"
              color="orange"
              _dark={{
                color: 'orange',
              }}>
              <Text style={{color: 'crimson'}}>Welcome</Text>
            </Heading>
            <Heading
              mt="1"
              _dark={{
                color: 'warmGray.200',
              }}
              color="coolGray.600"
              fontWeight="medium"
              size="xs">
              Sign in to continue!
            </Heading>

            <VStack space={3} mt="5">
              <FormControl>
                <FormControl.Label>Email ID</FormControl.Label>
                <Input
                  onChangeText={text => {
                    setErrorReg(false);
                    setError(false);
                    setEmail(text);
                  }}
                />
              </FormControl>
              <FormControl>
                <FormControl.Label>Password</FormControl.Label>
                <Input
                  onChangeText={text => {
                    setErrorReg(false);
                    setError(false);
                    setPassword(text);
                  }}
                  type="password"
                />
                <Link
                  _text={{
                    fontSize: 'xs',
                    fontWeight: '500',
                    color: 'indigo.500',
                  }}
                  alignSelf="flex-end"
                  mt="1">
                  Forget Password?
                </Link>
              </FormControl>
              <Button
                onPress={() => {
                  setLoader(true);
                  setErrorReg(false);
                  setError(false);
                  signIn(email, password);
                }}
                mt="2"
                colorScheme="orange">
                {loader ? <Spinner color="#fff" /> : 'Sign in'}
              </Button>
              {errorMsg ? (
                <Text
                  style={{
                    color: '#DC3545',
                    borderWidth: 1,
                    borderColor: '#f6c6cb',
                    padding: 1,
                    borderRadius: 99,
                    textAlign: 'center',
                    backgroundColor: '#f6c6cb',
                  }}>
                    {errorMsg?.split("[")[0]}
                </Text>
              ) : null}
                {errorMsgReg ? (
                <Text
                  style={{
                    color: '#DC3545',
                    borderWidth: 1,
                    borderColor: '#f6c6cb',
                    padding: 1,
                    borderRadius: 99,
                    textAlign: 'center',
                    backgroundColor: '#f6c6cb',
                  }}>
                    {errorMsgReg}
                </Text>
              ) : null}
              <HStack mt="6" justifyContent="center">
                <Text
                  style={{color: 'gray'}}
                  fontSize="sm"
                  color="coolGray.600"
                  _dark={{
                    color: 'warmGray.200',
                  }}>
                  I'm a new user.{' '}
                </Text>
                <Link
                  _text={{
                    color: 'indigo.500',
                    fontWeight: 'medium',
                    fontSize: 'sm',
                  }}
                  onPress={() => {
                    // setErrorReg(false)
                    // setError(false)
                    setLoader(true);
                    setErrorReg(false);
                    setError(false);
                    register(email, password);
                  }}>
                  Sign Up
                </Link>
              </HStack>
            </VStack>
          </Box>
        </Center>
      </ActionSheet>
    </View>
  );
};
export default LoginScreen;
