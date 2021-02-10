import React from "react"
import { StyleSheet } from "react-native"
import { Button, Text, Header, Image } from 'react-native-elements'
import { View } from "react-native"
import Spacer from "../components/Spacer"

import firebase from "firebase"
require("firebase/firestore")

const ShowScreen = (props) => {


    return <>

        <View style={styles.container}>
            <Text>THIS IS THE SHOW SCREEN! </Text>

            <Image
                style={styles.image}
                source={{ uri: props.route.params.downloadUrl }}
            />

        </View>
    </>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        marginBottom: 100
    },
    containerImage: {
        flex: 1
    },
    image: {
        width: 200,
        height: 200
    },

})

export default ShowScreen