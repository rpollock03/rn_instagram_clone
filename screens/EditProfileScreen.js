import React, { useState, useEffect } from "react"
import { Text, View, Image, StyleSheet, TouchableOpacity, FlatList } from "react-native"

import firebase from "firebase"
require("firebase/firestore")


import { Divider, Avatar, Header, ListItem, Button, Input } from 'react-native-elements'
import { SimpleLineIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import Spacer from "../components/Spacer"

import { MaterialIcons } from '@expo/vector-icons';

import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { updateUserProfile } from "../redux/actions/index"



const EditProfileScreen = (props) => {

    const [name, setName] = useState("")
    const [userName, setUserName] = useState("")
    const [bio, setBio] = useState("")

    function handleSubmit() {
        /*  firebase.firestore()
              .collection("users")
              .doc(firebase.auth().currentUser.uid)
              .update({ name: name, bio: bio, userName: userName }) MOVE TO REDUX*/
        props.updateUserProfile(name, userName, bio)
        props.navigation.navigate("Profile")
    }

    return (<>
        <Header
            placement="left"
            leftComponent={{ icon: 'menu', color: '#fff', size: 42 }}
            centerComponent={{ text: "something", style: { color: '#fff', fontSize: 32 } }}
            rightComponent={{ icon: 'settings', color: '#fff', size: 42 }}
            containerStyle={{
                backgroundColor: "rgb(40,90,135)",
                height: 100,
            }}
        />
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
                label="Username"
                placeholder="johnSmith1234"
                value={userName}
                onChangeText={(newUserName) => setUserName(newUserName)}
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
                containerStyle={{ borderWidth: 2, borderRadius: 15, borderStyle: "solid", paddingTop: 10 }}
                numberOfLines={4}
            />
        </Spacer>
        <Spacer>
            <Button title="submit" onPress={handleSubmit} />
        </Spacer>


    </>)
}

const styles = StyleSheet.create({
    bio: {
        height: 100
    }

})


const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchProps = (dispatch) => bindActionCreators({ updateUserProfile }, dispatch)


export default connect(mapStateToProps, mapDispatchProps)(EditProfileScreen)