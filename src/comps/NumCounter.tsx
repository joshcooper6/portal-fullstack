import React, {useContext, useEffect, useState} from 'react';
import NumsContext from '../context/NumsContext';
import axios from 'axios';
import TextToInput from './TextToInput';
import { PATH } from '../confgs';
import Fuse from 'fuse.js';

export default function NumCounter(props: any) {

    const { user, foodDB, getAll, token, setUser } = useContext(NumsContext);
    const [repNums, setRepNums] = useState(false);
    const [numsNeeded, setNumsNeeded] = useState([]);
    const [confirmPost, setConfirmPost] = useState(false);
    const [searchQuery, setSearchQuery] = useState();;

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

    const filterDB = (string: any, timeOfDay: any) => {
        return foodDB.filter((num: any) => {
            return num?.[`${string}`]?.[`${timeOfDay}`] === true
        });
    };

    const [currentDay, setCurrentDay] = useState(dayString());
    const [currentTime, setCurrentTime] = useState('afternoon');

    const todaysNums = {
        morning: filterDB(currentDay, 'morning'),
        afternoon: filterDB(currentDay, 'afternoon')
    };


    const postNums = () => {
        const date = new Date();
        const x = date.toLocaleDateString();
        const y = date.toLocaleTimeString();

        const config = {
            method: 'post',
            url: `${PATH}/sendNumbers`,
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
                getAll().then(() => { 'With new numbers, app has been updated.' })
            })
            .catch((err) => {
                console.log('Posting nums went wrong', err)
            });

        setTimeout(() => {
            setRepNums(false);
            setConfirmPost(false);
        }, 300)
    };

    useEffect(() => {
        if (repNums) { setNumsNeeded( filterDB(currentDay, currentTime) ); console.log(`food nums loaded for ${currentDay} ${currentTime}`) };
    }, [repNums, currentTime, currentDay]);

    // useEffect(() => {
    //     setNumsNeeded(filterDB(currentDay, currentTime))
    // }, [currentTime]);

    const fuse = new Fuse(foodDB, {keys: ["name", "id", "vendor", "positions.subgroup"]});

    const searchThis = (value: any) => {
        if (!value) {
            return []
        }

        return fuse.search(value).map((result) => result.item);
    };

    const resultsArray = searchThis(searchQuery);
    const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    const timeOfDay = ['morning', 'afternoon'];

    return (<>
            <button 
                onClick={() => {setRepNums(!repNums) }} 
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


            { repNums && <>

                <div className='flex flex-col justify-center items-center min-w-screen w-full '>
                    <input type="text" 
                    placeholder='Search food database...'
                    onChange={(e: any) => { setSearchQuery(e.target.value) }}
                    className='border p-4 rounded-full w-1/2 min-w-md max-w-lg' />
                    {resultsArray.map((item: any) => {
                        return <p key={item.name}>{item.name}</p>
                    })}
                </div>

               <div id="SELECT_CONTAINER" className='flex w-11/12 max-w-xl gap-4 self-center items-center justify-center'> 
                    <div className='border p-6 w-1/2 rounded-xl flex flex-col text-center self-center items-center justify-center gap-2'>
                        <h2 className='uppercase text-lg lg:text-2xl w-full text-blue-500 font-light'>Day of Week:</h2>
                        <select defaultValue={dayString()} onChange={(e) => setCurrentDay(e.target.value)} className='border rounded-full p-4'>
                            {weekdays.map((day) => {
                                return <option key={day} value={day}>{day}</option>
                            })}
                        </select>
                    </div>

                    <div className='flex flex-col border p-6 w-1/2 text-center self-center items-center justify-center gap-2'>
                        <h2 className='uppercase text-lg lg:text-2xl text-blue-500 font-light'>Time Of Day:</h2>
                        <select defaultValue={currentTime} onChange={(e) => { setCurrentTime(e.target.value) }} className='border rounded-full p-4'>
                            {timeOfDay.map((day) => {
                                return <option key={day} value={day}>{day}</option>
                            })}
                        </select>
                    </div>
                </div>

                {/* <div className='w-10/12 max-w-2xl grid_buttons gap-2 flex self-center justify-center align-center'>
                        <button className='w-1/2 border rounded-xl p-4 bg-blue-500 font-bold text-white uppercase' onClick={() => { setNumsNeeded(todaysNums.morning) }}>AM Numbers</button>
                        <button className="w-1/2 p-4 border rounded-xl bg-slate-100 text-blue-500 font-bold uppercase" onClick={() => { setNumsNeeded(todaysNums.afternoon) }}>PM Numbers</button>
                </div> */}

            <h1 className='text-3xl uppercase font-light text-center pt-10'>Numbers for <span className='font-black text-blue-400'>{currentDay} {currentTime}</span>:</h1>


                <div className="grid_custom self-center">

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
                        <button className="w-full rounded-xl border p-4 bg-slate-300 font-bold uppercase tracking-wider mt-10" onClick={() => setConfirmPost(!confirmPost)}>Ready to Report</button>

                        {confirmPost && <>
                            <div className="flex w-full gap-2">
                                <button className="w-1/2 bg-green-100 p-4 rounded-xl border uppercase font-light tracking-wider" onClick={postNums}>Confirm</button>
                                <button className="w-1/2 bg-red-100 p-4 rounded-xl border uppercase font-light tracking-wider" onClick={() => setConfirmPost(false)}>Deny</button>
                            </div>
                        </>}

                    </div>
            </>
            }
    </>)
};