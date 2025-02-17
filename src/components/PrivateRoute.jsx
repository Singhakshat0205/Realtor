import { Outlet } from "react-router"
import { Navigate } from "react-router";
import { useAuthStatus } from "../hooks/useAuthStatus";
import Spinner from "./Spinner";


export default function PrivateRoute() {

    const {loggedIn, checkStatus}= useAuthStatus();
    if(checkStatus){
       return <>
        <Spinner/>
       </>
    }
   
    return loggedIn ? <Outlet/> : <Navigate to="/sign-in"/>
}