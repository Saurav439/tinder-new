import React, {useEffect, useRef, useState, useLayoutEffect} from 'react';
import {View, Text, Image, TouchableOpacity, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
// import { Ionicons, Entypo, AntDesign } from "@expo/vector-icons";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Cards} from './CardsData';
import Swiper from 'react-native-deck-swiper';
import useAuth from '../hooks/useAuth';
import {getDownloadURL, getStorage, ref} from '@firebase/storage';
import {
  doc,
  onSnapshot,
  collection,
  setDoc,
  getDocs,
  query,
  where,
  getDoc,
  serverTimestamp,
} from '@firebase/firestore';
import {db} from '../firebase';

const HomeScreen = props => {
  const {user, logout} = useAuth();

  const swiperRef = useRef(null);
  const navigation = useNavigation();
  const [imageUrl, setImageUrl] = useState(null);
  const [cards, setCards] = useState([]);
  const [finalCards, setFinalCards] = useState([]);
  useEffect(() => {
    getPublicImageUrl();
  }, []);
  useLayoutEffect(
    () =>
      onSnapshot(doc(db, 'users', user?.email), snapshot => {
        if (!snapshot.exists()) {
          navigation.navigate('Profile');
        }
      }),

    [],
  );
  useEffect(() => {
    if (props.route.params) {
      setTimeout(() => {
        getPublicImageUrl();
      }, 1000);
    }
  }, [props.route.params]);

  useEffect(() => {
    const fetchCards = async () => {
      let passedArr;
      let swipesArr;
      const passes = await getDocs(
        collection(db, 'users', user?.email, 'passes'),
      ).then(snapshot => snapshot.docs.map(doc => (passedArr = doc.data().id)));
      const swipes = await getDocs(
        collection(db, 'users', user?.email, 'swipes'),
      ).then(snapshot => snapshot.docs.map(doc => (swipesArr = doc.data().id)));
      const passedUserIds = passes.length > 0 ? passes : ['test'];
      const swipedUserIds = swipes.length > 0 ? swipes : ['test'];
      onSnapshot(
        query(
          collection(db, 'users'),
          where('email', 'not-in', [...passedUserIds, ...swipedUserIds]),
        ),
        snapshot => {
          setCards(
            snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            })),
          );
        },
      );
    };
    fetchCards();
  }, []);
  useEffect(() => {
    let newArray = cards.filter(item => {
      return item.email !== user?.email;
    });
    let emptyArr = new Array(99);
    emptyArr.isEmpty = true;
    let anotherNewArr = [...newArray, ...emptyArr];
    setFinalCards(anotherNewArr);
  }, [cards]);
  const getPublicImageUrl = () => {
    try {
      const storage = getStorage();
      getDownloadURL(
        ref(storage, `gs://tinder-2-tin.appspot.com/${user?.email}`),
      )
        .then(url => {
          // `url` is the download URL for 'images/stars.jpg'

          // This can be downloaded directly:
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = event => {
            const blob = xhr.response;
          };
          xhr.open('GET', url);
          xhr.send();
          console.log('url', url);
          setImageUrl(url);
        })
        .catch(error => {
          // Handle any errors
          console.log('error', error);
        });
    } catch (e) {
      console.log('error fetching url', e);
    }
  };

  const handleSwipeLeft = cardIndex => {
    if (!finalCards[cardIndex]) return;
    const userSwipedLeft = finalCards[cardIndex];
    setDoc(
      doc(db, 'users', user?.email, 'passes', userSwipedLeft.email),
      userSwipedLeft,
    );
  };
  const handleSwipeRight = async cardIndex => {
    if (!finalCards[cardIndex]) return;
    const loggedInProfile = await (
      await getDoc(doc(db, 'users', user?.email))
    ).data();
    const userSwipedRight = finalCards[cardIndex];

    const getMatches = await getDocs(
      collection(db, 'users', userSwipedRight.email, 'swipes'),
    ).then(snapshot => snapshot.docs.map(doc => doc.data().id));
    if (getMatches.includes(user?.email)) {
      //CREATE A MATCH!!!
      let newMatchedId = user?.email + 'matches' + userSwipedRight.email;
      setDoc(doc(db, 'matches', newMatchedId), {
        users: {
          [user?.email]: loggedInProfile,
          [userSwipedRight.email]: userSwipedRight,
        },
        usersMatches: [loggedInProfile.email, userSwipedRight.email],
        timestamp: serverTimestamp(),
      });
      navigation.navigate('Match', {
        loggedInProfile,
        userSwipedRight,
      });
    }

    setDoc(
      doc(db, 'users', user?.email, 'swipes', userSwipedRight.email),
      userSwipedRight,
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      {user ? (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 15,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.openDrawer();
              }}>
              <Image
                style={{height: 45, width: 45, borderRadius: 99}}
                resizeMode={'cover'}
                source={{
                  uri: imageUrl
                    ? imageUrl
                    : 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Profile');
              }}>
              <Image
                style={{height: 45, width: 45}}
                resizeMode={'contain'}
                source={require('../assets/tinder.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Chat');
              }}>
              <Ionicons
                color={'#FE3C72'}
                name={'chatbubbles-sharp'}
                size={35}
              />
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}}>
            <Swiper
              ref={swiperRef}
              stackSize={5}
              cardIndex={0}
              verticalSwipe={false}
              animateCardOpacity
              containerStyle={{backgroundColor: 'transparent'}}
              cards={finalCards}
              onSwipedLeft={cardIndex => {
                handleSwipeLeft(cardIndex);
              }}
              onSwipedRight={cardIndex => {
                handleSwipeRight(cardIndex);
              }}
              overlayLabels={{
                left: {
                  title: 'NOPE',
                  style: {
                    label: {
                      textAlign: 'right',
                      color: 'red',
                    },
                  },
                },
                right: {
                  title: 'MATCH',
                  style: {
                    label: {
                      textAlign: 'left',
                      color: 'green',
                    },
                  },
                },
              }}
              renderCard={card => (
                <>
                  {card !== undefined ? (
                    <View
                      key={card?.id}
                      style={{
                        height: Dimensions.get('window').height * 0.6,
                        position: 'relative',
                      }}>
                      {/*<Text>{card.name}</Text>*/}
                      <Image
                        style={{
                          height: '100%',
                          width: '100%',
                          position: 'absolute',
                          top: 0,
                          borderRadius: 10,
                        }}
                        resizeMode={'cover'}
                        source={{
                          uri: card?.imageUrl ? card.imageUrl :"https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
                        }}
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          position: 'absolute',
                          bottom: 0,
                          backgroundColor: '#fff',
                          height: 80,
                          width: '100%',
                          padding: 20,
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 1,
                          },
                          shadowOpacity: 0.1,
                          shadowRadius: 1.41,
                          elevation: 1,
                        }}>
                        <View>
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: '600',
                              color: 'black',
                            }}>
                            {card?.name}
                          </Text>
                          <Text style={{color: 'black'}}>{card?.job}</Text>
                        </View>
                        <View>
                          <Text
                            style={{
                              fontSize: 18,
                              fontWeight: '600',
                              color: 'black',
                            }}>
                            {card?.age}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View
                      style={{
                        height: Dimensions.get('window').height * 0.6,
                        position: 'relative',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 20,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 1.41,
                        elevation: 1,
                        backgroundColor: '#fff',
                      }}>
                      <Text style={{fontWeight: 'bold', marginTop: '-10%',color:"#000"}}>
                        No More Profile
                      </Text>
                      <Image
                        style={{
                          height: '30%',
                          width: '30%',
                          position: 'absolute',
                          bottom: '30%',
                          borderRadius: 10,
                        }}
                        resizeMode={'contain'}
                        source={{
                          uri: 'https://links.papareact.com/6gb',
                        }}
                      />
                    </View>
                  )}
                </>
              )}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              marginBottom: '10%',
            }}>
            <TouchableOpacity
              onPress={() => {
                swiperRef.current.swipeLeft();
              }}
              style={{
                height: 70,
                width: 70,
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
                backgroundColor: '#E78895',
                borderColor: '#E78895',
              }}>
              <Entypo name={'cross'} color={'red'} size={24} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                swiperRef.current.swipeRight();
              }}
              style={{
                height: 70,
                width: 70,
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
                backgroundColor: '#A5DD9B',
                borderColor: '#A5DD9B',
              }}>
              <AntDesign name={'heart'} color={'green'} size={24} />
            </TouchableOpacity>
          </View>
        </>
      ) : null}
    </SafeAreaView>
  );
};
export default HomeScreen;
