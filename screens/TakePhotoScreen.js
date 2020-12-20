import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableHighlight, Modal } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from "expo-image-picker"


export default function TakePhotoScreen() {
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [camera, setCamera] = useState(null); //actual camera
    const [image, setImage] = useState(null) // store image taken
    const [type, setType] = useState(Camera.Constants.Type.back)//front or back camer
    const [modalVisible, setModalVisible] = useState(false)

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
            setModalVisible(true)
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
            setModalVisible(true)
        }
    };


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

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                Alert.alert("Modal has been closed.");
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>New Post</Text>
                    <Image style={styles.modalImage} source={{ uri: image }} />

                    <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                        onPress={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <Text style={styles.textStyle}>Hide Modal</Text>
                    </TouchableHighlight>
                </View>
            </View>
        </Modal>



        <View style={styles.cameraContainer}>
            {/* if we have an image, show the image instead of camera view */}
            {image ? (<Image source={{ uri: image }} style={styles.fixedRatio} />)
                : (<Camera
                    ref={ref => setCamera(ref)}
                    style={styles.fixedRatio}
                    type={type}
                    ratio={"1:1"}
                />

                )}

        </View>
        <View style={styles.buttonContainer}>


            <Button
                title="Flip "
                onPress={() => {
                    setType(
                        type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back
                    );
                }}>
            </Button>
            <Button title="Take " onPress={() => takePicture()} />
            <Button title="Cancel" onPress={() => cancelTakePicture()} />
            <Button title="Upload " onPress={() => pickImage()} />
        </View>
    </View>
    );
}


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    cameraContainer: {
        flexDirection: "row"
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around"
    },
    modalView: {
        margin: 20,
        marginTop: 200,
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
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    modalImage: {
        width: 40,
        height: 40
    }
})