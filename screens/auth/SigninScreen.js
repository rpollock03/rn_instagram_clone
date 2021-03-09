import React, { useState } from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"

import { Text, Button, Input } from "react-native-elements"
import Spacer from "../../components/Spacer"

import { firebase } from "../../firebase/config"


const SigninScreen = ({ navigation }) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [error, setError] = useState(false)

    const onSignIn = async () => {
        try {
            const result = await firebase.auth().signInWithEmailAndPassword(email, password)
            console.log(result)
        } catch (err) {
            console.log(err)
        }
    }

    return (<View style={styles.container}>
        <Spacer>
            <Text h1 h1Style={{ fontSize: 60 }} style={{ textAlign: "center", fontFamily: "Billabong", marginBottom: 20, marginTop: 100 }}>Robstagram</Text>
            <Input
                label="Email"
                placeholder="your@email.com"
                value={email}
                onChangeText={(newEmail) => setEmail(newEmail)}
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon={{ type: 'MaterialIcons', name: 'email' }}

                errorMessage={email.length < 4 && email.length > 0 || email.length > 1 && !email.includes("@") ? "Please enter a valid email address" : null}
            />

            <Input
                placeholder="******"
                label="Password"
                value={password}
                onChangeText={(newPassword) => setPassword(newPassword)}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                rightIcon={<Text h5 style={{ color: "rgb(64,93,230)" }} >Forgot?</Text>}
                leftIcon={{ type: 'MaterialIcons', name: 'lock-outline' }}
                errorMessage={password.length < 4 && password.length > 0 ? "Please enter a valid email password" : null}
            />
        </Spacer>

        <Spacer>
            <Button
                onPress={() => onSignIn()}
                title="Sign In"
            />
        </Spacer>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Spacer>
                <Text style={styles.link}>Don't have an account? <Text style={{ fontWeight: "bold" }}>Sign up instead</Text> </Text>
            </Spacer>
        </TouchableOpacity>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1


    },
    errorMessage: {
        fontSize: 16,
        color: "red",
        textAlign: "center"
    },
    link: {
        color: "grey",
        textAlign: "center"
    }
})

export default SigninScreen