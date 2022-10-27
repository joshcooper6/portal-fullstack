import { useState, useEffect, useContext } from "react"
import NumsContext from "../context/NumsContext";
import axios from "axios";
import check from '../assets/check.svg';
import { PATH } from "../confgs";

export default function TitleChange(props) {
   
    const [isActive, setIsActive] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [value, setValue] = useState(props.value);
    const { getAll, user } = useContext(NumsContext);

    function handleClick() {
        const msg = `If you need to change the name of ${props.value} in the database, let an admin know.`
        { user.role === 'Admin' ? setIsActive(!isActive) : alert(msg) }
    };

    function handleChange(e) {
        setValue(e.target.value)
    };

    console.log('confirmed', confirmed)

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
                setConfirmed(true);
            })
            .catch((err) => {
                console.log('Posting nums went wrong', err)
            });

    }

    function buttonConfirm() {
        // if (window.confirm(`Are you ready to change the name of ${props.id} to ${value}?`)) {
        //     // handleClick();
        //     // handleSubmit();
        //     setConfirmed(true)
        // };
        setConfirmed(true);
    }

    document.addEventListener('dblclick', () => {
        setIsActive(false)
        setValue(props.value)
    })

    function Text() {
        return <span onClick={handleClick} children={value} className={`w-11/12 font-black text-center text-2xl uppercase tracking-wider truncate`} />
    }

    function TextInput() {
        return <>
            <div className={`flex gap-2 ${confirmed && 'justify-center items-center'}`}>
                <input 
                    onChange={handleChange} 
                    type="text" 
                    value={value} 
                    // onAnimationEnd={() => {setConfirmed(false); handleClick();}}
                    autoFocus={true} 
                    className={`w-full p-3 ${confirmed && 'submitAnimation'} shadow-xl text-2xl font-black bg-white bg-opacity-10 border-0 rounded-full focus:outline-none`}
                />
                <button                     
                    onAnimationEnd={() => {let timeout = setTimeout(() => { setConfirmed(false); handleClick(); }, 500)}}  
                    className={`${confirmed && 'checkGrow self-center'}`} 
                    onClick={buttonConfirm}>
                    <img src={check} className={'invert object-contain'} alt={'verify name change'} />
                </button>
            </div>
        </>
    }
    
   return <>
        { isActive ? <TextInput /> : <Text /> }
    </>
};