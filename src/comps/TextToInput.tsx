import React, { useEffect, useState } from 'react';

export default function TextToInput(props: any) {
    const [showInp, setShowInp] = useState(false);
    const [val, setVal] = useState(props.value);
    const [counted, setCounted] = useState({
        front: '0',
        back: '0',
    });

    const total = (eval(`${counted.front} + ${counted.back}`));

    const setNumsNeeded = props.setNumsNeeded;
    const numsNeeded = props.numsNeeded;

    const handleClick = () => {
        setShowInp(!showInp)
    };

    const hc = (e:any) => {
        setVal(e.target.value);
    };

    console.log(numsNeeded)

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
            scale-110
            w-3/5
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
            w-3/5
            hover:scale-110
        `
    }

    const changeNums = (e: any) => {
        const tgt = e.target.value;

        if (tgt.length > 0) {
            setCounted((prev: any) => ({
                ...prev,
                [e.target.id]: tgt
            }))
        } else {
            setCounted((prev: any) => ({
                ...prev,
                [e.target.id]: 0
            }))
        };
    }

    return (<>
    
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

        <div className='flex w-1/3 gap-2 text-xl' id={props.id} key={props.id}>
            <input onChange={changeNums} placeholder="Front" id="front" className='w-1/3 border h-full rounded-lg text-black self-center text-center' type="number"></input>
            <input onChange={changeNums} placeholder="Back" className='w-1/3 border rounded-xl h-full text-black self-center text-center' id="back" type="number"></input>
            <p className='w-1/5 h-fit text-5xl font-thin text-center self-center'>{total}</p>
        </div>
    </>);
};