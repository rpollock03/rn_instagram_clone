import React, { useContext } from "react"
import { StyleSheet } from "react-native"
import { Button, Text, Header, Icon } from 'react-native-elements'
import { View } from "react-native"
import Spacer from "../components/Spacer"

import firebase from "firebase"
require("firebase/firestore")

const SettingsScreen = (props) => {


    const onLogout = () => {
        firebase.auth().signOut();
    }

    return <>
        <Header
            placement="center"
            centerComponent={{ text: 'Robstagram', style: { fontFamily: "Billabong", color: "#FFF", fontSize: 44 } }}
            containerStyle={{
                backgroundColor: "rgb(40,90,135)",
                height: 100,
            }}
        />
        <View style={styles.container}>
            <Spacer>
                <Button title="  Sign Out" onPress={onLogout} icon={
                    <Icon
                        type="entypo"
                        name="log-out"
                        size={25}
                        color="white"
                    />
                } />
            </Spacer>
            <Spacer>
                <Button title="  Change Password" onPress={() => console.log("something")} icon={
                    <Icon
                        type="entypo"
                        name="lock"
                        size={25}
                        color="white"
                    />
                } />
            </Spacer>
            <Spacer>
                <Button title="  Delete Account" buttonStyle={{
                    backgroundColor: "red"
                }} onPress={() => console.log("something")} icon={
                    <Icon
                        type="antdesign"
                        name="deleteuser"
                        size={25}
                        color="white"
                    />
                } />
            </Spacer>
        </View>
    </>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        marginBottom: 100
    }
})

export default SettingsScreen