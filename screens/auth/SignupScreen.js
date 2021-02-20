import React, { useState } from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"

import { Text, Button, Input } from "react-native-elements"
import Spacer from "../../components/Spacer"

import { firebase } from "../../firebase/config"

import { MaterialIcons } from '@expo/vector-icons';


const SignupScreen = ({ navigation }) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [userName, setUserName] = useState("")

    const onSignUp = async () => {
        try {
            const result = await firebase.auth().createUserWithEmailAndPassword(email, password)
            //firebase.auth.userid thing is from variables that shows on firebase authentication page
            firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).set({
                name,
                email,
                userName
            })
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
                label="Name"
                placeholder="John Smith"
                value={name}
                onChangeText={(newName) => setName(newName)}
                autoCorrect={false}
                leftIcon={{ type: 'MaterialIcons', name: 'account-circle' }}
            />
        </Spacer>
        <Spacer>
            <Input
                label="Username"
                placeholder="@jsmith123"
                value={userName}
                onChangeText={(newUserName) => setUserName(newUserName)}
                autoCorrect={false}
                leftIcon={{ type: 'MaterialIcons', name: 'account-circle' }}
            />
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
                onPress={() => onSignUp()}
                title="Sign Up"
            />
        </Spacer>
        <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
            <Spacer>
                <Text style={styles.link}>Already have an account? <Text style={{ fontWeight: "bold" }}>Sign in instead</Text> </Text>
            </Spacer>
        </TouchableOpacity>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        marginBottom: 50
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



export default SignupScreen