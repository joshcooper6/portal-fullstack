import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";
import axios from "axios";
import NumsContext from "../context/NumsContext";
import { PATH } from "../confgs";
import logo from '../assets/logo.png';
import Fuse from 'fuse.js';
import { Header, LogoutButton, Broadcast, Search, NumCounter, UpdRotating, Reports, TeaInventory } from './';
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
        setFoodDB,
        token
        // setTodaysNums,
    };

    // const [searchQuery, setSearchQuery] = useState();;

    // const fuse = new Fuse(foodDB, {keys: ["name", "id", "vendor"], threshold: 0.1},);

    // const searchFor = (value: any) => {
    //     if (!value) {
    //         return []
    //     }

    //     return fuse.search(value).map((result) => result.item);
    // };

    // const resultsArray = searchFor(searchQuery);

    // const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    // const checkboxes = (item: any, dayOfWeek: any) => {
    //     const formattedDay = dayOfWeek.slice(0,1).toUpperCase() + dayOfWeek.slice(1).toLowerCase();

    //     return (<>
    //         <p>{formattedDay} Morning: {item?.[`${dayOfWeek}`].morning ? 'True' : 'False'}</p>
    //         <p>{formattedDay} Afternoon: {item?.[`${dayOfWeek}`].afternoon ? 'True' : 'False'}</p>
    //     </>)
    // };


    // const renderedSeachItem = (item: any) => {
    //     return(<div key={item.name} className="flex flex-col justify-center items-center">
    //             <p>Name: {item.name}</p>
    //             <p>ID: {item.id}</p>
    //             {weekdays.map((day: String) => { return checkboxes(item, day) })}
    //             <button className="text-teal hover:scale-110 m-4 font-black border-0 rounded-full bg-slate-600 p-4">Update Food Item</button>
    //         </div>)
    // };

    // console.log(resultsArray)
        
return(<>
        <div className="flex gap-2 pb-10 flex-col min-w-screen justify-center align-center">
            <NumsContext.Provider value={provVals}>

                <Header />
                <Search />
                <NumCounter />
                <Reports />
                {user?.role === 'Admin' && <TeaInventory /> }
                
            </NumsContext.Provider>
        </div>
        
        {(!cookies.get('session-token')) && <Navigate to="/" />}
    </>)
}