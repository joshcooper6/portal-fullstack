import { useContext } from "react"
import NumsContext from "../context/NumsContext"
import logo from '../assets/logo.png';
import { render } from "@testing-library/react";
import LogoutButton from "./LogoutButton";


export default function Header(props: any) {

    const { user, message } = useContext(NumsContext);

    // const renderNumberAlert = () => {
    //     if ((todaysNums.morning.length > 0) && (todaysNums.afternoon.length > 0)) {
    //         return 'You will have numbers in the morning and the afternoon'
    //     } else if ((todaysNums.morning.length > 0) && (todaysNums.afternoon.length <= 0)) {
    //         return 'You will only have numbers in the morning'
    //     } else if (todaysNums.morning.length <= 0 && todaysNums.afternoon.length > 0) {
    //         return 'You will only have numbers in the afternoon'
    //     }
    // };

    return(<>
                        <div className="header_styles drop-shadow-xl mb-10 p-6 justify-between self-center text-center w-screen flex flex-row-reverse">
                    <div id="HEADER_TEXT" className="self-center flex flex-col">
                        <h2 className="text-teal self-end flex lg:text-4xl text-xl font-black uppercase">Welcome {user?.firstName} <span className="md:flex text-teal hidden font-thin">/{user?.username}</span></h2>
                        <div className="flex flex-col self-end">
                            <h2 className="text-white text-md lg:text-xl opacity-80 uppercase font-light tracking-widest">Account Role: <span className="font-bold">{user?.role}</span></h2>
                            <LogoutButton override="hover:font-black hover:opacity-100 opacity-50 self-end text-left text-teal font-light uppercase" />
                        </div>
                    </div>   
                    <img className="w-2/12 opacity-70 logo_height self-center max-w-sm" src={logo} alt='ucl logo' />
                </div>
    </>)
}