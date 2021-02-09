import React, { useState } from "react"
import { Text, View, StyleSheet, Button, TextInput } from "react-native"

import { firebase } from "../../firebase/config"

const SigninScreen = ({ navigation }) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const onSignIn = async () => {
        try {
            const result = await firebase.auth().signInWithEmailAndPassword(email, password)
            console.log(result)
        } catch (err) {
            console.log(err)
        }
    }

    return (<View style={styles}>
        <Text>This is signup screen</Text>
        <TextInput
            placeholder="email"
            onChangeText={(e) => setEmail(e)}
        />
        <TextInput
            placeholder="password"
            onChangeText={(p) => setPassword(p)}
            secureTextEntry
        />
        <Button
            onPress={() => onSignIn()}
            title="Sign In"
        />
    </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    }
})

export default SigninScreen