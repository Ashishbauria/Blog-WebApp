import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext =createContext();

export const AuthContextProvider=({children})=>{
    const [currentUser,setCurrentUser]=useState(JSON.parse(localStorage.getItem("user"))||null)

    const login =async(input)=>{
        const res = await axios.post(
            "http://localhost:8800/api/auth/login",
            input,
            { withCredentials: true });
            
            setCurrentUser(res.data);
    }

    const logout =async()=>{
        const res = await axios.post(
            "http://localhost:8800/api/auth/logout",
            4651535,
            { withCredentials: true });

            setCurrentUser(null);
    }


    useEffect(()=>{
        localStorage.setItem("user",JSON.stringify(currentUser));
    },[currentUser])

    return <AuthContext.Provider value={{currentUser,login,logout}}>{children}</AuthContext.Provider>
}