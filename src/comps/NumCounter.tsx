import React, {useState} from 'react';

export default function NumCounter(props: any) {

    const [values, setValues] = useState({
        front: 0,
        back: 0
    });

    const setNumsNeeded = props.setNumsNeeded;

    // setNumsNeeded((prev:any) => 
    // prev.map((object:any) => {
    //     if(object.id === props.id) {
    //         return {...object, name: val}
    //     };
        
    //     return object;
    // })

    // const hc = (e:any) => {
    //     setNumsNeeded((prev:any) => 
    //     prev.map((object:any) => {
    //         if(object.id === props.id) {
    //             return {...object, name: val}
    //         };
            
    //         return object;
    //     })
    // }

    return (<>
        <div className='flex gap-3 w-1/3'>
            <input type="text" value={values.front} placeholder="0" className='font-bold self-center w-1/2 bg-blue-100 p-5 rounded-lg' />
            <input type="text" value={values.back} placeholder="0" className='font-bold self-center bg-green-100 p-5 rounded-lg w-1/2' />
        </div>
    </>)
};