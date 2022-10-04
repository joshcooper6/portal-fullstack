import React, { Component, useContext, useEffect } from "react";
import { Route, Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";
import NumsContext from "../context/NumsContext";
const cookies = new Cookies();

export default function ProtectedRoutes(props: any) {

  const { user, setUser, getFromServer } = useContext(NumsContext);
  const token = cookies.get("session-token");
  const Component = props.component;

  useEffect(() => {
    const configuration = {
        method: "get",
        url: "http://localhost:5000/auth",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    axios(configuration)
        .then((result) => {
            setUser(result.data.user);
            getFromServer();
        })
        .catch((error) => {
            console.log('Something went wrong', error);
        });
}, []);   

  return (<>
      <Component {...props} />
  </>)
};