import React, { useEffect, useState } from 'react';

export default function TextToInput(props: any) {
    const [showInp, setShowInp] = useState(false);
    const [val, setVal] = useState(props.value);
    const setNumsNeeded = props.setNumsNeeded;

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
                return {...object, name: val}
            };
            
            return object;
        })
    );
    }, [val]);

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
        `,
        voidStyles: `
            text-center 
            text-2xl 
            p-4 
            font-light  
            tracking-widest
            bg-gray-200
            rounded
            transition_ease
        `
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
    </>);
};