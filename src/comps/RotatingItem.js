import { useContext, useState } from "react";
import axios from "axios";
import { PATH } from "../confgs";
import NumsContext from "../context/NumsContext";

export default function RotatingItem(props) {
    const { user, getAll } = useContext(NumsContext);
    const { name, id } = props.item;
    const [value, setValue] = useState(name);

    function updateItem(e) {
        if (user.role != 'Admin') return alert('You are not authorized.');

        const cfg = {
            method: 'POST',
            url: `${PATH}/updateFoodItem`,
            data: {
                query: { id: id },
                changeThis: { name: value }
            }
        };

        alert('You have confirmed.');

        axios(cfg)
        .then((res) => {
            getAll();
        })
        .catch((err) => {
            console.log('err', err);
        });
    };

    return <>
                <div className="center w-10/12 p-4 rounded-xl text-teal gap-2 bg-slate-900 max-w-lg border flex flex-col justify-center items-center">
                    <b className="self-start p-2 uppercase tracking-widest">Updating {id}:</b>
                    <input className="rounded p-2 bg-slate-800 outline-none focus:font-black w-2/3" type="text" value={value} onChange={(e) => setValue(e.target.value)} />
                    <button className="rounded-lg border-0 p-2 bg-slate-700 w-1/2" onClick={() => {
                        if (!window.confirm(`Are you ready to update ${name} to ${value}?`)) return;

                        updateItem();
                    }}>Submit</button>
                 </div>
    </>
};