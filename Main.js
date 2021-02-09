import React, { useEffect } from "react"
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from "./screens/ProfileScreen"
import AddScreen from "./screens/AddScreen"
import CommentsScreen from "./screens/CommentsScreen"
import SearchScreen from "./screens/SearchScreen"
import FeedScreen from "./screens/FeedScreen"

import firebase from "firebase"

import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';


import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { fetchUser, fetchUserPosts, fetchUserFollowing, clearData } from "./redux/actions/index"

const Tab = createBottomTabNavigator();


const Main = (props) => {

    useEffect(() => {
        props.clearData()
        props.fetchUser()
        props.fetchUserPosts()
        props.fetchUserFollowing()
    }, [])
    // < Text > { props.currentUser.name } is logged in !</Text >
    return (<View style={styles.container}>

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
            <Tab.Screen name="Feed" component={FeedScreen} />
            <Tab.Screen name="Search" component={SearchScreen} navigation={props.navigation} />
            <Tab.Screen name="Add" component={AddScreen} />
            <Tab.Screen name="Comments" component={CommentsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen}
                listeners={({ navigation }) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("Profile", { uid: firebase.auth().currentUser.uid })
                    }
                })}

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


const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser, fetchUserPosts, fetchUserFollowing, clearData }, dispatch)


export default connect(mapStateToProps, mapDispatchProps)(Main)



