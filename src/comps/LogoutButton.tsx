import React from 'react';
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function LogoutButton(props: any) {
   const styles = props.styles;
   const removeThisCookie = 'session-token';
   const text = props.text || 'Logout';
   
   return(<>
        <button className={styles} onClick={() => {
            cookies.remove(removeThisCookie, { path: "/" });
            window.location.href = "/";
        }}>{text}</button>
    </>)
};