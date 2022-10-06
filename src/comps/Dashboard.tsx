import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";
import axios from "axios";
import NumsContext from "../context/NumsContext";
import { ProtectedRoutes } from '../comps';
import { Routes, Route } from "react-router-dom";
import TestPage from "./TestPage";
import { PATH } from "../confgs";
import logo from '../assets/logo.png';
import { Header, LogoutButton, Broadcast, NumCounter, UpdRotating, Reports, TeaInventory } from './';
import { render } from "@testing-library/react";
const cookies = new Cookies();

export default function Dashboard(props: any) {

    const token = cookies.get("session-token");
    const [numsNeeded, setNumsNeeded] = useState([]);
    const [greeting, setGreeting] = useState({
        greeting: '',
        language: ""
    });
    const [reports, setReports] = useState([{ _id: '', date: '', time: '', user: '', numsReported: [] }]);
    const [rotatingNums, setRotatingNums] = useState([]);
    const [todaysNums, setTodaysNums] = useState({
        morning: [],
        afternoon: []
    });

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        role: "",
        username: "",
        email: "",
        exp: ""
    });

    const [message, setMessage] = useState({
        currentInput: '',
        broadcast: '',
        firstName: '',
        username: ''
    });

    const [tea, setTea] = useState([]);

    const getFood = async () => {
        const foodConfig = {
            method: 'get',
            url: `${PATH}/getFood`
        };

        axios(foodConfig)
            .then((res) => {
                setNumsNeeded(res.data.target);
                console.log(res.data)
                if (res.data.message === 'food-loaded') {
                    console.log(`Numbers for ${res.data.day} ${res.data.time} have loaded successfully.`)
                };
            })
            .catch((err) => {
                console.log(err);
        })
    };  

    const getTea = async () => {
        const foodConfig = {
            method: 'get',
            url: `${PATH}/getTea`
        };

        axios(foodConfig)
            .then((res) => {
                setTea(res.data.target);
                console.log(res.data.target);
            })
            .catch((err) => {
                console.log(err);
        })
    };  

    const getRotatingNums = async () => {
        const config = {
            method: 'get',
            url: `${PATH}/rotating`
        };

        axios(config)
            .then((res) => { setRotatingNums(res.data.target) })
            .catch((err) => { console.log(err) });
    };

    const getReports = async () => {
        const config = {
            method: 'get',
            url: `${PATH}/getReports`
        };

        axios(config)
            .then((response) => { setReports( response.data.target ) })
            .catch((err) => { console.log(err) });
    };

    const getFromServer = async () => {
        getFood().then(() => {
            console.log('Food has been retrieved.')
        }).catch((err) => {
            console.log('Something went wrong with retrievng numbers.')
        });

        getRotatingNums().then(() => { console.log('Rotating numbers have been adjusted.') });
        getReports().then(() => { console.log('Reports have been loaded successfuly.') })
        getMsg().then(() => { console.log('Broadcasted message has been updated.') })
        getTea().then(() => { console.log('Tea has been updated.') })
    };

    const getMsg = async () => {
        const config = {
            method: 'get',
            url: `${PATH}/getAdminMsg`
        };

        axios(config)
        .then((succ) => {
            setMessage((prev: any) => ({
                ...prev,
                broadcast: succ.data.msg,
                username: succ.data.username,
                firstName: succ.data.firstName
            }))
        })
        .catch((err) => {
            console.log('error', err)
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
                getFromServer();
            })
            .catch((error) => {
                console.log('Something went wrong', error);
            });

            const config = {
                method: 'get',
                url: 'https://www.greetingsapi.com/random'
            };
    
            axios(config)
                .then((res) => {
                    console.log('Random greeting', res.data)
                    setGreeting(res.data)
                })
    }, []);    


    const provVals = {
        getFromServer,
        numsNeeded,
        setNumsNeeded,
        rotatingNums,
        setRotatingNums,
        user,
        setUser,
        reports,
        setReports,
        message,
        setMessage,
        todaysNums, 
        setTodaysNums,
        tea,
        setTea
    };

    const renderNumberAlert = () => {
        if ((todaysNums.morning.length > 0) && (todaysNums.afternoon.length > 0)) {
            return 'You will have numbers in the morning and the afternoon'
        } else if ((todaysNums.morning.length > 0) && (todaysNums.afternoon.length <= 0)) {
            return 'You will only have numbers in the morning'
        } else if (todaysNums.morning.length <= 0 && todaysNums.afternoon.length > 0) {
            return 'You will only have numbers in the afternoon'
        };
    };
    
     
return(<>
        <div className="flex gap-2 flex-col justify-between min-h-screen min-w-screen">
            <NumsContext.Provider value={provVals}>

                <div className="w-screen p-10 bg-blue-500 flex flex-col sm:flex-row md:justify-around justify-center items-center">
                    <img src={logo} alt="ucl logo" className="w-1/2 md:w-3/12 max-w-xs" />
                    <h1 className="pt-10 md:pt-0 text-center text-2xl max-w-sm md:text-3xl self-center text-white">{greeting.greeting} {user.firstName}! <br /> That's Hello in {greeting.language}.</h1>
                </div> 

                <h1 className="text-center md:text-6xl text-4xl pl-6 pb-6 font-bold uppercase">Dashboard</h1>

{/* 
                <Header /> */}
                
                <div className="flex flex-col self-center w-10/12 justify-center gap-4 overflow-y-scroll">
                <NumCounter />
                {/* <UpdRotating /> */}
                <Reports />
                {/* <Broadcast /> */}
                <TeaInventory />
                </div>
                <div className="text-center mb-6">
                <LogoutButton />
                </div>
            </NumsContext.Provider>
        </div>
        
        {(!cookies.get('session-token')) && <Navigate to="/" />}
    </>)
}