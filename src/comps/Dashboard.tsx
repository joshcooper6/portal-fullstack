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
        email: "",
        exp: ""
    });

    const [numsNeeded, setNumsNeeded] = useState([]);

    const getFood = () => {
        const foodConfig = {
            method: 'get',
            url: 'http://localhost:5000/getFood'
        };

        axios(foodConfig)
            .then((res) => {
                setNumsNeeded(res.data.food)
            })
            .catch((err) => {
                console.log(err)
        })
    };

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
                console.log('Something went wrong', error)
            });

        getFood();
        console.log(numsNeeded)
    }, []);


return(<>
        <div className="flex gap-4 flex-col min-h-screen min-w-screen justify-center align-center">

            <h1 className="text-3xl md:text-4xl lg:text-5xl self-center uppercase font-bold tracking-tight">Welcome {user?.firstName}!</h1>

            <h2 className="text-lg text-center self-center">
                You are known to the world as <b>{user.username}</b>.
                <br />
                {user.email.length > 0 ? <>
                    The email you have on file is <b>{user.email}</b>.
                </> : <>
                    You have not added an email on file yet.
                </>}
            </h2>
            
            <form className="flex flex-col self-center justify-center align-center">
                {numsNeeded.map((foodItem: any) => {
                return <li>{foodItem.name}</li>
                })}
            </form>
            
            <LogoutButton 
                styles={'text-white uppercase tracking-widest self-center bg-blue-500 p-4 rounded-xl w-2/5'} 
            />

        </div>
        
        {(!cookies.get('session-token')) && <Navigate to="/" />}
    </>)
}