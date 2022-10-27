import { useState, useEffect, useContext } from "react"
import NumsContext from "../context/NumsContext";
import axios from "axios";
import check from '../assets/check.svg';
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

    function buttonConfirm() {
        if (window.confirm(`Are you ready to change the name of ${props.id}?`)) {
            handleClick();
            handleSubmit();
        };
    }

    function handleBlur() {
        // setValue(props.value);
        // handleClick();
        if (window.confirm('Are you sure you want to discard changes?')) {
            setValue(props.value);
            handleClick();
        }
    }


    function Text() {
        return <span onClick={handleClick} children={value} className={`w-11/12 font-black text-center text-2xl uppercase tracking-wider truncate`} />
    }

    function TextInput() {
        return <>
            <div className="flex gap-2">
                <input 
                    // onBlur={handleBlur} 
                    onChange={handleChange} 
                    type="text" 
                    value={value} 
                    autoFocus={true} 
                    className={'w-full p-3 text-2xl font-black bg-white bg-opacity-10 border-0 rounded-full focus:outline-none'}
                />
                <button onClick={buttonConfirm}>
                    <img src={check} className={'invert object-contain'} alt={'verify name change'} />
                </button>
            </div>
        </>
    }
    
   return <>
        { isActive ? <TextInput /> : <Text /> }
    </>
};