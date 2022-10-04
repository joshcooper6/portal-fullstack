import axios from "axios";
import { useContext } from "react";
import NumsContext from "../context/NumsContext";
import { PATH } from "../confgs";

export default function Broadcast(props: any) {

    const { message, user, setMessage } = useContext(NumsContext);

    const postMsg = () => {
        const config = {
            method: 'post',
            url: `${PATH}/sendAdminMsg`,
            data: {
                msg: message.currentInput,
                username: user.username,
                firstName: user.firstName 
            }
        };

        axios(config)
        .then((succ) => {
            console.log('SUCCESS', succ)
        })
        .catch((err) => {
            console.log('error', err)
        })
    };

    return (<>
        {user.role === 'Admin' && 

            <div className="flex flex-col justify-center items-center gap-2 p-6">
                <h1 className="text-xl tracking-widest uppercase font-light">Need to communicate to the team?</h1>
                <form onSubmit={(e: any) => { e.preventDefault() }} className="flex w-10/12 max-w-lg self-center justify-center align-center">
                    <input 
                    value={message.currentInput} 
                    onChange={(e: any) => {
                        setMessage((prev:any) => ({
                            ...prev,
                            currentInput: e.target.value
                        }))
                    }} 
                    type="text" 
                    placeholder="Enter your message here..."
                    className="border p-4 self-center custom_b1 bg-slate-50 font-light text-xl w-full" />
                    <button onClick={(e:any) => {

                        const a = `WARNING: This message will be broadcasted to all users. Do you want to proceed?`

                        if (window.confirm(a) == true) {
                            setMessage((prev:any) => ({
                                ...prev,
                                broadcast: prev.currentInput,
                                currentInput: '',
                                username: user.username,
                                firstName: user.firstName
                            }))
                        };

                        postMsg();
                    }} className="border custom_b2 w-1/2 bg-blue-50 uppercase font-light tracking-tight">Broadcast</button>
                </form>
            </div>
        }
    </>)
};