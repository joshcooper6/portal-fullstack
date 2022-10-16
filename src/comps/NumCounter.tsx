import React, {useContext, useEffect, useState} from 'react';
import NumsContext from '../context/NumsContext';
import axios from 'axios';
import TextToInput from './TextToInput';
import { PATH } from '../confgs';

export default function NumCounter(props: any) {

    const { user, foodDB, getAll } = useContext(NumsContext);
    const [repNums, setRepNums] = useState(false);
    const [numsNeeded, setNumsNeeded] = useState([]);
    const [confirmPost, setConfirmPost] = useState(false);

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
        if (repNums) { setNumsNeeded(filterPM); console.log('food nums loaded') };
    }, [repNums]);

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
                <div className="flex flex-col gap-6 max-w-lg w-4/5 self-center">

                    <div className='w-full gap-2 flex self-center justify-center align-center'>
                        <button className='w-1/2 border rounded-xl p-4 bg-blue-500 font-bold text-white uppercase' onClick={() => { setNumsNeeded(todaysNums.morning) }}>AM Numbers</button>
                        <button className="w-1/2 p-4 border rounded-xl bg-slate-100 text-blue-500 font-bold uppercase" onClick={() => { setNumsNeeded(todaysNums.afternoon) }}>PM Numbers</button>
                    </div>

                    {numsNeeded.length <= 0 ? <>

                        <h1 className="text-center uppercase font-bold text-5xl mt-2">No numbers to report right now!</h1>
                   
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
    </>)
};