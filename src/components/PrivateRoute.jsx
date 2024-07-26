import { Outlet } from "react-router"
import { Navigate } from "react-router";
import { useAuthStatus } from "../hooks/useAuthStatus";


export default function PrivateRoute() {

    const {loggedIn, checkStatus}= useAuthStatus();
    if(checkStatus){
       return <h1>Loading...</h1>
    }
   
    return loggedIn ? <Outlet/> : <Navigate to="/sign-in"/>
}