import React, { useState, useEffect } from "react"
import { Text, View, Image, StyleSheet, TouchableOpacity, FlatList } from "react-native"

import firebase from "firebase"
require("firebase/firestore")

import { connect } from "react-redux"

import { Divider, Avatar, Header, ListItem, Button, Input } from 'react-native-elements'
import { SimpleLineIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import Spacer from "../components/Spacer"

import { MaterialIcons } from '@expo/vector-icons';


const EditProfileScreen = (props) => {

    const [name, setName] = useState("")
    const [bio, setBio] = useState("")



    function handleSubmit() {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .update({ name: name, bio: bio })
        props.navigation.navigate("Profile")
    }

    return (<>
        <Spacer>
            <Input
                label="Name"
                placeholder="John SmithDEFhsfjkhsfjkah"
                value={name}
                onChangeText={(newName) => setName(newName)}
                autoCorrect={false}
                leftIcon={{ type: 'MaterialIcons', name: 'account-circle' }}
            />
        </Spacer>
        <Spacer>
            <Input
                label="Bio"
                placeholder="Here's to the crazy ones"
                value={bio}
                inputStyle={styles.bio}
                onChangeText={(newBio) => setBio(newBio)}
                leftIcon={{ type: 'MaterialIcons', name: 'article' }}
                multiline
                numberOfLines={6}
            />
        </Spacer>
        <Spacer>
            <Button title="cancel" onPress={() => { props.navigation.navigate("Profile") }} />
            <Button title="submit" onPress={handleSubmit} />
        </Spacer>

    </>)
}

const styles = StyleSheet.create({
    bio: {
        height: 150
    },

})

export default EditProfileScreen