import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
const AuthContext = createContext({});
import {auth, db} from '../firebase';
import {doc, setDoc} from '@firebase/firestore';
import {serverTimestamp} from '@react-native-firebase/database/lib/modular';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const AuthProvider = ({children}) => {
  const [errorLogin, setErrorLogin] = useState(null);
  const [errorRegister, setErrorRegister] = useState(null);
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    retrieveUser()
  }, []);
  useEffect(() => {
    auth.onAuthStateChanged(userAuth => {
      if (userAuth) {
        setUser(userAuth);
        storeUser(userAuth)
      }else{
        setUser(null)
      }
    });
  }, []);
  const storeUser = async user => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  const retrieveUser = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        console.log('retireve eid', JSON.parse(userString));
        setUser( JSON.parse(userString))
      }else{
        setChecking(false)
      }
    } catch (error) {
      setChecking(false)
      console.error('Error retrieving user data:', error);
    }
    return null;
  };
  const logout = async () => {
    auth.signOut().catch(err => console.log('error', error));
    setUser(null)
     try {
      await AsyncStorage.removeItem('user')
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };
  const register = (email, password, name) => {
    console.log('helllo');
    setErrorRegister(false);
    setLoading(true);
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        // setDoc(doc(db, "users", email), {
        //   name: name,
        //   email: email,
        //   timestamp: serverTimestamp(),
        // })
        //   .then((mes) => {})
        //   .catch((err) => {
        //     console.log("error", err);
        //   });
      })
      .catch(error => {
        console.log('eeeee', error);
        setErrorRegister(error);
      });
    setLoading(false);
  };
  const signIn = (email, password) => {
    // setErrorLogin(false);
    setLoading(true);
    auth
      .signInWithEmailAndPassword(email, password)
      .then(authUser => {})
      .catch(error => {
        console.log('eroor',error);
        setErrorLogin(error);
      });
    setLoading(false);
  };
  const refreshApp = () => {
    setRefresh(refresh + 1);
  };
  {console.log("erroeeerLogin",errorLogin)}
  const memoValue = useMemo(
    () => ({
      user,
      register,
      signIn,
      logout,
      errorLogin,
      loading,
      errorRegister,
      refreshApp,
      refresh,
      checking
    }),
    [user, errorLogin, loading, errorRegister, refresh,checking],
  );
  return (
    <AuthContext.Provider value={memoValue}>{children}</AuthContext.Provider>
  );
};
export default function useAuth() {
  return useContext(AuthContext);
}
