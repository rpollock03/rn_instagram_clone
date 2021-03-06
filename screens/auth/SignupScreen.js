import React, { useState } from "react"
import { StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { Text, Button, Input, Avatar } from "react-native-elements"
import Spacer from "../../components/Spacer"

import { firebase } from "../../firebase/config"


const SignupScreen = ({ navigation }) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [userName, setUserName] = useState("")
    const [bio, setBio] = useState("")

    const handleSignUp = async () => {
        try {
            const result = await firebase.auth().createUserWithEmailAndPassword(email, password)
            firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).set({
                name,
                email,
                userName,
                bio
            })
            //add own userId automatically to following list (effectively so that your own posts show up in feed)
            firebase.firestore()
                .collection("following")
                .doc(firebase.auth().currentUser.uid)
                .collection("userFollowing")
                .doc(firebase.auth().currentUser.uid)
                .set({})
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <ScrollView style={styles.container}>
            <Spacer>
                <Text h1 h1Style={{ fontSize: 60 }} style={{ textAlign: "center", fontFamily: "Billabong", marginBottom: 20, marginTop: 100 }}>Robstagram</Text>
                <Input
                    label="Name"
                    placeholder="John Smith"
                    value={name}
                    onChangeText={(newName) => setName(newName)}
                    autoCorrect={false}
                    leftIcon={{ type: 'MaterialIcons', name: 'account-circle' }}
                    errorMessage={name.length < 4 && name.length > 0 ? "Please enter a valid name" : null}
                />
                <Input
                    label="Username"
                    placeholder="user123"
                    value={userName}
                    onChangeText={(newUserName) => setUserName(newUserName)}
                    autoCorrect={false}
                    leftIcon={{ type: 'MaterialIcons', name: 'alternate-email' }}
                    errorMessage={userName.length < 4 && userName.length > 0 ? "Please enter a valid user name" : null}
                />
                <Input
                    label="Email"
                    placeholder="Rob@rob.com"
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
                    leftIcon={{ type: 'MaterialIcons', name: 'lock-outline' }}
                    errorMessage={password.length < 4 && password.length > 0 ? "Please enter a valid email password" : null}
                />
                <Input
                    label="Bio"
                    placeholder={"Here's to the crazy ones..."}
                    value={bio}
                    onChangeText={(newBio) => setBio(newBio)}
                    leftIcon={{ type: 'MaterialIcons', name: 'article' }}
                />
            </Spacer>

            <Spacer>
                <Button
                    onPress={() => handleSignUp()}
                    title="Sign Up"
                />
            </Spacer>
            <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
                <Spacer>
                    <Text style={styles.link}>Already have an account? <Text style={{ fontWeight: "bold" }}>Sign in instead</Text> </Text>
                </Spacer>
            </TouchableOpacity>
        </ScrollView>
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
        textAlign: "center",
        marginBottom: 100
    }
})


export default SignupScreen