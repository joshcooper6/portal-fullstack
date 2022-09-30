import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";
import axios from "axios";
import TextToInput from "./TextToInput";
import LogoutButton from "./LogoutButton";
import NumCounter from "./NumCounter";
const cookies = new Cookies();

export default function Dashboard(props: any) {

    const token = cookies.get("session-token");
    const [numsNeeded, setNumsNeeded] = useState([]);
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        exp: ""
    });
    
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
    }, []);

    const [repNums, setRepNums] = useState(false);


return(<>
        <div className="flex gap-4 mt-4 mb-4 flex-col min-h-screen min-w-screen justify-center align-center">

            <h1 className="text-4xl md:text-5xl self-center uppercase text-center font-bold tracking-tight">Welcome {user?.firstName}!</h1>

            <LogoutButton 
                styles={'text-white uppercase tracking-widest self-center bg-blue-500 p-4 rounded-xl w-2/5'} 
            />

            <h2 className="self-center text-center text-4xl tracking-tightest uppercase font-bold">Current Info</h2>


            <h2 className="text-lg text-center self-center">
                You are known to the world as <b>{user.username}</b>.
                <br />
                {user.email.length > 0 ? <>
                    The email you have on file is <b>{user.email}</b>.
                </> : <>
                    You have not added an email on file yet.
                </>}
            </h2>
            
            {/* <form className="flex flex-col self-center justify-center align-center">
                {numsNeeded.map((foodItem: any) => {
                return <li key={foodItem.id} id={foodItem.id}>{foodItem.name}</li>
                })}
            </form> */}

            <h2 className="self-center text-center text-4xl tracking-tightest uppercase font-bold">Lead Tasks</h2>
            
            <button onClick={() => setRepNums(!repNums)} className="p-4 tracking-widest uppercase bg-blue-100 rounded-xl border w-2/5 self-center">Food Numbers</button>

            {repNums && <>
                <div className="flex flex-col gap-2 max-w-lg w-9/12 self-center">
                    {numsNeeded.map((obj: any) => {
                        return <>
                        <div className="flex gap-2">
                            <TextToInput 
                                    key={obj.id} 
                                    setNumsNeeded={setNumsNeeded} 
                                    numsNeeded={numsNeeded}
                                    id={obj.id}
                                    value={obj.name} 
                                />
                        </div>
    
                        </>
                        
                    })}
                </div>
            </>}


        </div>
        
        {(!cookies.get('session-token')) && <Navigate to="/" />}
    </>)
}