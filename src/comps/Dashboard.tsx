import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";
import axios from "axios";
const cookies = new Cookies();

export default function Dashboard(props: any) {

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
            console.log(result)
            })
            .catch((error) => {
            error = new Error();
            });
    }, [])


return(<>
        <h1>Authorized.</h1>

        <button onClick={() => {
            cookies.remove('session-token', { path: "/" });
            window.location.href = "/";
        }}>Logout</button>
        
        {!cookies.get('session-token') && <Navigate to="/" />}
    </>)
}