import { useEffect, useState } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import axios from "axios";
import NumsContext from "../context/NumsContext";
import { PATH } from "../confgs";
import { Header, LogoutButton, CreateFoodItem, Spinner, Broadcast, RotatingItem, Search, NumCounter, UpdRotating, Reports, TeaInventory } from './';
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
    const [loading, setLoading] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const getAll = async () => {
        const foodConfig = {
            method: 'get',
            url: `${PATH}/getAll`
        };

        setLoading(true);

        axios(foodConfig)
            .then((res) => {
                setFoodDB(res.data.target);
                setLoading(false);
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

        setLoading(true);

        axios(configuration)
            .then((result) => {
                setUser(result.data.user);
                setLoading(false);
                getAll().then(() => console.log('food loaded'));
            })
            .catch((error) => {
                console.log('Something went wrong', error);
            });
    }, []);    

    useEffect(() => {
        console.log(foodDB)
    }, [foodDB]);

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

    // const rotatingNums = foodDB.filter((x: any) => x?.rotating === true);
    // console.log('rotaitng', rotatingNums);

return(<>
        <div className="flex pb-10 bg-slate-100 flex-col min-w-screen min-h-screen z-0">
            <NumsContext.Provider value={provVals}>
                
                <Header />

                <Search />
                
                <div className="w-full flex max-w-2xl self-center">
                    <h2 className="w-10/12 font-thin ml-10 mb-10 text-6xl md:max-w-md max-w-xs">Which task are you looking for?</h2>
                </div>
                
                { loading ? <Spinner /> : <NumCounter /> }

                {user?.role === 'Admin' && <>
                    <CreateFoodItem />
                    <TeaInventory />
                </>}

                {/* <div className="self-center w-full flex flex-col items-center justify-center">
                    {rotatingNums.map((item: any) => {
                        return <>
                            <RotatingItem item={item} />
                        </>
                    })}
                </div> */}

                
            </NumsContext.Provider>
        </div>
        
        {(!cookies.get('session-token')) && <Navigate to="/" />}
    </>)
}