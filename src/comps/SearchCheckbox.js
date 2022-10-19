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

    return(<>
        <div onClick={(e) => {setDayVis(!dayVis)}} className="flex cursor-pointer p-4 w-full rounded-2xl bg-gray-700 gap-2 text-teal border-0">
            <h2 className="font-black text-2xl self-center">{upperFirstChar(dayOfWeek)}</h2>
            <img src={condition ? thumb : negative} alt={'thumb icon'} className={'invert w-10 self-center'} />
        </div>

        {dayVis && <>
            <div className='flex gap-2 m-2'>
                <p className='font-black text-xl lowercase'>Morning:</p>
                <input onChange={hc} name="morning" type="checkbox" defaultChecked={formVals.morning} />
            </div>
            <div className='flex gap-2 m-2'>
                <p className='font-black text-xl lowercase'>Afternoon:</p>
                <input 
                onChange={hc} 
                name="afternoon" 
                type="checkbox" 
                defaultChecked={formVals.afternoon} />
            </div>

            {user?.role === 'Admin' && <>
                <button 
                onClick={updateDB} 
                className="text-teal hover:scale-110 m-4 font-black border-0 rounded-2xl bg-gray-700 p-4" 
                children={`Update ${upperFirstChar(dayOfWeek)}`} />
            </>}
        </>}
    </>)
};