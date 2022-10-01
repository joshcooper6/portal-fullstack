import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";
import axios from "axios";
import TextToInput from "./TextToInput";
import LogoutButton from "./LogoutButton";
import logo from '../assets/logo.png';

import NumCounter from "./NumCounter";
const cookies = new Cookies();

export default function Dashboard(props: any) {

    const token = cookies.get("session-token");
    const [numsNeeded, setNumsNeeded] = useState([]);
    const [repNums, setRepNums] = useState(false);
    const [changeRotating, setChangeRotating] = useState(false);

    let result: string[] = [];
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        role: "",
        username: "",
        email: "",
        exp: ""
    });

    const [rotatingNums, setRotatingNums] = useState([]);

    const renderFinal = (array: any, final: any, user: any) => {
        array.forEach((item: any) => {
            final.push(`${item.name} = ${item.currentTotal || 0}`)
        });
    
        final.push(`Reported by ${user.firstName}`);
    
        console.log('RESULT', final);
        console.log('NUMSNEEDED', array);
    };
    
    useEffect(() => {
        renderFinal(numsNeeded, result, user);
    }, [numsNeeded]);
     
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

    const getRotatingNums = () => {
        const config = {
            method: 'get',
            url: 'http://localhost:5000/rotating'
        };

        axios(config)
            .then((res) => {
                setRotatingNums(res.data.response)
            })
            .catch((err) => {
                console.log(err)
        });
    };

    const getFromServer = () => {
        getFood();
        getRotatingNums();
    };

    console.log('ROTATING', rotatingNums);

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

        getFromServer();
    }, []);

    const handlePost = (e: any) => {
        rotatingNums.forEach((number: any) => {
            const config = {
                method: 'post',
                url: 'http://localhost:5000/updateFood',
                data: {
                    query: { id: number.id },
                    changeThis: { name: number.name }
                }
            };
    
            axios(config)
                .then((res) => {
                    console.log('UPDATING ROTATING NUMS', res);
                    getFromServer();
                })
                .catch((err) => {
                    console.log('something went wrong updating', err)
            })
        });

        alert('Database updated!');

        setTimeout(() => {
            setChangeRotating(false)
        }, 300);
    };




return(<>
        <div className="flex gap-4 mt-4 mb-4 flex-col min-h-screen min-w-screen justify-center align-center">

            <div className="flex gap-4 flex-col lg:flex-row max-w-xl self-center justify-between align-center">
                {/* <img src={logo} alt="UCL logo" className="invert self-center text-center w-5/12 lg:w-2/12" />  */}
                <h1 className="text-5xl self-center uppercase text-center font-bold tracking-tight">Welcome {user?.firstName}!</h1>
            </div>
  
            {/* <h2 className="self-center text-center text-4xl tracking-tightest uppercase font-bold">Current Info</h2> */}


            <h2 className="text-lg text-center self-center pl-4 pr-4">
                You are known to the world as <b>{user.username}</b>.
                <br />
                {user.email.length > 0 ? <>
                    The email you have on file is <b>{user.email}</b>.
                </> : <>
                    You have not added an email on file yet.
                </>}
                <br />
                Your current account role is <b>{user.role}</b>.
            </h2>

            <h2 className="self-center text-center text-4xl tracking-tightest uppercase font-bold">Lead Tasks</h2>
            
            <button 
                onClick={() => {setRepNums(!repNums); setChangeRotating(false)}} 
                className={`p-4 
                    tracking-widest 
                    uppercase 
                    ${repNums ? 'bg-red-200' : 'bg-blue-100'} 
                    rounded-xl 
                    border w-4/5
                    max-w-lg
                    self-center`}>
                        {repNums ? 'Hide Food Numbers' : 'Report Food Numbers'}
            </button>

            <button 
                onClick={() => {
                    if (user.role === 'Admin') {
                        setChangeRotating(!changeRotating); setRepNums(false)
                    } else {
                        alert('This action is only availble to management.')
                    }
                }}

                className={`p-4 
                    tracking-widest 
                    uppercase 
                    ${changeRotating ? 'bg-red-200' : 'bg-blue-100'} 
                    rounded-xl 
                    max-w-lg
                    border w-4/5 
                    self-center`}>
                        {changeRotating ? 'Hide Rotating Items' : 'Update Rotating Items'}
            </button>

            {repNums && <>
                <div className="flex flex-col gap-6 max-w-lg w-4/5 self-center">

                    {numsNeeded.length <= 0 ? <>
                        <h1 className="text-center uppercase font-bold">There are no numbers to report today!</h1>
                    </> : <>
                        {numsNeeded.map((obj: any) => {
                            return <>
                            <div className="flex flex-col gap-">
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
                    </>}
                    

                </div>
            </>
            }

            {changeRotating && <>

                <h1 className="text-center self-center uppercase text-3xl font-bold tracking-tight">Update Rotating Food</h1>

                <div className="flex flex-col w-4/5 max-w-lg gap-6 justify-center align-center self-center">
                    {rotatingNums.map((obj: any) => {
                            return <>
                            <div className="flex flex-col gap-2">
                                <TextToInput 
                                        key={obj._id} 
                                        setNumsNeeded={setRotatingNums} 
                                        numsNeeded={rotatingNums}
                                        id={obj.id}
                                        value={obj.name} 
                                        hiddenTally
                                    />
                            </div>
                            </>
                    })}

                    <button onClick={handlePost} className="p-3 bg-green-100 font-light uppercase tracking-widest text-xl border rounded-xl">Update</button>
            </div>
            
            </>}


          <LogoutButton 
                styles={'text-white uppercase tracking-widest self-center bg-blue-500 p-4 rounded-xl max-w-lg w-4/5'} 
            />

        </div>
        
        {(!cookies.get('session-token')) && <Navigate to="/" />}
    </>)
}