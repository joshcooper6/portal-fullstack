import { useState, useEffect, useContext } from "react"
import NumsContext from "../context/NumsContext";
import axios from "axios";
import { PATH } from "../confgs";

export default function TitleChange(props) {
   
    const [isActive, setIsActive] = useState(false);
    const [value, setValue] = useState(props.value);
    const { getAll, user } = useContext(NumsContext);
    
    function handleClick() {
        {user.role === 'Admin' ? setIsActive(!isActive) : alert('You are not authorized to change the title.')}
    };

    function handleChange(e) {
        setValue(e.target.value)
    }

    function handleSubmit() {
        const config = {
            method: 'post',
            url: `${PATH}/updateFoodItem`,
            data: {
                query: { id: props.id },
                changeThis: { name: value }
            }
        };

        axios(config)
            .then((res) => {
                console.log(`${props.id} was updated to ${value}.`)
                getAll();
            })
            .catch((err) => {
                console.log('Posting nums went wrong', err)
            });

    }

    function handleBlur() {
        handleClick();
        handleSubmit();
        // if (window.confirm('Are you sure you want to change the name in the DB?')) {
        //     alert('This is when they be posted.')
        // };
    }

    function Text() {
        return <span onClick={handleClick} children={value} className={`w-11/12 font-black text-center text-2xl uppercase tracking-wider truncate`} />
    }

    function TextInput() {
        return <input onBlur={handleBlur} onChange={handleChange} type="text" value={value} autoFocus={true} 
            className={'w-11/12 p-3 text-2xl font-black bg-white bg-opacity-10 border-0 rounded-full focus:outline-none'}
        />
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && isActive) {
            handleBlur()
        };
    })
    
   return <>
        { isActive ? <TextInput /> : <Text /> }
    </>
};