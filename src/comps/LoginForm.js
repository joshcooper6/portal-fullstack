import { useState } from "react";
import { PATH } from "../confgs";
import axios from "axios";
import logo from '../assets/logo.png';
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function LoginForm(props) {

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
    
      const hc = (e) => {
        setFormData((prev) => ({
          ...prev,
          [e.target.name]: e.target.value
        }))
      };

      const quickMsgChange = (msg) => {
        setServerMsg(msg);

        setTimeout(() => {
          setServerMsg("")
        }, 1500)
      };

      const renderFromResponse = (data) => {
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
    
      const hs = async (e) => {
        e.preventDefault();
        const config = {
            method: 'post',
            url: `${PATH}/${formStatus.path}`,
            data: formData
        };

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

      const buttonToggle = (e) => {
        e.preventDefault();
        // eslint-disable-next-line
        {(formStatus.path === 'register') ? setFormStatus(ROUTES.LOGIN) : setFormStatus(ROUTES.REGISTER)}
      };

    return(<>
        <div className="box">
                <div className='form'>
                    <form autoComplete="off" onSubmit={hs} className="content">
                        <div className="flex w-full justify-between">
                            <img className="w-1/3 opacity-30 self-center" src={logo} alt="UCL logo" />
                            <h2 className="self-center">{formStatus.title}</h2>
                        </div>
                        
                        <div className='inputBox'>
                            <input type={'text'} name={'username'} onChange={hc} required={true} />
                            <span children={'Username'} />
                            <i />
                        </div>
                        <div className='inputBox'>
                            <input type={'password'} name={'password'} onChange={hc} required={true} />
                            <span children={'Password'} />
                            <i />
                        </div>
                        <div className="links">
                            {/* <a href={'#'} children={'Forgot Password'} /> */}
                            <p onClick={buttonToggle} children={ formStatus.title === 'Register' ? 'Sign In' : 'Sign Up' } />
                        </div>
                        <button  type="submit" className="submit" children={formStatus.title} />
                    </form>
                </div>
            </div>
            <p className="text-white font-light text-sm fixed top-10">{serverMsg}</p>
    </>)
};