import React from "react"
import { Text, View, StyleSheet, Button } from "react-native"

const LandingScreen = ({ navigation }) => {

    return (<View style={styles}>
        <Text>This is landing screen</Text>
        <Button
            title="Signin"
            onPress={() => { navigation.navigate("Signin") }}
        />
        <Button
            title="Register"
            onPress={() => { navigation.navigate("Signup") }}
        />
    </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    }
})

export default LandingScreen