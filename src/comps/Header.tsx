import { useContext } from "react"
import NumsContext from "../context/NumsContext"
import logo from '../assets/logo.png';


export default function Header(props: any) {

    const { user, message } = useContext(NumsContext);

    return(<>
            <div className="flex gap-4 flex-col lg:flex-row max-w-xl self-center justify-between align-center">
                {/* <img src={logo} alt="UCL logo" className="invert self-center text-center w-5/12 lg:w-2/12" />  */}
                <h1 className="text-5xl self-center uppercase text-center font-bold tracking-tight">
                    Welcome {user?.firstName}!
                </h1>
            </div>
  
            {/* <h2 className="self-center text-center text-4xl tracking-tightest uppercase font-bold">Current Info</h2> */}

            <h2 className="text-center text-xl italic">
                Message from {message.firstName}: {message.broadcast}
            </h2>

            <h2 className="text-lg text-center self-center pl-4 pr-4">
                You are known to the world as <b>{user.username}</b>.
                
                <br />

                {user.email.length > 0 ? <>
                    The email you have on file is <b>{user.email}</b>.
                </> : <>
                    You have not added an email on file yet.
                </>}

                <br />

                Your current account role is <b>{user.role}</b>.
            </h2>
    </>)
}