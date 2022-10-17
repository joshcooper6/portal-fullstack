import { useContext, useState } from "react";
import Fuse from 'fuse.js';
import NumsContext from "../context/NumsContext";
import SearchItem from "./SearchItem";

export default function Search() {

    const { foodDB, user } = useContext(NumsContext);
    const [searchQuery, setSearchQuery] = useState();

    const fuse = new Fuse(foodDB, {keys: ["name", "id", "vendor"], threshold: 0.1},);

    const searchFor = (value: any) => {
        if (!value) {
            return []
        }

        return fuse.search(value).map((result) => result.item);
    };

    const resultsArray = searchFor(searchQuery);
    console.log(resultsArray);

    return(<>
                <div className='flex self-center flex-col justify-center items-center w-10/12 max-w-lg'>
                    <input type="text" 
                    placeholder='Search food database...'
                    onChange={(e: any) => { setSearchQuery(e.target.value) }}
                    className='border bg-gray-900 font-black text-xl w-full text-teal p-4 rounded-full' />
                    <div className="grid_custom max-w-xl">
                        {resultsArray.map((item: any) => {
                            return <SearchItem item={item} />
                        })}

                    </div>
                </div>
        </>)
};