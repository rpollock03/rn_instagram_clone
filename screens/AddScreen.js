import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { Input, Overlay, Text, Button } from "react-native-elements"
import * as ImagePicker from "expo-image-picker"

import firebase from "firebase"
require("firebase/firestore")
require("firebase/firebase-storage")

import Spacer from "../components/Spacer"
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

import { useSelector, useDispatch } from "react-redux"
import { addNewPost } from "../redux/actions/index"

export default function AddScreen({ navigation }) {
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [camera, setCamera] = useState(null); //actual camera
    const [image, setImage] = useState(null) // store image taken
    const [type, setType] = useState(Camera.Constants.Type.back)//front or back camer
    const [overlayVisible, setOverlayVisible] = useState(false)

    const [location, setLocation] = useState("")
    const [caption, setCaption] = useState("")

    const dispatch = useDispatch()


    useEffect(() => {
        (async () => {
            //for camera
            const cameraStatus = await Camera.requestPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');

            //for image picker from expo docs
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted');

        })();
    }, []);

    //creat a function that stores picture in a variable.
    const takePicture = async () => {
        if (camera) {
            const data = await camera.takePictureAsync(null)
            setImage(data.uri) //this is temp file where picture is stored. Assign it to state image
        }
    }

    // upload image 
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, //can change to All or Videos
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };


    const uploadImage = async () => {
        const response = await fetch(image)
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
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                dispatch(addNewPost(snapshot, caption, location))
                console.log(snapshot)
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted)
    }



    const toggleOverlay = () => {
        setOverlayVisible(!overlayVisible)
    }

    const submitPost = () => {
        if (location.length < 1 || caption.length < 1) {
            Alert.alert(
                "Missing fields!",
                "Please fill in post properly",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            );
            return;
        }
        // PROCESS NEW POST
        uploadImage()
        setOverlayVisible(false);
        setImage(null)
        setCaption("")
        setLocation("")
        navigation.navigate("Feed")
    }


    //function we make to remove the picture from image state and so restoring camera
    const cancelTakePicture = () => {
        setImage(null)
    }

    if (hasCameraPermission === null || hasGalleryPermission === null) {
        return <View />;
    }
    if (hasCameraPermission === false || hasGalleryPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (<View style={styles.mainContainer}>

        <Overlay
            overlayStyle={{ width: "90%" }}
            isVisible={overlayVisible}
            onBackdropPress={toggleOverlay}


        ><View style={{ alignItems: "center" }}>
                <Spacer>
                    <Text h3>Create New Post</Text>
                </Spacer>

                <Spacer>
                    <Image style={{ width: 160, height: 160 }} source={{ uri: image }} />

                </Spacer>

                <Input placeholder="Add caption" label="caption" leftIcon={{ type: "entypo", name: "text" }} value={caption} onChangeText={(text) => setCaption(text)} />
                <Input placeholder="enter location" label="location" onChangeText={(text) => setLocation(text)} value={location} leftIcon={{ type: "entypo", name: "location-pin", color: "red" }} />

                <Spacer>
                    <Button title="Submit" type="outline" onPress={() => submitPost()}
                        icon={{
                            name: "send",
                            size: 15,
                            color: "grey"
                        }}
                    />
                </Spacer>




            </View>



        </Overlay>



        <View style={styles.cameraContainer}>
            {/* if we have an image, show the image instead of camera view */}
            {image ? (<Image source={{ uri: image }} style={styles.fixedRatio} />)
                : (<Camera
                    ref={ref => setCamera(ref)}
                    style={styles.fixedRatio}
                    type={type}
                    ratio={"1:1"}
                >
                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={() => {
                            setType(
                                type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                            );
                        }}>
                        <FontAwesome name="refresh" size={40} color="white" />

                    </TouchableOpacity>
                </Camera>
                )}

        </View>
        <View style={styles.buttonContainer}>
            {!image ? (<TouchableOpacity onPress={() => takePicture()}>
                <Entypo name="circle" size={84} color="black" />
            </TouchableOpacity>)
                : (<TouchableOpacity onPress={() => cancelTakePicture()}>
                    <Entypo name="circle-with-cross" size={84} color="red" />
                </TouchableOpacity>)
            }
            <Spacer>
                {image ? (<Button title="Add to post" onPress={() => toggleOverlay()} />) : (<Button title="Choose from gallery" onPress={() => pickImage()} />)}
            </Spacer>
        </View>
    </View>
    );
}


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,

    },
    cameraContainer: {
        flexDirection: "row",
        flex: 1,
        alignItems: "center",


    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1,
        justifyContent: "flex-end",
        alignItems: "flex-start"

    },
    buttonContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"

    },
    modalView: {
        margin: 20,
        marginTop: 70,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalHeading: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold"
    },
    modalImage: {
        width: 160,
        height: 160
    },
    modalLabel: {
        marginTop: 9,
        fontSize: 18,
        fontWeight: "bold"
    },
    locationInput: {
        width: "100%",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "black",
        padding: 10,
        marginTop: 7
    },
    captionInput: {
        width: "100%",
        height: 100,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "black",
        padding: 10,
        marginTop: 7
    },
    refreshButton: {
        marginLeft: 15,
        marginBottom: 15
    }
})