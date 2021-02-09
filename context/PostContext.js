/*import React, { useState } from "react"


const PostContext = React.createContext();

//named export rather than usedefault so need to import elsewhere with curly brace
export const PostProvider = ({ children }) => {

    const [posts, setPosts] = useState([
        { location: "Dunluce castle", caption: "neat castle I visited", id: 1 },
        { location: "Ballyholme beach", caption: "best beach ever!", id: 2 }
    ])

    const addPost = () => {
        setPosts([...posts,
        {
            location: "new place",
            caption: "new caption",
            id: posts.length + 1
        }
        ])
    }

    return <PostContext.Provider value={{ data: posts, addPost: addPost }}>
        {children}
    </PostContext.Provider>
}


export default PostContext */