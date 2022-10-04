
import Cookies from "universal-cookie";

export const PATH = 'http://localhost:5000';
const cookies = new Cookies();
const token = cookies.get("session-token");
