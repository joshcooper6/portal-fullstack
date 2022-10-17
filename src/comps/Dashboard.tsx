import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";
import axios from "axios";
import NumsContext from "../context/NumsContext";
import { ProtectedRoutes } from '../comps';
import { Routes, Route } from "react-router-dom";
import TestPage from "./TestPage";
import { PATH } from "../confgs";
import { Header, LogoutButton, Broadcast, NumCounter, UpdRotating, Reports, TeaInventory } from './';
const cookies = new Cookies();

export default function Dashboard(props: any) {
    const token = cookies.get("session-token");
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        role: "",
        username: "",
        email: "",
        exp: ""
    });
    const [foodDB, setFoodDB] = useState([]);

    const getAll = async () => {
        const foodConfig = {
            method: 'get',
            url: `${PATH}/getAll`
        };

        axios(foodConfig)
            .then((res) => {
                setFoodDB(res.data.target);
            })
            .catch((err) => {
                console.log(err);
        })
    };

    useEffect(() => {
        const configuration = {
            method: "get",
            url: `${PATH}/auth`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        axios(configuration)
            .then((result) => {
                setUser(result.data.user);
                getAll();
            })
            .catch((error) => {
                console.log('Something went wrong', error);
            });
    }, []);    

    const provVals = {
        getAll,
        user,
        setUser,
        foodDB,
        setFoodDB
        // setTodaysNums,
    };

     
return(<>
        <div className="flex gap-2 flex-col min-h-screen min-w-screen justify-center align-center">
            <NumsContext.Provider value={provVals}>
                <Header />
                <LogoutButton />
                <NumCounter />
                {/* <UpdRotating /> */}
                <Reports />
                {/* <Broadcast /> */}

                {user.role === 'Admin' && <TeaInventory /> }
                
            </NumsContext.Provider>
        </div>
        
        {(!cookies.get('session-token')) && <Navigate to="/" />}
    </>)
}