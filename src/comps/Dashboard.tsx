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
    const [numsNeeded, setNumsNeeded] = useState([]);
    // add reports to admin only
    const [reports, setReports] = useState([{ _id: '', date: '', time: '', user: '', numsReported: [] }]);
    const [rotatingNums, setRotatingNums] = useState([]);

    const [todaysNums, setTodaysNums] = useState({
        morning: [],
        afternoon: []
    });

    console.log('NUMZ', numsNeeded)

    const dayString = () => {
        const DATE = new Date();
        const TODAY = DATE.getDay();
      
        switch(TODAY) {
          case 0:
            return 'sunday';
            break;
          case 1:
            return 'monday';
            break;
          case 2:
            return 'tuesday';
            break;
          case 3:
            return 'wednesday';
            break;
          case 4:
            return 'thursday';
            break;
          case 5:
            return 'friday';
            break;
          case 6:
            return 'saturday';
            break;
        }
      };

    console.log('day', dayString())

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

    const [tempNums, setTempNums] = useState([]);
    const [todaysNums2, setTodaysNums2] = useState([]);
    console.log('tempnums', tempNums)

    console.log(tempNums.filter((num: any) => {
        return num.rotating === true
     }));

    const getAll = async () => {
        const foodConfig = {
            method: 'get',
            url: `${PATH}/getAll`
        };

        axios(foodConfig)
            .then((res) => {
                console.log('Data recieved', res.data)
                setTempNums(res.data.target);
            })
            .catch((err) => {
                console.log(err);
        })
    };

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
        // getMsg().then(() => { console.log('Broadcasted message has been updated.') })
        getTea().then(() => { console.log('Tea has been updated.') })
    };

    // const getMsg = async () => {
    //     const config = {
    //         method: 'get',
    //         url: `${PATH}/getAdminMsg`
    //     };

    //     axios(config)
    //     .then((succ) => {
    //         setMessage((prev: any) => ({
    //             ...prev,
    //             broadcast: succ.data.msg,
    //             username: succ.data.username,
    //             firstName: succ.data.firstName
    //         }))
    //     })
    //     .catch((err) => {
    //         console.log('error', err)
    //     })
    // };

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
                getAll();
            })
            .catch((error) => {
                console.log('Something went wrong', error);
            });
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
    
     
return(<>
        <div className="flex gap-2 flex-col min-h-screen min-w-screen justify-center align-center">
            <NumsContext.Provider value={provVals}>
                <Header />
                <LogoutButton />
                <NumCounter />
                {/* <UpdRotating />
                <Reports /> */}
                {/* <Broadcast /> */}
                <TeaInventory />
            </NumsContext.Provider>
        </div>
        
        {(!cookies.get('session-token')) && <Navigate to="/" />}
    </>)
}