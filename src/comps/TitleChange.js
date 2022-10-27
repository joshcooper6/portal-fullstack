import { useState, useEffect, useContext } from "react"
import NumsContext from "../context/NumsContext";

export default function TitleChange(props) {
   
    const [isActive, setIsActive] = useState(false);
    const [value, setValue] = useState(props.value);
    const { setNumsNeeded } = useContext(NumsContext);
    
    function handleClick() {
        setIsActive(!isActive);
    };

    function handleBlur() {
        handleClick();
        
        if (window.confirm('Are you sure you want to change the name in the DB?')) {
            alert('This is when they be posted.')
        };
    }

    function Text() {
        return <span onClick={handleClick} children={value} className={`w-11/12 font-black text-center text-2xl uppercase tracking-wider truncate`} />
    }

    function TextInput() {
        const hc = (e) => {
            setValue(e.target.value)
        }

        return <input onBlur={handleBlur} onChange={hc} type="text" value={value} autoFocus={true} />
    }

    // useEffect(() => {
    //     setNumsNeeded((prev) => 
    //         prev.map((object) => {
    //             if(object.id === props.id) {
    //                 return {...object, name: value }
    //             };
                
    //             return object;
    //         })
    //     );
    // }, [value]);
    
   return <>
        { isActive ? <TextInput /> : <Text /> }
    </>
};