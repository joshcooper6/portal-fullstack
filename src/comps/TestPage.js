import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";
const cookies = new Cookies();
// require('dotenv').config();

export default function TestPage(props) {

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        role: "",
        username: "",
        email: "",
        exp: ""
    });

    const token = cookies.get("session-token");

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

                if (result.data.error || !result.data.user) {
                    window.location.href="/";
                };
            })
            .catch((error) => {
                console.log('Something went wrong', error);
                window.location.href="/";
            });
    }, []);    

    return <>
    
        {(!cookies.get('session-token')) ? <Navigate to="/" /> : <>

            { user.username.length <= 0 ? <></> : <>
                {props.component}
            </> }

        </>}

    </>
};