import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";
import axios from "axios";
import LogoutButton from "./LogoutButton";
const cookies = new Cookies();

export default function Dashboard(props: any) {

    const token = cookies.get("session-token");
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        username: "",
        exp: ""
    });

    console.log('FRONT', user)

    useEffect(() => {
        const configuration = {
        method: "get",
        url: "http://localhost:5000/auth",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        };

        axios(configuration)
            .then((result) => {
                setUser(result.data.user);
            })
            .catch((error) => {
            error = new Error();
            });
    }, [])

    const conv = (user?.exp)

return(<>
        <h1>Welcome {user?.firstName}! You are known to the world as {user.username}.</h1>


        <LogoutButton 
            tailwindstyles={'bg-blue-500 p-4 rounded-xl w-2/3'} 
        />
        
        {!cookies.get('session-token') && <Navigate to="/" />}
    </>)
}