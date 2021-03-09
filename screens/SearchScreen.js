import React, { useState } from "react"
import { Text, View, StyleSheet, Button, FlatList, TouchableOpacity } from "react-native"


import firebase from "firebase"
require("firebase/firestore")

import { SearchBar, Header, ListItem, Avatar } from "react-native-elements"

const SearchScreen = (props) => {


    const [foundUsers, setFoundUsers] = useState([])
    const [searchTerm, setSearchTerm] = useState("")



    const fetchUsers = (search) => {
        firebase.firestore()
            .collection("users")
            .where("userName", ">=", search) //find docs where name is equal or starts with. eg t will bring all names beginning with T.
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data()
                    const id = doc.id
                    return { id, ...data }
                })
                setFoundUsers(users)
            })
    }

    return (<>
        <Header
            placement="center"
            centerComponent={{ text: 'Robstagram', style: { fontFamily: "Billabong", color: "#FFF", fontSize: 44 } }}
            containerStyle={{
                backgroundColor: "rgb(40,90,135)",
                height: 100,
            }}
        />
        <SearchBar
            placeholder="Type Here..."
            onChangeText={(search) => {
                setSearchTerm(search)
                fetchUsers(search)
            }}
            value={searchTerm}
            lightTheme
            round
            cancelIcon
            cancelButtonProps
        />
        <FlatList
            data={foundUsers}
            numColumns={1}
            horizontal={false}
            renderItem={({ item }) => {
                return (
                    <TouchableOpacity onPress={() => props.navigation.navigate("Profile", { uid: item.id })
                    }>
                        <ListItem bottomDivider>
                            {item.profilePic ? <Avatar source={{ uri: item.profilePic }} size="small" rounded /> : <Avatar rounded icon={{ name: "home" }} size="small" rounded overlayContainerStyle={{ backgroundColor: "grey" }} />}
                            <ListItem.Content>
                                <ListItem.Title style={{ fontWeight: "bold" }}>@{item.userName || "blank"}</ListItem.Title>
                                <ListItem.Subtitle>{item.name || "blank"}</ListItem.Subtitle>
                            </ListItem.Content>

                            <ListItem.Chevron size={44} />

                        </ListItem>

                    </TouchableOpacity>)
            }
            }

        />
    </>
    )
}







const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});



export default SearchScreen