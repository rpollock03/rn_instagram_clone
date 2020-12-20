import React from "react"
import { Text, View, StatusBar, Image, StyleSheet } from "react-native"

import Header from "../components/Header"

const ProfileScreen = ({ navigation }) => {


    return (<React.Fragment>
        <Header title="YOUR NAME HERE" />
        <View style={styles.container}>
            <Text> This is the profile for my react instagrsam clone!</Text>
            <Image source={require("../assets/placeholderpic.jpg")} style={styles.profilePic} />

        </View>

    </React.Fragment>)


}

const styles = StyleSheet.create({
    profilePic: {
        height: 100,
        width: 100,
        borderRadius: 50
    },
    container: {
        flex: 1,
        height: "100%"
    }

})


export default ProfileScreen