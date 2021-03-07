import React, { useState, useEffect } from "react"
import { Text, View, Image, StyleSheet, TouchableOpacity, FlatList, ScrollView } from "react-native"

import firebase from "firebase"
require("firebase/firestore")
require("firebase/firebase-storage")
import * as ImagePicker from "expo-image-picker"

import { Divider, Avatar, Header, ListItem, Button, Input } from 'react-native-elements'
import { SimpleLineIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import Spacer from "../components/Spacer"

import { MaterialIcons } from '@expo/vector-icons';

import { useDispatch, useSelector } from "react-redux"
import { updateUserProfile } from "../redux/actions/index"



const EditProfileScreen = (props) => {

    const currentUser = useSelector(store => store.userState.currentUser)
    const dispatch = useDispatch()

    const [name, setName] = useState("")
    const [userName, setUserName] = useState("")
    const [bio, setBio] = useState("")
    const [profileImage, setProfileImage] = useState(null) // store image taken
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);


    const handleSubmit = async () => {
        const response = await fetch(profileImage)
        const blob = await response.blob()
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`
        console.log(childPath)
        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob)

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((downloadUrl) => {
                dispatch(updateUserProfile(name, userName, bio, downloadUrl))
                setProfileImage(null)
                props.navigation.navigate("Profile")
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted)
    }











    useEffect(() => {
        (async () => {
            //for image picker from expo docs
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted');

        })();
    }, []);


    // upload image 
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, //can change to All or Videos
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            setProfileImage(result.uri);
        }
    };

    if (hasGalleryPermission === null) {
        return <View />;
    }
    if (hasGalleryPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (<ScrollView>
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
                placeholder={currentUser.name}
                value={name}
                onChangeText={(newName) => setName(newName)}
                autoCorrect={false}
                leftIcon={{ type: 'MaterialIcons', name: 'account-circle' }}
            />
        </Spacer>
        <Spacer>
            <Input
                label="Username"
                placeholder={currentUser.userName}
                value={userName}
                onChangeText={(newUserName) => setUserName(newUserName)}
                autoCorrect={false}
                leftIcon={{ type: 'MaterialIcons', name: 'account-circle' }}
            />
        </Spacer>
        <Spacer>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
                {currentUser.profilePic || profileImage
                    ? (
                        <Avatar source={{ uri: profileImage || currentUser.profilePic }} size="xlarge" />
                    ) : <Avatar rounded icon={{ name: 'home' }} size="xlarge" overlayContainerStyle={{ backgroundColor: 'grey' }} />
                }
            </View>


        </Spacer>
        <Spacer>
            <Button title="Choose new profile pic" onPress={() => pickImage()} />
        </Spacer>
        <Spacer>
            <Input
                label="Bio"
                placeholder={currentUser.bio}
                value={bio}

                onChangeText={(newBio) => setBio(newBio)}
                leftIcon={{ type: 'MaterialIcons', name: 'article' }}


            />
        </Spacer>

        <Spacer>
            <Button title="submit" onPress={handleSubmit} />
        </Spacer>


    </ScrollView>)
}

const styles = StyleSheet.create({

})



export default EditProfileScreen