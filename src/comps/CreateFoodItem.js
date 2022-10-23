import { useContext, useEffect, useState } from "react";
import upperFirstChar from "../funcs/upperFirstChar";
import { weekdays } from "../funcs/vars";
import { PATH } from "../confgs";
import axios from "axios";
import NumsContext from "../context/NumsContext";

export default function CreateFoodItem() {

    const {getAll} = useContext(NumsContext);
    const [showForm, setShowForm] = useState(false);
    const [confirmDays, setConfirmDays] = useState(false);

    const opts = ['artisan', 'misc', 'squash', 'glutenFree', 'quiche', 'empanadas'];
    const vendors = ['macrina', 'crafted', 'catapult', 'marialuisa', 'rila', 'finales'];


    const [values, setValues] = useState({
        id: "",
        name: "",
        vendor: vendors[0],
        positions: {
            group: opts[0],
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
            alert(`${values.name} has been created successfully!`);
            setShowForm(false);
            getAll();
        })
        .catch((err) => {
            console.log('error', err)
        })
    }
 
    const hs = (e) => {
        e.preventDefault();
        postToDB();
    };

    useEffect(() => {
        console.log(values)
    }, [values]);

    const renderOpts = opts.map((opt) => {
        return <option key={opt} id={opt} value={opt} children={upperFirstChar(opt)}/>
    });

    const rendorVendors = vendors.map((opt) => {
        return <option key={opt} id={opt} value={opt} children={upperFirstChar(opt)}/>
    });
 
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
                <div className="flex gap-2 self-center">
                    <span className="text-xl uppercase font-light self-center">Name:</span>
                    <input 
                        className="rounded-full p-2"
                        type={'text'}
                        onChange={hc}
                        name={'name'}
                        required
                    />
                </div>

                <div className="flex gap-2 self-center">

                    <span className="text-xl uppercase font-light self-center">ID:</span>
                    <input 
                        className="rounded-full p-2"
                        type={'text'}
                        onChange={hc}
                        name={'id'}
                        required
                    />

                </div>

                {/* <div className="flex gap-2">
                    <span className="text-xl uppercase font-light self-center">Vendor:</span>
                    <input 
                        className="rounded-full p-2"
                        type={'text'}
                        onChange={hc}
                        name={'vendor'}
                        required
                    />
                </div> */}

                <div className="flex gap-2">
                    <span className="text-xl w-1/2 uppercase font-light self-center">Vendor</span>
                    <select className="p-2 w-3/4 rounded-full font-black" name={'vendor'} onChange={hc}>
                        {rendorVendors}
                    </select>
                </div>
                <div className="flex gap-2">
                    <span className="text-xl w-1/2 uppercase font-light self-center">Group Position:</span>
                    <select className="p-2 w-3/4 rounded-full font-black" name={'positions'} onChange={(e) => {
                                setValues((prev) => ({
                                    ...prev,
                                    [e.target.name]: {
                                        ...prev?.[e.target.name],
                                        group: e.target.value
                                    }
                                }))
                            }}>
                        {renderOpts}
                    </select>
                    {/* <input 
                            className="rounded-full p-2"
                            type={'text'}
                            onChange={(e) => {
                                setValues((prev) => ({
                                    ...prev,
                                    [e.target.name]: {
                                        ...prev?.[e.target.name],
                                        group: e.target.value
                                    }
                                }))
                            }}
                            name={'positions'}
                            required
                    /> */}
                </div>

                <button
                    onClick={(e) => { e.preventDefault(); setConfirmDays(!confirmDays) }}
                    children={confirmDays ? 'Hide Days Needed' : 'Want to set the days needed now?'}
                    className={`border rounded-full p-2 font-black bg-slate-900 text-white`}
                />

                {confirmDays && <>
                        {weekdays.map((day) => {
                            return <div key={`createFood_${day}`}>
                            <span className="m-4 font-black text-xl">{upperFirstChar(day)}</span>
                            <div className="flex gap-4 justify-center">
                                <span className="uppercase text-xl font-light">Morning:</span>
                                <input
                                    type="checkbox"
                                    name={'morning'}
                                    onChange={(e) => {
                                        setValues((prev) => ({
                                            ...prev,
                                            [day]: { 
                                                ...prev?.[day],
                                                [e.target.name]: e.target.checked 
                                            }
                                        }))
                                    }}
                                />

                                <span className="uppercase text-xl font-light">Afternoon:</span>
                                <input 
                                    type="checkbox"
                                    name="afternoon"
                                    onChange={(e) => {
                                        setValues((prev) => ({
                                            ...prev,
                                            [day]: { 
                                                ...prev?.[day],
                                                [e.target.name]: e.target.checked 
                                            }
                                        }))
                                    }}
                                />
                            </div>
                        </div>
                    })}
                </>}

            
                <button
                    onClick={hs}
                    className="w-full border-0 rounded-full p-2 bg-white text-slate-900 font-black"
                    children={'Submit'}
                />
            </form>
        </div>
    </>)
}