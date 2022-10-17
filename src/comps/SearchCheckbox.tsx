import thumb from '../assets/thumb.svg';
import negative from '../assets/negative.svg';
import { useState } from 'react';

export default function SearchCheckbox(props: any) {
    const { item, dayOfWeek } = props;
    const [dayVis, setDayVis] = useState(false);

    const upperFirstChar = (string: String) => {
        return string.slice(0,1).toUpperCase() + string.slice(1).toLowerCase();
    };

    const condition = (item?.[`${dayOfWeek}`].morning || item?.[`${dayOfWeek}`].afternoon);

    return(<>
        <div onClick={(e) => {setDayVis(!dayVis)}} className="flex cursor-pointer p-4 w-full rounded-2xl bg-gray-700 gap-2 text-teal border-0">
            <h2 className="font-black text-2xl self-center">{upperFirstChar(dayOfWeek)}</h2>
            <img src={condition ? thumb : negative} alt={'thumb icon'} className={'invert w-10 self-center'} />
        </div>

        {dayVis && <>
            <p>{upperFirstChar(dayOfWeek)} Morning: {item?.[`${dayOfWeek}`].morning ? 'True' : 'False'}</p>
            <p>{upperFirstChar(dayOfWeek)} Afternoon: {item?.[`${dayOfWeek}`].afternoon ? 'True' : 'False'}</p>
        </>}
    </>)
};