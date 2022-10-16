import React, { useEffect, useState } from "react";
import axios from "axios";
import { PATH } from "../confgs";
import { Navigate, Route, Routes } from "react-router-dom";
import Cookies from "universal-cookie";
import logo from '../assets/logo.png';
const cookies = new Cookies();

export default function Account(props: any) {

    const ROUTES = {
        LOGIN: {
          title: 'Login',
          path: 'login',
          button: 'Create a new account'
        },
        REGISTER: {
          title: 'Register',
          path: 'register',
          button: 'Login to existing account'
        }
      };
    
      const [formStatus, setFormStatus] = useState(ROUTES.LOGIN);
      const [serverMsg, setServerMsg] = useState("");
      const [formData, setFormData] = useState({
        username: "",
        password: ""
      });
    
      const hc = (e: any) => {
        setFormData((prev) => ({
          ...prev,
          [e.target.name]: e.target.value
        }))
      };
    
      const config = {
        method: 'post',
        url: `${PATH}/${formStatus.path}`,
        data: formData
      };

      const quickMsgChange = (msg: any) => {
        setServerMsg(msg);

        setTimeout(() => {
          setServerMsg("")
        }, 1500)
      };

      const renderFromResponse = (data: any) => {
        const x = data;

        if (x.message === 'cannot-create-user') {
          quickMsgChange('This account exists already. Try another username.')
        }; 
        
        if (x.message === 'user-created') {
          quickMsgChange('Login successful! Redirecting...')
        }; 

        if (x.message === 'invalid-information') {
          quickMsgChange('Information is invalid! Please try again...')
        };

        if (x.message === 'user-not-found') {
          quickMsgChange('User not found... create a new account instead!')
        }
        
        if (x.success) {
          quickMsgChange('Success! Redirecting...')
          cookies.set("session-token", x.token, {
            path: "/",
          });

          window.location.href="/dashboard";
        };
      };
    
      const hs = async (e: any) => {
        e.preventDefault();
    
        await axios(config)
          .then((res) => {
            let data = res.data;
            renderFromResponse(data);
            console.log(data);
          })
          .catch((err) => {
            console.log(err)
          })
      };

      const fs = "border rounded-xl md:p-6 p-4 text-xl focus:bg-blue-500 w-full active:shadow-lg";
      
      const buttonToggle = (e: any) => {
        e.preventDefault();
        {(formStatus.path === 'register') ? setFormStatus(ROUTES.LOGIN) : setFormStatus(ROUTES.REGISTER)}
      };

      return (
        <div className="flex flex-col min-h-screen min-w-screen align-center text-center justify-center ">
          <div className="flex flex-col gap-2 max-w-2xl self-center w-3/4 border p-6 rounded-xl shadow-xl">

            <div className="flex flex-row-reverse justify-between self-center p-6 gap-2">
              <p className='font-bold self-center md:text-6xl text-5xl tracking-tighter uppercase text-left'>{formStatus.title}</p>
              <img src={logo} alt="UCL logo" className="invert w-1/3 h-1/2" />
            </div>

            <form className='flex flex-col self-center gap-2 w-full'>
              <input tabIndex={1} onChange={hc} type="text" name="username" placeholder="Username" className={fs} />
              <input tabIndex={2} onChange={hc} type="password" name="password" placeholder="Password" className={fs} />
              <button tabIndex={3} onClick={hs} className={fs} >Click to {formStatus.title}</button>
              {serverMsg.length > 0 && <p className="font-bold">{serverMsg}</p>}
              <button tabIndex={4} onClick={buttonToggle} className={fs}>{formStatus.button}</button>
            </form>

          </div>

          { cookies.get('session-token') && <Navigate to="/dashboard" /> }
        </div>
      );
}