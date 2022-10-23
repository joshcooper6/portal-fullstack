import React, {useContext, useEffect, useState} from 'react';
import NumsContext from '../context/NumsContext';
import axios from 'axios';
import TextToInput from './TextToInput';
import { PATH } from '../confgs';
import upperFirstChar from '../funcs/upperFirstChar';
import dayString from '../funcs/dayString';
import { weekdays, timeOfDay } from '../funcs/vars';
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function NumCounter(props: any) {

    const { user, foodDB, getAll, setUser } = useContext(NumsContext);
    const [repNums, setRepNums] = useState(false);
    const [numsNeeded, setNumsNeeded] = useState([]);

    const filterDB = (string: any, timeOfDay: any) => {
        return foodDB.filter((num: any) => {
            return num?.[`${string}`]?.[`${timeOfDay}`] === true
        });
    };

    const [currentDay, setCurrentDay] = useState(dayString());
    const [currentTime, setCurrentTime] = useState('afternoon');

    const postNums = () => {
        const date = new Date();

        const config = {
            method: 'post',
            url: `${PATH}/sendNumbers`,
            data: {
                numbers: numsNeeded,
                reportedBy: `${user.firstName} / ${user.username}`,
                dateReported: date.toLocaleDateString(),
                timeReported: date.toLocaleTimeString()
            }
        };

        axios(config)
            .then((res) => {
                console.log('Post numbers successfully', res)
                alert('Numbers reported successfully!')
                getAll().then(() => { 'With new numbers, app has been updated.' })
            })
            .catch((err) => {
                console.log('Posting nums went wrong', err)
            });

        setTimeout(() => {
            setRepNums(false);
        }, 300)
    };

    useEffect(() => {
        if (repNums) { setNumsNeeded( filterDB(currentDay, currentTime) ); console.log(`food nums loaded for ${currentDay} ${currentTime}`) };
    }, [repNums, currentTime, currentDay]);

    const confirm = (e: any) => {
        if (window.confirm('Have you double checked all of the numbers?')) {
            postNums();
        };
    };

    return (<>
            <button 
                onClick={() => {setRepNums(!repNums) }} 
                className={`p-4 
                    tracking-widest 
                    uppercase 
                    bg-gray-900
                    text-teal
                    font-black
                    rounded-xl 
                    border w-4/5
                    max-w-lg
                    self-center`}>
                        {repNums ? 'Hide Food Numbers' : 'Report Food Numbers'}
            </button>


            { repNums && <>

                <h1 className='text-3xl uppercase font-light text-center p-5'>Numbers for <span className='font-black text-gray-900'>{currentDay} {currentTime}</span>:</h1>


               <div id="SELECT_CONTAINER" className='flex w-11/12 max-w-xl gap-4 pb-5 self-center items-center justify-center'> 
                    <div className='border bg-gray-900 text-teal p-6 w-1/2 rounded-xl flex flex-col text-center self-center items-center justify-center gap-2'>
                        <h2 className='uppercase text-lg lg:text-2xl w-full text-teal font-light'>Day of Week:</h2>
                        <select defaultValue={dayString()} onChange={(e) => setCurrentDay(e.target.value)} className='border-0 rounded-full p-4 font-black bg-gray-700'>
                            {weekdays.map((day) => {
                                return <option key={day} value={day}>{upperFirstChar(day)}</option>
                            })}
                        </select>
                    </div>

                    <div className='flex bg-gray-900 rounded-xl text-teal flex-col border p-6 w-1/2 text-center self-center items-center justify-center gap-2'>
                        <h2 className='uppercase text-lg lg:text-2xl font-light'>Time Of Day:</h2>
                        <select defaultValue={currentTime} onChange={(e) => { setCurrentTime(e.target.value) }} className='border-0 rounded-full p-4 bg-gray-700 font-black'>
                            {timeOfDay.map((day) => {
                                return <option key={day} value={day}>{upperFirstChar(day)}</option>
                            })}
                        </select>
                    </div>
                </div>

                <div id="RENDERED_NUMS" className="grid_custom self-center w-11/12">

                    {numsNeeded.length <= 0 ? <>

                        <h1 className="text-center self-center uppercase font-bold text-5xl mt-2">No numbers to report for {currentDay} {currentTime}!</h1>
                   
                    </> : <>

                        {numsNeeded.map((obj: any) => {
                            return (<TextToInput
                                        key={obj._id} 
                                        setNumsNeeded={setNumsNeeded} 
                                        numsNeeded={numsNeeded}
                                        id={obj.id}
                                        value={obj.name} 
                                        user={user}
                                    />)
                        })}

                    </>}

                </div>

                <div className="flex flex-col gap-2 w-10/12 max-w-2xl self-center justify-center align-center">
                    <button className="w-full rounded-xl border p-4 bg-slate-300 font-bold uppercase tracking-wider mt-10" onClick={confirm}>Ready to Report</button>
                </div>
            </>
            }
    </>)
};