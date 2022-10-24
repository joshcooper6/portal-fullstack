
import Cookies from "universal-cookie";

export const PATH = 'https://us-central1-ucl-portal.cloudfunctions.net/app';
const cookies = new Cookies();
const token = cookies.get("session-token");
