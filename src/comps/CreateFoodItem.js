import { useContext, useEffect, useState } from "react";
import upperFirstChar from "../funcs/upperFirstChar";
import { weekdays } from "../funcs/vars";
import { PATH } from "../confgs";
import axios from "axios";
import NumsContext from "../context/NumsContext";

export default function CreateFoodItem() {

    const {getAll} = useContext(NumsContext);
    const [showForm, setShowForm] = useState(false);

    const [values, setValues] = useState({
        id: "",
        name: "",
        vendor: "",
        positions: {
            group: "",
            subgroup: "",
            listPosition: ""
        },
        rotating: false,
        sunday: {
            morning: false,
            afternoon: false,
        },
        monday: {
            morning: false,
            afternoon: false,
        },
        tuesday: {
            morning: false,
            afternoon: false,
        },
        wednesday: {
            morning: false,
            afternoon: false,
        },
        thursday: {
            morning: false,
            afternoon: false,
        },
        friday: {
            morning: false,
            afternoon: false,
        },
        saturday: {
            morning: false,
            afternoon: false,
        },
    });

    const hc = (e) => {
        setValues((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    };

    const postToDB = () => {
        const config = {
            method: 'post',
            url: `${PATH}/createFood`,
            data: values
        };

        axios(config)
        .then((succ) => {
            alert(`${values.name} has been created successfully!`)
            setShowForm(false)
            getAll()
        })
        .catch((err) => {
            console.log('error', err)
        })
    }
 
    const hs = (e) => {
        e.preventDefault();
        postToDB();
        console.log(values)
    };

    useEffect(() => {
        console.log(values)
    }, [values]);

 
    return(<>

            <button 
                onClick={() => { setShowForm(!showForm) }} 
                className={`p-4 
                    tracking-widest 
                    uppercase 
                    bg-gray-900
                    text-teal
                    font-black
                    rounded-xl 
                    border w-4/5
                    max-w-lg
                    self-center`}
                children={showForm ? 'Hide Create Food Form' : 'Create New Food Item'}
               />

        <div className={`${!showForm && 'hidden'} flex flex-col justify-center items-center text-center m-4`}>
            <h1 className="text-slate-900 font-black text-3xl mb-4">Create New Food</h1>
            <form className="flex-col flex gap-2 justify-center">
                <div className="flex gap-2">
                    <span className="text-xl uppercase font-light self-center">Name:</span>
                    <input 
                        className="rounded-full p-2"
                        type={'text'}
                        onChange={hc}
                        name={'name'}
                        required
                    />
                </div>

                <div className="flex gap-2">

                    <span className="text-xl uppercase font-light self-center">ID:</span>
                    <input 
                        className="rounded-full p-2"
                        type={'text'}
                        onChange={hc}
                        name={'id'}
                        required
                    />

                </div>

                <div className="flex gap-2">
                <span className="text-xl uppercase font-light self-center">Vendor:</span>
                <input 
                    className="rounded-full p-2"
                    type={'text'}
                    onChange={hc}
                    name={'vendor'}
                    required
                />
                </div>
                <div className="flex gap-2">
                <span className="text-xl uppercase font-light self-center">Group Position:</span>
                    <input 
                        className="rounded-full p-2"
                        type={'text'}
                        onChange={(e) => {
                            setValues((prev) => ({
                                ...prev,
                                [e.target.name]: {
                                    group: e.target.value
                                }
                            }))
                        }}
                        name={'positions'}
                        required
                    />
                </div>
                {/* {weekdays.map((day) => {
                   return <>
                        <span>{upperFirstChar(day)}</span>
                        <div className="flex gap-4 ">
                        <span>Morning:</span>
                        <input
                            type="checkbox"
                            name={'morning'}
                            onChange={(e) => {
                                setValues((prev) => {
                                   
                                    prev.map((item) => {
                                        if (item === [day]) {
                                            return ''
                                        }
                                    })
                                })
                            }}
                        />
                        <span>Afternoon:</span>
                        <input 
                            type="checkbox"
                            name="afternoon"
                            onChange={(e) => {
                                setValues((prev) => ({
                                    ...prev,
                                    [day]: { [e.target.name]: e.target.checked }
                                }))
                            }}
                        />
                        </div>
                    </>
                })} */}

                <button
                    onClick={hs}
                    className="w-full border-0 rounded-full p-2 bg-white text-slate-900 font-black"
                    children={'Submit'}
                />
            </form>
        </div>
    </>)
}