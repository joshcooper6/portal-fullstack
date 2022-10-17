import { useState } from "react";
import thumb from '../assets/thumb.svg';
import negative from '../assets/negative.svg';


export default function SearchItem(props: any) {
    const { item } = props;
    
    const [daysVisible, setDaysVisible] = useState(false) 
    
    const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    const upperFirstChar = (string: String) => {
        return string.slice(0,1).toUpperCase() + string.slice(1).toLowerCase();
    };

    const checkboxes = (item: any, dayOfWeek: any) => {
        const condition = (item?.[`${dayOfWeek}`].morning || item?.[`${dayOfWeek}`].afternoon);

        return (<>
            <div className="flex gap-2 text-teal">
                <h2 className="font-black text-2xl self-center">{upperFirstChar(dayOfWeek)}</h2>
                 <img src={condition ? thumb : negative} alt={'thumb icon'} className={'invert w-10 self-center'} />
            </div>
            <p>{upperFirstChar(dayOfWeek)} Morning: {item?.[`${dayOfWeek}`].morning ? 'True' : 'False'}</p>
            <p>{upperFirstChar(dayOfWeek)} Afternoon: {item?.[`${dayOfWeek}`].afternoon ? 'True' : 'False'}</p>
        </>)
    };
   
   return(<div key={item.name} className="flex flex-col justify-center items-center border p-6 w-10/12 max-w-lg m-4 rounded-xl bg-gray-900 text-teal border-gray-900">
    <p className="font-black text-center text-2xl uppercase tracking-wider">{item.name}</p>
    <p className="text-xl text-center font-thin">{item.id} <span className="text-3xl">|</span> {upperFirstChar(item.vendor)}</p>

    <button onClick={() => {setDaysVisible(!daysVisible)}} className="text-teal hover:scale-110 m-4 font-black border-0 rounded-full bg-gray-700 p-4" children={daysVisible ? 'Hide Item Schedule' : 'See Item Schedule'} />

    {daysVisible && <>
        {weekdays.map((day: String) => { return checkboxes(item, day) })}
        <button onClick={() => alert('Function coming soon')} className="text-teal hover:scale-110 m-4 font-black border-0 rounded-full bg-gray-700 p-4" children={'Update Food Item'} />
    </>}
</div>)
}