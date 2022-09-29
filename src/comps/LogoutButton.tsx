import React from 'react';
import Cookies from "universal-cookie";
const cookies = new Cookies();


export default function LogoutButton(props: any) {
   const styles = props.tailwindstyles;
   
   return(<>
        <button className={styles} onClick={() => {
            cookies.remove('session-token', { path: "/" });
            window.location.href = "/";
        }}>Logout</button>
    </>)
};