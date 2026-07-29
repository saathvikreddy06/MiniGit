import React, { useEffect } from "react";
import {useNavigate, useRoutes} from 'react-router-dom'

import DashBoard from "./components/dashboard/DashBoard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/SignUp.jsx";
import CreateRepository from "./components/repo/CreateRepository";

import { useAuth } from "./authContext";

const ProjectRoutes = ()=>{
    const {currentUser, setCurrentUser} = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        const userIdFromStorage = localStorage.getItem("userId");

        if(userIdFromStorage && !currentUser){
            setCurrentUser(userIdFromStorage);
        }

        if(!userIdFromStorage && !["/auth", "/signup"].includes(window.location.pathname))
        {
            navigate("/auth");
        }

        if(userIdFromStorage && window.location.pathname=='/auth'){
            navigate("/");
        }
    }, [currentUser, navigate, setCurrentUser]);

    let element = useRoutes([
        {
            path:"/",
            element:<DashBoard/>
        },
        {
            path:"/auth",
            element:<Login/>
        },
        {
            path:"/signup",
            element:<Signup/>
        },
        {
            path:"/profile",
            element:<Profile/>
        },
        {
            path:"/create",
            element:<CreateRepository/>
        }
    ]);

    return element;
}

export default ProjectRoutes;