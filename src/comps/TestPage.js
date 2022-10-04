import { useEffect, useState } from "react";
import axios from "axios";
require('dotenv').config();
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";
const cookies = new Cookies();

export default function TestPage() {

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
            })
            .catch((error) => {
                console.log('Something went wrong', error);
            });
    }, []);    



    return <>Test
    
    
    {(!cookies.get('session-token')) && <Navigate to="/" />}

    </>
}