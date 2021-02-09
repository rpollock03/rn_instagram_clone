import React from "react"
import { View, Text, Image, StyleSheet } from "react-native"
import { Header } from "react-native-elements"


import { Foundation } from '@expo/vector-icons';

const MainHeader = ({ title }) => {
    let headerStyle
    if (title === "Instagram") {
        headerStyle = {
            // fontFamily: "Billabong",
            color: "white",
            fontSize: 42,
            marginLeft: "auto",
            marginRight: "auto",
            backgroundColor: "red",
            height: "100%",
            textAlignVertical: "bottom"


        }
    } else headerStyle = {
        //fontFamily: "Proxima",
        color: "white",
        fontSize: 30,
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: "red",
        height: 45,
        lineHeight: 45,
        textAlignVertical: "top"
    }


    return <Header
        placement="left"
        leftComponent={{ text: title, style: headerStyle }}

        rightComponent={{ icon: 'refresh', color: '#fff', size: 42, style: { backgroundColor: "red" } }}
        containerStyle={{
            backgroundColor: "rgb(40,90,135)",
            height: 100,
        }}
    />
}


export default MainHeader