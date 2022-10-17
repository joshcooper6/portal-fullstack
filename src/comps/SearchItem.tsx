import { useState } from "react";
import thumb from '../assets/thumb.svg';
import negative from '../assets/negative.svg';
import SearchCheckbox from "./SearchCheckbox";


export default function SearchItem(props: any) {
    const { item } = props;
    
    const [daysVisible, setDaysVisible] = useState(false);
    
    const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    const upperFirstChar = (string: String) => {
        return string.slice(0,1).toUpperCase() + string.slice(1).toLowerCase();
    };
   
   return(<div key={item.name} className="flex flex-col justify-center items-center border p-6 w-10/12 max-w-lg m-4 rounded-xl bg-gray-900 text-teal border-gray-900">
    <p className="font-black text-center text-2xl uppercase tracking-wider">{item.name}</p>
    <p className="text-xl text-center font-thin">{item.id} <span className="text-3xl">|</span> {upperFirstChar(item.vendor)}</p>

    <button onClick={() => {setDaysVisible(!daysVisible)}} className="text-teal hover:scale-110 m-4 font-black border-0 rounded-full bg-gray-700 p-4" children={daysVisible ? 'Hide Item Schedule' : 'See Item Schedule'} />

    {daysVisible && <>
        <div className="flex flex-col justify-center items-center gap-1">
            {weekdays.map((day: String) => { return <SearchCheckbox item={item} dayOfWeek={day} /> })}
        </div>
        <button onClick={() => alert('Function coming soon')} className="text-teal hover:scale-110 m-4 font-black border-0 rounded-full bg-gray-700 p-4" children={'Update Food Item'} />
    </>}
</div>)
}