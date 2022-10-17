import { useContext } from "react"
import NumsContext from "../context/NumsContext"
import logo from '../assets/logo.png';
import search from '../assets/search.svg';
import LogoutButton from "./LogoutButton";

export default function Header(props: any) {

    const { user, showSearch, setShowSearch } = useContext(NumsContext);

    return(<>
                <div className="bg-gray-900 drop-shadow-xl mb-10 p-6 justify-between self-center text-center w-screen flex flex-row-reverse">
                    <div id="HEADER_TEXT" className="self-center flex flex-col">
                        <h2 className="text-teal self-end flex lg:text-4xl text-xl font-black uppercase">Welcome {user?.firstName} <span className="md:flex text-teal hidden font-thin">/{user?.username}</span></h2>
                        <div className="flex flex-col self-end">
                            <h2 className="text-white text-md lg:text-xl opacity-80 uppercase font-light tracking-widest">Account Role: <span className="font-bold">{user?.role}</span></h2>
                            <LogoutButton override="transition_ease hover:font-black hover:opacity-100 opacity-50 self-end text-left text-teal font-light uppercase" />
                        </div>
                        <img onClick={() => setShowSearch(!showSearch)} className="cursor-pointer transition_ease hover:scale-110 p-2 pb-0 invert self-end" src={search} alt="search button" />
                    </div>   
                    <img className="w-2/12 opacity-70 logo_height self-center max-w-sm" src={logo} alt='ucl logo' />
                </div>
    </>)
};