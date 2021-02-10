import React, { useState } from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"

import { Text, Button, Input } from "react-native-elements"
import Spacer from "../../components/Spacer"

import { firebase } from "../../firebase/config"

import { MaterialIcons } from '@expo/vector-icons';

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

    return (<View style={styles.container}>
        <Spacer>
            <Text h1 h1Style={{ fontSize: 60 }} style={{ textAlign: "center", fontFamily: "Billabong" }}>Instagram</Text>
        </Spacer>
        <Spacer>
            <Input
                label="Email"
                placeholder="Rob@rob.com"
                value={email}
                onChangeText={(newEmail) => setEmail(newEmail)}
                autoCapitalize="none"
                autoCorrect={false}
                leftIcon={{ type: 'MaterialIcons', name: 'email' }}
            />
        </Spacer>
        <Spacer>
            <Input
                placeholder="******"
                label="Password"
                value={password}
                onChangeText={(newPassword) => setPassword(newPassword)}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                leftIcon={{ type: 'MaterialIcons', name: 'lock-outline' }}
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
        flex: 1,
        justifyContent: "center",
        marginBottom: 200
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