import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function TextToInput(props: any) {
    const [showInp, setShowInp] = useState(false);
    const [val, setVal] = useState(props.value);
    const [counted, setCounted] = useState({
        front: 0,
        back: 0,
        counterTally: 0
    });

    const total = (eval(`${counted.front} + ${counted.back} + ${counted.counterTally}`));

    const [showManual, setShowManual] = useState(false);

    const setNumsNeeded = props.setNumsNeeded;
    const numsNeeded = props.numsNeeded;
    const user = props.user;

    const handleClick = () => {
        setShowInp(!showInp)
    };

    const hc = (e:any) => {
        setVal(e.target.value);
    };

    useEffect(() => {
        setNumsNeeded((prev:any) => 
        prev.map((object:any) => {
            if(object.id === props.id) {
                return {...object, name: val }
            };
            
            return object;
        })
    );
    }, [val]);


    useEffect(() => {
        setNumsNeeded((prev:any) => 
            prev.map((object:any) => {
                if(object.id === props.id) {
                    return {...object, currentTotal: total }
                };
                
                return object;
            })
        );
    }, [counted]);



    // { 
    //     name: object.name,
    //     currentTotal: total, 
    //     reportedBy: user.firstName,
    //     dateReported: x,
    //     timeReported: y
    // }

    const tw = {
        styles: `
            bg-blue-200 
            text-center 
            text-2xl 
            p-4 
            rounded-lg 
            font-light  
            tracking-widest
            transition_ease
        `,
        inputStyles: `
            bg-blue-500 
            text-white
            text-center 
            text-2xl 
            p-4 
            rounded-lg 
            font-light  
            tracking-widest
            transition_ease
            w-full
        `,
        voidStyles: `
            text-center 
            text-2xl 
            p-4 
            font-light  
            tracking-widest
            bg-gray-200
            rounded
            hover:cursor-pointer
            transition_ease
            w-full
        `
    }

    const changeNums = (e: any) => {
        const tgt = e.target.value;

        if (tgt.length > 0) {
            setCounted((prev: any) => ({
                ...prev,
                [e.target.id]: tgt,
                counterTally: 0
            }))
        } else {
            setCounted((prev: any) => ({
                ...prev,
                [e.target.id]: 0,
                counterTally: 0
            }))
        };
    };

    const renderOps = () => {
        let ops = [];

        for (let i = 0; i < 99; i++) {
            ops.push(i)
        };

        return (<>
            {ops.map((currentOp) => {
                return <option key={currentOp} value={currentOp}>{currentOp}</option>
            })}
        </>);
    };

    const increment = (e: any) => {
        setCounted((prev: any) => ({
            ...prev,
            counterTally: eval(prev.counterTally + 1)
        }))
    };

    const decrement = (e: any) => {
        if (total > 0) {
            setCounted((prev: any) => ({
                ...prev,
                counterTally: eval(`${prev.counterTally} - 1`)
            }))
        } else {
            setCounted((prev: any) => ({
                ...prev,
                counterTally: 0
            }))
        };
    };

    return (<>
    <div className='flex w-full flex-col p-10 gap-4 shadow-lg bg-opacity-40 rounded-xl border'>

        {props.hiddenTally && <h1 className='text-2xl font-thin'>Currently changing <b>{props.id}</b>:</h1>}

        {showInp ? <>
            <input
                type="text"
                value={val}
                onChange={hc}
                className={tw.inputStyles}
                onBlur={handleClick}
                autoFocus
          />    
        </> : <>
            <span
                onClick={handleClick}
                className={tw.voidStyles}
            >
                {val}
         </span>
        </>}

        {props.hiddenTally ? <></> : <>
            <div className='flex w-full flex-wrap justify-between gap-2 self-center'>
                <div className='flex h-full gap-3'>
                    <p className='self-center text-3xl font-thin'>Front</p>
                    <select id="front" onChange={changeNums} className='self-center h-fit border p-4 rounded-xl'>
                        {renderOps()}
                    </select>
                </div>

                <div className='flex h-full gap-3 self-center '>
                    {/* <p className='self-center text-3xl font-thin'>Total</p> */}
                    <h2 className='text-4xl min-w-sm font-black text-center self-center'>{total}</h2>
                </div>

                <div className='flex h-full gap-3 self-center flex-row-reverse'>
                    <p className='self-center text-3xl font-thin'>Back</p>
                    <select id="back" onChange={changeNums} className='self-center h-fit border p-4 rounded-xl'>
                        {renderOps()}
                    </select>
                </div>

                {showManual && <><div className='flex w-full flex-row-reverse h-16 gap-2'>
                    <button onClick={increment} className='self-center text-center w-4/5 border rounded-lg h-full uppercase font-bold text-3xl bg-green-300 text-white'>
                    +</button>

                    <button onClick={decrement} className='self-center text-center w-1/5 border rounded-lg h-full p-1 uppercase font-bold text-2xl bg-red-300 text-white'>
                    -</button>
                </div>
                
                </> }

                <button onClick={() => {setShowManual(!showManual)}} className='w-full font-thin border rounded-xl p-2'>
                    { showManual ? '^' : 'Click for tap counter' }
                </button>

            </div>
        </>}

    </div>
    </>);
};