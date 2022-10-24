import { useContext, useState } from "react";
import Fuse from 'fuse.js';
import NumsContext from "../context/NumsContext";
import SearchItem from "./SearchItem";

export default function Search(props: any) {

    const { foodDB, user, showSearch } = useContext(NumsContext);
    const [searchQuery, setSearchQuery] = useState();

    const fuse = new Fuse(foodDB, {keys: ["name", "id", "vendor"], threshold: 0.1},);

    const searchFor = (value: any) => {
        if (!value) {
            return []
        }

        return fuse.search(value).map((result) => result.item);
    };

    const resultsArray = searchFor(searchQuery);

    return(<>
                <div className='flex self-center flex-col justify-center items-center w-10/12 max-w-lg m-6'>
                    <input type="text" 
                    placeholder='Search food database...'
                    onChange={(e: any) => { setSearchQuery(e.target.value) }}
                    className={`mb-5 border-0 transition_ease ${!showSearch && 'h-0 p-0 placeholder:text-transparent border-0'} p-6 bg-gray-900 font-black text-xl w-full text-teal rounded-full`}/>
                    <div className="grid_custom max-w-xl">

                        {showSearch && <>
                            {resultsArray.map((item: any) => {
                                return <SearchItem key={item._id} item={item} />
                            })}
                        </>}

                    </div>
                </div>
        </>)
};