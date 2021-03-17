import React, { useEffect } from "react"
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from "./screens/ProfileScreen"
import AddScreen from "./screens/AddScreen"
import SearchScreen from "./screens/SearchScreen"
import FeedScreen from "./screens/FeedScreen"
import SettingsScreen from "./screens/SettingsScreen"
import firebase from "firebase"

import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';


import { useDispatch, useSelector } from "react-redux"
import { fetchUser, fetchUserPosts, fetchUserFollowing, clearData } from "./redux/actions/index"

const Tab = createBottomTabNavigator();


const Main = (props) => {

    const dispatch = useDispatch()
    const currentUser = useSelector(store => store.userState.currentUser)

    useEffect(() => {
        dispatch(clearData())
        dispatch(fetchUser())
        dispatch(fetchUserPosts())
        dispatch(fetchUserFollowing())
    }, [])
    // < Text > { props.currentUser.name } is logged in !</Text >
    return (
        <View style={styles.container}>
            <Tab.Navigator
                tabBarOptions={{
                    activeBackgroundColor: "rgb(45,91,130)",
                    showLabel: false,
                    style: {
                        height: "9%",
                        backgroundColor: "rgb(36,41,42)",
                    },
                    activeStyle: {
                        color: 'blue'
                    },
                }}
            >
                <Tab.Screen name="Feed" component={FeedScreen}
                    options={{
                        tabBarIcon: ({ focused, color, size }) => (
                            <Entypo name="home" size={focused ? 40 : 29}
                                color={focused ? 'rgb(248,252,255)' : "rgb(173,177,180)"} />
                        )
                    }}
                />
                <Tab.Screen name="Search" component={SearchScreen} navigation={props.navigation}
                    options={{
                        tabBarIcon: ({ focused, color, size }) => (
                            <AntDesign name="search1" size={focused ? 40 : 29} color={focused ? 'rgb(248,252,255)' : "rgb(173,177,180)"} />
                        )
                    }}
                />
                <Tab.Screen name="Add" component={AddScreen}
                    options={{
                        tabBarIcon: ({ focused, color, size }) => (
                            <FontAwesome5 name="plus" size={focused ? 40 : 29} color={focused ? 'rgb(248,252,255)' : "rgb(173,177,180)"} />
                        )
                    }}
                />
                <Tab.Screen name="Profile" component={ProfileScreen}
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Profile", { uid: firebase.auth().currentUser.uid })
                        }
                    })}
                    options={{
                        tabBarIcon: ({ focused, color, size }) => (
                            <FontAwesome name="user" size={focused ? 40 : 29} color={focused ? 'rgb(248,252,255)' : "rgb(173,177,180)"} />
                        )
                    }}
                />

                <Tab.Screen name="Settings" component={SettingsScreen}
                    options={{
                        tabBarIcon: ({ focused, color, size }) => (
                            <FontAwesome name="cogs" size={focused ? 40 : 29} color={focused ? 'rgb(248,252,255)' : "rgb(173,177,180)"} />
                        )
                    }}
                />
            </Tab.Navigator >
        </View>)
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    }
})


export default Main



