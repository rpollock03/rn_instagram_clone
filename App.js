import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';


import HomeScreen from "./screens/HomeScreen"
import ProfileScreen from "./screens/ProfileScreen"
import TakePhotoScreen from "./screens/TakePhotoScreen"
import CommentsScreen from "./screens/CommentsScreen"
import SearchScreen from "./screens/SearchScreen"

import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import * as Font from 'expo-font';



const Tab = createBottomTabNavigator();




export default function App() {

  const [fontLoaded, setFontLoaded] = useState(false)

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


  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === "Home") {
              return <Entypo name="home" size={38}

                color={focused ? 'rgb(248,252,255)' : "rgb(173,177,180)"}



              />
            } else if (route.name === "TakePhoto") {
              return <FontAwesome5 name="camera-retro" size={38} color={focused ? 'rgb(248,252,255)' : "rgb(173,177,180)"} />
            } else if (route.name === "Comments") {
              return <FontAwesome name="comments" size={38} color={focused ? 'rgb(248,252,255)' : "rgb(173,177,180)"} />
            } else if (route.name === "Search") {
              return <AntDesign name="search1" size={38} color={focused ? 'rgb(248,252,255)' : "rgb(173,177,180)"} />
            }
            else return <FontAwesome name="user" size={38} color={focused ? 'rgb(248,252,255)' : "rgb(173,177,180)"} />
          },
        })}
        tabBarOptions={{
          activeBackgroundColor: "rgb(45,91,130)",
          showLabel: false,
          style: {
            height: "10%",
            backgroundColor: "rgb(36,41,42)",

          },
          activeStyle: {
            color: 'blue'
          },



        }}

      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="TakePhoto" component={TakePhotoScreen} />
        <Tab.Screen name="Comments" component={CommentsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />

      </Tab.Navigator>
    </NavigationContainer>
  );




}


