import React from "react"
import { View, Text, Image, StyleSheet, SafeAreaView } from "react-native"


import { Foundation } from '@expo/vector-icons';

import Logo from "./Logo"

const Header = ({ title }) => {

    return <SafeAreaView>
        <View style={styles.container}>
            <Logo title={title} />
        </View>
    </SafeAreaView>



}

const styles = StyleSheet.create({
    container: {
        height: 70,
        backgroundColor: "rgb(40,90,135)",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    }

})

export default Header