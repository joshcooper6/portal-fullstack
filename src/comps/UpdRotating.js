import { useContext, useEffect, useState } from "react";
import NumsContext from "../context/NumsContext";
import axios from "axios";
import TextToInput from "./TextToInput";
import { PATH } from "../confgs";

export default function UpdRotating(props) {

    const { getAll, foodDB, setFoodDB, user, setUser } = useContext(NumsContext);
    const [changeRotating, setChangeRotating] = useState(false);
    const [rotatingNums, setRotatingNums] = useState([]);
    const [input, setInput] = useState([]);


    const handlePost = (e) => {
        // rotatingNums.forEach((number: any) => {
        //     const config = {
        //         method: 'post',
        //         url: `${PATH}/updateFood`,
        //         data: {
        //             query: { id: number.id },
        //             changeThis: { name: number.name }
        //         }
        //     };
    
        //     axios(config)
        //         .then((res) => {
        //             console.log('UPDATING ROTATING NUMS', res);
        //             getAll();
        //         })
        //         .catch((err) => {
        //             console.log('something went wrong updating', err)
        //     })
        // });

        // alert('Database updated!');

        // setTimeout(() => {
        //     setChangeRotating(false)
        // }, 300);

    };

    const initialFilter = [...foodDB.filter((num) => {
        return num.rotating === true
     })];


    const hc =(e) => {
        const query = { id: e.target.id, newName: e.target.value };
        console.log(query)
    };


    useEffect(() => {
        if (changeRotating) {setRotatingNums(initialFilter); console.log('rotating nums loaded')}
    }, [changeRotating]);

    return(<>

        {(user.role === 'Admin') && <>
                <button 
                    onClick={() => {
                        if (user.role === 'Admin') {
                            setChangeRotating(!changeRotating); 
                        } else {
                            alert('This action is only availble to management.')
                        }
                    }}

                    className={`p-4 
                        tracking-widest 
                        uppercase 
                        ${changeRotating ? 'bg-red-200' : 'bg-blue-100'} 
                        rounded-xl 
                        max-w-lg
                        border w-4/5 
                        self-center`}>
                            {changeRotating ? 'Hide Rotating Items' : 'Update Rotating Items'}
                </button>
            </>
        }


        { changeRotating && <>

                    <h1 className="text-center self-center uppercase text-3xl font-bold tracking-tight">Update Rotating Food</h1>

                    <div className="flex flex-col w-4/5 max-w-lg gap-6 justify-center align-center self-center">
                        {rotatingNums.map((obj) => {
                                return <>
                                <input type='text' name={obj.name} id={obj.id} placeholder={`Click to change the name for ${obj.name}`} key={obj.id} onChange={hc} className="flex flex-col gap-2">
                                    <TextToInput 
                                            key={obj._id} 
                                            setNumsNeeded={setRotatingNums} 
                                            numsNeeded={rotatingNums}
                                            id={obj.id}
                                            value={obj.name} 
                                            hiddenTally
                                        />
                                </input>
                                </>
                        })}

                        <button onClick={handlePost} className="p-3 bg-green-100 font-light uppercase tracking-widest text-xl border rounded-xl">Update</button>
                    </div>

                </> 
            }
            
    </>)
};