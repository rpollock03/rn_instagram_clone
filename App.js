//REACT
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

//REDUX
import { Provider } from "react-redux"
import store from "./redux/store"

//REACT NAVIGATION
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import 'react-native-gesture-handler';

//FIREBASE
import { firebase } from "./firebase/config"

//AUTH COMPONENTS
import LandingScreen from "./screens/auth/LandingScreen"
import SigninScreen from "./screens/auth/SigninScreen"
import SignupScreen from "./screens/auth/SignupScreen"
import CommentsScreen from "./screens/CommentsScreen"

//MAIN COMPONENTS
import Main from "./Main"

//FONTS
import * as Font from 'expo-font';



//REACT NAVIGATION SETUP
const Stack = createStackNavigator()


// MAIN APP
const App = (props) => {

  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  //FONT ONLY
  const [fontLoaded, setFontLoaded] = useState(false)
  /*
    useEffect(() => {
      const fetchFonts = async () => {
        await Font.loadAsync({
          'Billabong': require("./assets/fonts/Billabong.ttf"),
          'Proxima': require("./assets/fonts/ProximaNovaReg.ttf")
        })
        setFontLoaded(true)
      }
  
      fetchFonts()
  
    }, [])
  
    if (!fontLoaded) {
      return (<ActivityIndicator size="large" />)
    }
    // END OF FONT ONLY */

  //check to see if user logged in already  
  useEffect(() => {
    const unlisten = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        setIsLoggedIn(false)
        setIsLoaded(true)
      } else {
        setIsLoggedIn(true)
        setIsLoaded(true)
      }
    })
    return () => {
      unlisten();
    }
  }, [])




  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
      </View>
    )
  }

  if (!isLoggedIn) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Signin" component={SigninScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
          <Stack.Screen name="Comment" component={CommentsScreen} navigation={props.navigation} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>

  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  }
})


export default App


