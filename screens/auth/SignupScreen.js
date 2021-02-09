import React, { useState } from "react"
import { Text, View, StyleSheet, Button, TextInput } from "react-native"
import { shouldUseActivityState } from "react-native-screens"


import { firebase } from "../../firebase/config"

const SignupScreen = ({ navigation }) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")

    const onSignUp = async () => {
        try {
            const result = await firebase.auth().createUserWithEmailAndPassword(email, password)
            //firebase.auth.userid thing is from variables that shows on firebase authentication page
            firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).set({
                name,
                email
            })
            console.log(result)
        } catch (err) {
            console.log(err)
        }
    }

    return (<View style={styles}>
        <Text>This is signup screen</Text>
        <TextInput
            placeholder="name"
            onChangeText={(n) => setName(n)}
        />
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
            onPress={() => onSignUp()}
            title="Sign Up"
        />
    </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    }
})

export default SignupScreen