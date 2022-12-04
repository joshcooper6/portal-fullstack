import { useContext, useEffect, useState } from "react";
import upperFirstChar from "../funcs/upperFirstChar";
import { weekdays } from "../funcs/vars";
import { PATH } from "../confgs";
import Button from "./Button";
import axios from "axios";
import NumsContext from "../context/NumsContext";

export default function CreateFoodItem() {

    const {getAll, foodDB} = useContext(NumsContext);
    const [showForm, setShowForm] = useState(false);
    const [confirmDays, setConfirmDays] = useState(false);

    const opts = ['artisan', 'misc', 'crafted', 'squash', 'glutenFree', 'quiche', 'empanadas'];
    const vendors = ['macrina', 'crafted', 'catapult', 'marialuisa', 'rila', 'finales'];

    const foodForm = {
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
    };

    const [values, setValues] = useState(foodForm);

    const hc = (e) => {
        setValues((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const postToDB = async () => {
        const config = {
            method: 'post',
            url: `${PATH}/createFood`,
            data: values
        };

        axios(config)
        .then((succ) => {
            alert(`${values.name} has been created successfully!`);
            setShowForm(false);
            setValues(foodForm);
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

    const renderOptions = (array) => {
        return array.map((opt) => {
            return <option key={opt} id={opt} value={opt} children={upperFirstChar(opt)}/>
        });
    };
 
    return(<>

        <Button 
            state={showForm}
            setState={setShowForm}
            labels={{show: 'Create New Food Item', hide: 'Hide Create Food Item'}}
        />

        <div className={`${!showForm && 'hidden'} flex flex-col max-w-lg self-center m-4 w-10/12`}>
            <h1 className="text-slate-900 uppercase font-black text-4xl mb-4">Create New Food</h1>
            <form className="flex flex-col gap-4">
                    <div className="flex gap-2">
                        <span className="text-xl uppercase font-light self-center w-1/3">Name:</span>
                        <input 
                            className="rounded-full p-2 w-2/3"
                            type={'text'}
                            value={values.name}
                            onChange={hc}
                            name={'name'}
                            required
                        />
                    </div>



                    <div className="flex gap-2">
                        <span className="text-xl uppercase font-light self-center w-1/3">ID:</span>
                        <input 
                            className="rounded-full p-2 w-2/3"
                            type={'text'}
                            onChange={hc}
                            value={values.id}
                            name={'id'}
                            required
                        />
                    </div>



                    <div className="flex gap-2">
                        <span className="text-xl uppercase font-light self-center w-1/3">Vendor:</span>
                        <select 
                            className="p-2 rounded-full font-black w-2/3" 
                            name={'vendor'}
                            onChange={hc}
                            value={values.vendor}
                            children={renderOptions(vendors)}
                        />
                    </div>


                    <div className="flex gap-2">
                        <span className="text-xl uppercase font-light self-center w-1/3">Group:</span>
                        <select 
                            className="p-2 rounded-full font-black w-2/3" 
                            name={'positions'} 
                            value={values.positions.group}
                            onChange={(e) => {
                                setValues((prev) => ({
                                    ...prev,
                                    [e.target.name]: {
                                        ...prev?.[e.target.name],
                                        group: e.target.value
                                    }
                                }))
                            }}
                            children={renderOptions(opts)}
                        />
                    </div>
            </form>
            
            <button
                    onClick={(e) => { e.preventDefault(); setConfirmDays(!confirmDays) }}
                    children={confirmDays ? 'Hide Schedule' : 'Set Schedule'}
                    className={`hidden border w-full rounded-full p-2 font-black bg-slate-900 text-white`}
                />

                {confirmDays && <>
                        {weekdays.map((day) => {
                            return <div key={`createFood_${day}`}>
                            <span className="m-4 font-black text-2xl">{upperFirstChar(day)}</span>
                            <div className="flex gap-4 justify-center">
                                <span className="uppercase text-xl font-light">Morning:</span>
                                <input
                                    type="checkbox"
                                    name={'morning'}
                                    value={`${[day]}.morning`}
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
                                    value={`${[day]}.afternoon`}
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
                    className="w-full mt-6 border-0 rounded-full p-2 bg-slate-900 text-white font-black uppercase"
                    children={'Submit'}
                />

        </div>
    </>)
}