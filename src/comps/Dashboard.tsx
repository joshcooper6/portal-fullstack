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
    // const [reports, setReports] = useState([{ _id: '', date: '', time: '', user: '', numsReported: [] }]);
    const [rotatingNums, setRotatingNums] = useState([]);

    const dayString = () => {
        const DATE = new Date();
        const TODAY = DATE.getDay();
      
        switch(TODAY) {
          case 0: return 'sunday'; break;
          case 1: return 'monday'; break;
          case 2: return 'tuesday'; break;
          case 3: return 'wednesday'; break;
          case 4: return 'thursday'; break;
          case 5: return 'friday'; break;
          case 6: return 'saturday'; break;
        };
      };

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

    // const [tea, setTea] = useState([]);

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

    let filterAM = foodDB.filter((num: any) => {
        return num?.[`${dayString()}`].morning === true
    });

    let filterPM = foodDB.filter((num: any) => {
        return num?.[`${dayString()}`].afternoon === true
    });

    const todaysNums = {
        morning: filterAM,
        afternoon: filterPM
    };

    const getFromServer = async () => {
        getAll();
        setNumsNeeded(filterPM);
        setRotatingNums(foodDB.filter((num: any) => {
            return num.rotating === true
         }));
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
    }, []);    

    const provVals = {
        getFromServer,
        numsNeeded,
        setNumsNeeded,
        rotatingNums,
        setRotatingNums,
        user,
        setUser,
        message,
        setMessage,
        todaysNums, 
        // setTodaysNums,
    };
     
return(<>
        <div className="flex gap-2 flex-col min-h-screen min-w-screen justify-center align-center">
            <NumsContext.Provider value={provVals}>
                <Header />
                <LogoutButton />
                <NumCounter />
                <UpdRotating />
                <Reports />
                {/* <Broadcast /> */}
                <TeaInventory />
            </NumsContext.Provider>
        </div>
        
        {(!cookies.get('session-token')) && <Navigate to="/" />}
    </>)
}