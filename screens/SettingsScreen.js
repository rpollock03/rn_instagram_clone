import React, { useContext } from "react"
import { StyleSheet } from "react-native"
import { Button, Text, Header } from 'react-native-elements'
import { View } from "react-native"
import Spacer from "../components/Spacer"

import firebase from "firebase"
require("firebase/firestore")

const SettingsScreen = (props) => {


    const onLogout = () => {
        firebase.auth().signOut();
    }

    return <>

        <View style={styles.container}>
            <Spacer>
                <Button title="Sign Out" onPress={onLogout} />
            </Spacer>
            <Spacer>
                <Button title="Change Password" onPress={() => console.log("something")} />
            </Spacer>
            <Spacer>
                <Button title="Delete Account" buttonStyle={{
                    backgroundColor: "red"
                }} onPress={() => console.log("something")} />
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