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
import SigninScreen from "./screens/auth/SigninScreen"
import SignupScreen from "./screens/auth/SignupScreen"
import CommentsScreen from "./screens/CommentsScreen"
import SettingsScreen from "./screens/SettingsScreen"
import ShowScreen from "./screens/ShowScreen"
import EditBio from "./screens/EditProfileScreen"

//MAIN COMPONENTS
import Main from "./Main"

//FONTS
import * as Font from 'expo-font';

import { Provider as PaperProvider } from 'react-native-paper';

//REACT NAVIGATION SETUP
const Stack = createStackNavigator()


// MAIN APP
const App = (props) => {

  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  //LOAD CUSTOM FONTS FUNCTION
  const fetchFonts = async () => {
    await Font.loadAsync({
      'Billabong': require("./assets/fonts/Billabong.ttf"),
      'Proxima': require("./assets/fonts/ProximaNovaReg.ttf")
    })
  }


  //ON APP RUN 
  useEffect(() => {
    //LOAD CUSTOM FONTS
    fetchFonts()

    //CHECK IF USER LOGGED IN
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
      <PaperProvider>


        <NavigationContainer>
          <Stack.Navigator initialRouteName="Signin">
            <Stack.Screen name="Signin" component={SigninScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    );
  }

  return (

    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
            <Stack.Screen name="Comment" component={CommentsScreen} navigation={props.navigation} options={{ headerShown: false }} />
            <Stack.Screen name="Settings" component={SettingsScreen} navigation={props.navigation} options={{ headerShown: false }} />
            <Stack.Screen name="Show" component={ShowScreen} navigation={props.navigation} options={{ headerShown: false }} />
            <Stack.Screen name="EditBio" component={EditBio} navigation={props.navigation} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
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


