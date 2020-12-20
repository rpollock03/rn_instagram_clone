import React from "react"
import { Text, View, StyleSheet, Button } from "react-native"

import Header from "../components/Header"

const HomeScreen = ({ navigation }) => {


    return <Header title="Instagram" />
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});



export default HomeScreen