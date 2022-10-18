import thumb from '../assets/thumb.svg';
import negative from '../assets/negative.svg';
import { useContext, useState } from 'react';
import NumsContext from '../context/NumsContext';

export default function SearchCheckbox(props) {

    const { setNumsNeeded, foodDB } = useContext(NumsContext);
    const { item, dayOfWeek } = props;
    const [dayVis, setDayVis] = useState(false);
    const [input, setInput] = useState([]);

    const upperFirstChar = (string) => {
        return string.slice(0,1).toUpperCase() + string.slice(1).toLowerCase();
    };

    const condition = (item?.[`${dayOfWeek}`].morning || item?.[`${dayOfWeek}`].afternoon);

    const hc = (e) => {
        let query = {};
        let filter = foodDB.filter((food) => food.id === item.id);
        let dbComparison = filter[0];

        if (dbComparison?.[`${dayOfWeek}`]?.[e.target.name] === e.target.checked) {
            console.log('same as in food db')
            query = {}
        } else {
            query = { id: dbComparison.id, [`${dayOfWeek}`]: { [e.target.name]: e.target.checked } }
        }
    };

    console.log('input', input)

    return(<>
        <div onClick={(e) => {setDayVis(!dayVis)}} className="flex cursor-pointer p-4 w-full rounded-2xl bg-gray-700 gap-2 text-teal border-0">
            <h2 className="font-black text-2xl self-center">{upperFirstChar(dayOfWeek)}</h2>
            <img src={condition ? thumb : negative} alt={'thumb icon'} className={'invert w-10 self-center'} />
        </div>

        {dayVis && <>

            <input name="afternoon" onChange={hc} defaultChecked={item?.[`${dayOfWeek}`].afternoon} type="checkbox"></input>

            <p>{upperFirstChar(dayOfWeek)} Morning: {item?.[`${dayOfWeek}`].morning ? 'True' : 'False'}</p>
            <p>{upperFirstChar(dayOfWeek)} Afternoon: {item?.[`${dayOfWeek}`].afternoon ? 'True' : 'False'}</p>
        </>}
    </>)
};