import React, {useContext, useEffect, useState} from 'react';
import NumsContext from '../context/NumsContext';
import axios from 'axios';
import TextToInput from './TextToInput';

export default function NumCounter(props: any) {

    const { setNumsNeeded, numsNeeded, user, setChangeRotating, setShowReports } = useContext(NumsContext);
    const [repNums, setRepNums] = useState(false);
    const [confirmPost, setConfirmPost] = useState(false);

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
        }, 300)
    };

    useEffect(() => {
        getFood().then(() => { console.log('Food has been recieved in component') })
    }, []);

    return (<>
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
        

            { repNums && <>
                <div className="flex flex-col gap-6 max-w-lg w-4/5 self-center">

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