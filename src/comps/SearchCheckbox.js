import thumb from '../assets/thumb.svg';
import negative from '../assets/negative.svg';
import { useContext, useEffect, useState } from 'react';
import NumsContext from '../context/NumsContext';
import axios from 'axios';
import { PATH } from '../confgs';
import upperFirstChar from '../funcs/upperFirstChar';

export default function SearchCheckbox(props) {

    const { setNumsNeeded, foodDB, setFoodDB, getAll, user } = useContext(NumsContext);
    const { item, dayOfWeek, thingsToChange, setThingsToChange } = props;
    const [dayVis, setDayVis] = useState(false);

    const [formVals, setFormVals] = useState({
        morning: item?.[`${dayOfWeek}`]?.morning,
        afternoon: item?.[`${dayOfWeek}`]?.afternoon
    });

    const query = { id: item.id, [`${dayOfWeek}`]: formVals };

    const condition = (item?.[`${dayOfWeek}`].morning || item?.[`${dayOfWeek}`].afternoon);

    const hc = (e) => {
        setFormVals((prev) => ({
            ...prev,
            [e.target.name]: e.target.checked
        }))
    };

    const updateDB = async () => {
        const cfg = {
            method: 'post',
            url: `${PATH}/updateFood`,
            data: {
                query: { id: item.id },
                changeThis: { [`${dayOfWeek}`]: formVals }
            }
        };

        axios(cfg)
        .then((res) => {
            console.log('posted', res)
            alert(`updated for ${dayOfWeek}`)
            setDayVis(false);
            getAll();
        })
        .catch((err) => {
            console.log('err', err)
        })
    };

    useEffect(() => {

    }, [formVals]);

    const checkboxes = [
        {time: 'morning', values: formVals.morning},
        {time: 'afternoon', values: formVals.afternoon}
    ];

    return(<>

        <div id="DAY_CHECKBOX_CONTAINER" className='w-full flex gap-4'>
            <div onClick={(e) => { setDayVis(!dayVis)}} className="flex cursor-pointer p-4 w-52 rounded-2xl bg-gray-700 gap-2 text-teal border-0">
                <h2 className="font-black text-2xl self-center">{upperFirstChar(dayOfWeek)}</h2>
            </div>
            
            <img src={condition ? thumb : negative} alt={'thumb icon'} className={'invert w-10 self-center'} />
        </div>

        <div id="CHECKBOX_WRAPPER" className={`m-4 p-2 bg-gray-800 flex flex-col ${!dayVis && 'hidden'} justify-center items-center rounded-xl text-center w-full`}>

            {checkboxes.map((type) => {
                return (<>
                        <div className='flex gap-2 m-2'>
                           <p className='font-light tracking-widest text-xl uppercase'>{upperFirstChar(type.time)}:</p>
                           <input 
                           onChange={hc} 
                           name={type.time}
                           type="checkbox" 
                           defaultChecked={type.values} />
                    </div>
                </>)
             })}

            {user?.role === 'Admin' && <>
                <button 
                onClick={() => {
                    if (window.confirm(`Are you sure you want to update ${upperFirstChar(dayOfWeek)} for ${upperFirstChar(item.name)}?`)) {
                        updateDB()
                    };
                }} 
                className="text-teal hover:scale-110 m-4 font-black border-0 rounded-2xl bg-gray-700 p-4" 
                children={`Update ${upperFirstChar(dayOfWeek)}`} />
            </>}

        </div>

    </>)
};