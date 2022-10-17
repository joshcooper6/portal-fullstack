import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";
import axios from "axios";
import NumsContext from "../context/NumsContext";
import { PATH } from "../confgs";
import logo from '../assets/logo.png';
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
        setFoodDB,
        token
        // setTodaysNums,
    };

     
return(<>
        <div className="flex gap-2 pb-10 flex-col min-w-screen justify-center align-center">
            <NumsContext.Provider value={provVals}>

                <div className="bg-blue-500 drop-shadow-xl mb-10 p-6 justify-between self-center text-center w-screen flex flex-row-reverse">
                    
                    <div id="HEADER_TEXT" className="self-center flex flex-col">
                        <h2 className="text-white self-end flex lg:text-4xl text-xl font-black uppercase">Welcome {user?.firstName} <span className="md:flex hidden font-thin">/{user?.username}</span></h2>
                        <div className="flex flex-col self-end">
                            <h2 className="text-white text-md lg:text-xl opacity-80 uppercase font-light tracking-widest">Account Role: <span className="font-bold">{user?.role}</span></h2>
                            <LogoutButton override="hover:font-black hover:opacity-100 opacity-50 self-end text-left text-white font-light uppercase" />
                        </div>
                    </div>
                    
                    <img className="w-2/12 opacity-70 logo_height self-center max-w-sm" src={logo} alt='ucl logo' />
                </div>

                {/* <Header /> */}
                {/* <LogoutButton /> */}
                <NumCounter />
                {/* <UpdRotating /> */}
                <Reports />
                {/* <Broadcast /> */}

                {user?.role === 'Admin' && <TeaInventory /> }
                
            </NumsContext.Provider>
        </div>
        
        {(!cookies.get('session-token')) && <Navigate to="/" />}
    </>)
}