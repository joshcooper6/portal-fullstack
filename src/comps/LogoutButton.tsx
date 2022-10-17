import React from 'react';
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function LogoutButton(props: any) {
   const styles = `text-white uppercase tracking-widest self-center bg-blue-500 p-4 rounded-xl max-w-lg w-4/5`;
   const removeThisCookie = 'session-token';
   const text = props.text || 'Logout';
   const override_styles = props.override;

   return(<>
        <button className={override_styles || styles} onClick={() => {
            cookies.remove(removeThisCookie, { path: "/" });
            window.location.href = "/";
        }}>{text}</button>
    </>)
};