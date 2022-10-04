import React, { Component, useContext, useEffect } from "react";
import { Route, Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";
import NumsContext from "../context/NumsContext";
const cookies = new Cookies();

export default function ProtectedRoutes({ element: Component, ...restOfProps }) {

  const token = cookies.get("session-token");

  return (<Route 
    {...restOfProps}
    render={(props) => {
        token ? <Component {...props} /> : <Navigate to="/" />
    }}
/> )
};