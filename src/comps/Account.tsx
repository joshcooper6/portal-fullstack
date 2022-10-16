import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import LoginForm from "./LoginForm";
const cookies = new Cookies();

export default function Account(props: any) {
      return (
        <div className="flex container flex-col min-h-screen min-w-screen align-center text-center justify-center ">
          <LoginForm />
          { cookies.get('session-token') && <Navigate to="/dashboard" /> }
        </div>
      );
}