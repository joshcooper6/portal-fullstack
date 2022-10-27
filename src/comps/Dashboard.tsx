import { useEffect, useState } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import axios from "axios";
import NumsContext from "../context/NumsContext";
import { PATH } from "../confgs";
import logo from '../assets/logo.png';
import search from '../assets/search.svg';
import Fuse from 'fuse.js';
import { Header, LogoutButton, CreateFoodItem, Broadcast, Search, NumCounter, UpdRotating, Reports, TeaInventory } from './';
import Cookies from "universal-cookie";
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
    const [showSearch, setShowSearch] = useState(false);

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
                getAll().then(() => console.log('food loaded'));
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
        showSearch, 
        setShowSearch,
        setFoodDB,
        token
        // setTodaysNums,
    };

return(<>
        <div className="flex pb-10 bg-slate-100 flex-col min-w-screen min-h-screen z-0">
            <NumsContext.Provider value={provVals}>
                
                <Header />

                <Search />
                
                <div className="w-full flex max-w-2xl self-center">
                    <h2 className="w-10/12 font-thin ml-10 mb-10 text-6xl md:max-w-md max-w-xs">Which task are you looking for?</h2>
                </div>
                
                <NumCounter />
                <CreateFoodItem />
                {/* <Reports /> */}
                {user?.role === 'Admin' && <TeaInventory /> }

                
            </NumsContext.Provider>
        </div>
        
        {(!cookies.get('session-token')) && <Navigate to="/" />}
    </>)
}