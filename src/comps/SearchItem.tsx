import { useContext, useState } from "react";
import SearchCheckbox from "./SearchCheckbox";
import upperFirstChar from "../funcs/upperFirstChar";
import { weekdays } from "../funcs/vars";
import TitleChange from  "./TitleChange";
import { PATH } from "../confgs";
import axios from "axios";
import NumsContext from "../context/NumsContext";

export default function SearchItem(props: any) {
    const { item } = props;
    const { getAll, user } = useContext(NumsContext);
    const [daysVisible, setDaysVisible] = useState(false);

    function deleteItem(e: any) {
        if (!window.confirm('Are you sure you want to delete this?')) return;
        if (user.role != 'Admin') return alert('You are not authorized.');

        const cfg = {
            method: 'POST',
            url: `${PATH}/deleteFoodItem`,
            data: {
                query: { id: item.id },
            }
        };

        alert('You have confirmed.');

        axios(cfg)
        .then((res) => {
            console.log('deleted', res);
            getAll();
        })
        .catch((err) => {
            console.log('err', err);
        });
    }
    
   return(<div key={item.name} className={`flex flex-col justify-center items-center border p-6 w-10/12 max-w-lg m-4 rounded-xl bg-gray-900 text-teal border-gray-900`}>
    
    <TitleChange value={item.name} id={item.id} />
    <p className="text-xl truncate w-11/12 text-center font-thin">{item.id} <span className="text-3xl">|</span> {upperFirstChar(item.vendor)}</p>
    <button onClick={() => {setDaysVisible(!daysVisible)}} className="text-teal hover:scale-110 m-4 font-black border-0 rounded-full bg-gray-700 p-4" children={daysVisible ? 'Hide Item Schedule' : 'See Item Schedule'} />

        {daysVisible && <>
            <div className={`flex flex-col justify-center items-center gap-1 h-11/12 overflow-scroll`}>
                {weekdays.map((day) => { return <SearchCheckbox key={`${item.id}/${day}`} item={item} dayOfWeek={day} /> })}
            </div>

            <button onClick={deleteItem} className={`uppercase font-black tracking-widest mt-4 transition_ease hover:border-b-2 hover:pb-1`} children={'Delete This Item'} />

        </>}

</div>)
} 