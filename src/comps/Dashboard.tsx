import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";
import axios from "axios";
import TextToInput from "./TextToInput";
import LogoutButton from "./LogoutButton";
import logo from '../assets/logo.png';
import Accordion from './Accordion';
import NumCounter from "./NumCounter";
import { render } from "@testing-library/react";
const cookies = new Cookies();

export default function Dashboard(props: any) {

    const token = cookies.get("session-token");

    const [numsNeeded, setNumsNeeded] = useState([]);
    const [repNums, setRepNums] = useState(false);
    const [confirmPost, setConfirmPost] = useState(false);
    const [changeRotating, setChangeRotating] = useState(false);
    const [reports, setReports] = useState([{ _id: '', date: '', time: '', user: '', numsReported: [] }]);
    const [showReports, setShowReports] = useState(false);    
    const [message, setMessage] = useState({
        currentInput: '',
        broadcast: '',
        firstName: '',
        username: ''
    });
    
    const [rotatingNums, setRotatingNums] = useState([]);
    let result: string[] = [];
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        role: "",
        username: "",
        email: "",
        exp: ""
    });

    // const renderSubGroups = (tgt: String) => {
    //    return numsNeeded.filter((item: any) => { return item.positions.subgroup === tgt})
    // };

    // const artisan1 = renderSubGroups('artisan1');
    // const artisan2 = renderSubGroups('artisan2');
    // const misc1 = renderSubGroups('misc1');
    // const misc2 = renderSubGroups('misc2');
    // const squash = renderSubGroups('squash');
    // const quiche = renderSubGroups('quiche');
    // const empanadas = renderSubGroups('empanadas');
    // const glutenFree = renderSubGroups('glutenFree');
    // const crafted = renderSubGroups('crafted');

    // const renderFinal = (array: any, final: any, user: any) => {
    //     array.forEach((item: any) => {
    //         final.push(`${item.name} = ${item.currentTotal || 0}`)
    //     });
    
    //     final.push(`Reported by ${user.firstName}`);
    
    //     console.log('RESULT', final);
    //     console.log('NUMSNEEDED', array);
    // };

    const getFood = async () => {
        const foodConfig = {
            method: 'get',
            url: 'http://localhost:5000/getFood'
        };

        axios(foodConfig)
            .then((res) => {
                setNumsNeeded(res.data.target);

                if (res.data.message === 'food-loaded') {
                    console.log(`Numbers for ${res.data.day} ${res.data.time} have loaded successfully.`)
                };
            })
            .catch((err) => {
                console.log(err)
        })
    };  

    const getRotatingNums = async () => {
        const config = {
            method: 'get',
            url: 'http://localhost:5000/rotating'
        };

        axios(config)
            .then((res) => { setRotatingNums(res.data.target) })
            .catch((err) => { console.log(err) });
    };

    const getReports = async () => {
        const config = {
            method: 'get',
            url: 'http://localhost:5000/getReports'
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
        })

        getRotatingNums().then(() => { 
            console.log('Rotating numbers have been adjusted.') 
        });
        getReports().then(() => { console.log('Reports have been loaded successfuly.') })
        getMsg().then(() => { console.log('Broadcasted message has been updated.') })
    };

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

    const postNums = () => {
        const date = new Date();
        const x = date.toLocaleDateString();
        const y = date.toLocaleTimeString();

        const config = {
            method: 'post',
            url: 'http://localhost:5000/sendNumbers',
            data: {
                numbers: numsNeeded,
                reportedBy: `${user.firstName} / ${user.username}`,
                dateReported: x,
                timeReported: y
            }
        };

        axios(config)
            .then((res) => {
                console.log('Post numbers successfully', res)
                alert('Numbers reported successfully!')
            })
            .catch((err) => {
                console.log('Posting nums went wrong', err)
            });

        setTimeout(() => {
            setRepNums(false);
            setConfirmPost(false);
            getFromServer().then(() => { console.log('Data has been retrieved from server after posting numbers to databse.') });
        }, 300)
    };

    const getMsg = async () => {
        const config = {
            method: 'get',
            url: 'http://localhost:5000/getAdminMsg'
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

    const postMsg = () => {
        const config = {
            method: 'post',
            url: 'http://localhost:5000/sendAdminMsg',
            data: {
                msg: message.currentInput,
                username: user.username,
                firstName: user.firstName 
            }
        };

        axios(config)
        .then((succ) => {
            console.log('SUCCESS', succ)
        })
        .catch((err) => {
            console.log('error', err)
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
                getFromServer();
            })
            .catch((error) => {
                console.log('Something went wrong', error);
            });
    }, []);    
     
    
    // useEffect(() => {
    //     renderFinal(numsNeeded, result, user);
    // }, [numsNeeded]);

return(<>
        <div className="flex gap-4 mt-4 mb-4 flex-col min-h-screen min-w-screen justify-center align-center">

            <div className="flex gap-4 flex-col lg:flex-row max-w-xl self-center justify-between align-center">
                {/* <img src={logo} alt="UCL logo" className="invert self-center text-center w-5/12 lg:w-2/12" />  */}
                <h1 className="text-5xl self-center uppercase text-center font-bold tracking-tight">Welcome {user?.firstName}!</h1>
            </div>
  
            {/* <h2 className="self-center text-center text-4xl tracking-tightest uppercase font-bold">Current Info</h2> */}

            <h2
                className="text-center text-xl italic"
            >Message from {message.firstName}: {message.broadcast}</h2>

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

            {/* <h2 className="self-center text-center text-4xl tracking-tightest uppercase font-bold">Lead Tasks</h2> */}
            
            <button 
                onClick={() => {setRepNums(!repNums); setChangeRotating(false); setShowReports(false)}} 
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
                        setChangeRotating(!changeRotating); setRepNums(false); setShowReports(false);
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

            <button 
                onClick={() => {
                    setShowReports(!showReports); setChangeRotating(false); setRepNums(false);
                }}

                className={`p-4 
                    tracking-widest 
                    uppercase 
                    ${showReports ? 'bg-red-200' : 'bg-blue-100'} 
                    rounded-xl 
                    max-w-lg
                    border w-4/5 
                    self-center`}>
                        {showReports ? 'Hide Food Reports' : 'Show Food Reports'}
            </button>

            {repNums && <>
                <div className="flex flex-col gap-6 max-w-lg w-4/5 self-center">

                    {numsNeeded.length <= 0 ? <>
                        <h1 className="text-center uppercase font-bold text-5xl mt-2">No numbers to report today!</h1>
                    </> : <>
                        {numsNeeded.map((obj: any) => {
                            return <>
                            <div key={`${obj._id}/${obj.id}`} className="flex flex-col gap-">
                                <TextToInput
                                        key={obj._id} 
                                        setNumsNeeded={setNumsNeeded} 
                                        numsNeeded={numsNeeded}
                                        id={obj.id}
                                        value={obj.name} 
                                        user={user}
                                    />
                            </div>
                            </>
                        })}
                    </>}

                    <div className="flex flex-col gap-2 w-full justify-center align-center">
                        <button className="w-full rounded-xl border p-4 bg-slate-300 font-bold uppercase tracking-wider" onClick={() => setConfirmPost(!confirmPost)}>Ready to Report</button>

                        {confirmPost && <>
                            <div className="flex w-full gap-2">
                                <button className="w-1/2 bg-green-100 p-4 rounded-xl border uppercase font-light tracking-wider" onClick={postNums}>Confirm</button>
                                <button className="w-1/2 bg-red-100 p-4 rounded-xl border uppercase font-light tracking-wider" onClick={() => setConfirmPost(false)}>Deny</button>
                            </div>
                        </>}

                    </div>

                </div>
            </>
            }

            { changeRotating && <>

                <h1 className="text-center self-center uppercase text-3xl font-bold tracking-tight">Update Rotating Food</h1>

                <div className="flex flex-col w-4/5 max-w-lg gap-6 justify-center align-center self-center">
                    {rotatingNums.map((obj: any) => {
                            return <>
                            <div key={obj.id}  className="flex flex-col gap-2">
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
            
            </> }

            
            {showReports && <>
                {reports.slice().reverse().map((report: any) => {
                    return <Accordion getFromServer={getFromServer} key={`${report.user}/${report.date}/${report.time}`} user={report.user} date={report.date} time={report.time} numsReported={report.numsReported} _id={report._id} currUser={user} />
                })}
            </>}

            {user.role === 'Admin' && 
            
                <form onSubmit={(e: any) => { e.preventDefault() }} className="flex w-8/12 self-center justify-center align-center">
                    <input 
                    value={message.currentInput} 
                    onChange={(e: any) => {
                        setMessage((prev:any) => ({
                            ...prev,
                            currentInput: e.target.value
                        }))
                    }} 
                    type="text" 
                    placeholder="Enter your message here..."
                    className="border p-4 self-center custom_b1 bg-slate-50 font-light text-xl w-full" />
                    <button onClick={(e:any) => {
                        setMessage((prev:any) => ({
                            ...prev,
                            broadcast: prev.currentInput,
                            currentInput: ''
                        }))

                        postMsg();
                    }} className="border custom_b2 w-1/2 bg-blue-50 uppercase font-light tracking-tight">Broadcast</button>
                </form>

            }

          <LogoutButton 
                styles={'text-white uppercase tracking-widest self-center bg-blue-500 p-4 rounded-xl max-w-lg w-4/5'} 
            />

        </div>
        
        {(!cookies.get('session-token')) && <Navigate to="/" />}
    </>)
}