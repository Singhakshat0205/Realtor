import React, { useEffect, useState } from 'react'
import '../index.css'
import { useLocation } from 'react-router'

import { useNavigate } from 'react-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
const Header = () => {

    const [pageState, setPageState]= useState("Sign-in");
   
    const location= useLocation();

    const navigate= useNavigate();
    const pathMatchRoute=(route)=>{
        if(route===location.pathname){return true;}

    }

    const auth= getAuth();
     useEffect(()=>{
        onAuthStateChanged(auth, (user)=>{
            if(user){
                setPageState("Profile")
            }
            else{setPageState("Sign-in")}
        })
     })

  return (
    <div className='bg-white border-b shadow-sm z-50 '>
        <header className='flex justify-between items-center px-3 max-w-6xl mx-auto '>
            <div>
                <img src='https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg'  alt='realtor.com' className='h-6 w-[140px] cursor-pointer ' onClick={()=>navigate("/")} />
            </div>
            <div >
                <ul className='flex space-x-10'>
                    <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] ${pathMatchRoute("/") && "border-b-red-600 text-black"}  `}onClick={()=>navigate("/")}>Home</li>
                    <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px]  ${pathMatchRoute("/offers") && "border-b-red-600 text-black"}`} onClick={()=>{navigate("/offers")}}>Offers</li>
                    <li 
                    className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px]  ${
                    (pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) && "border-b-red-600 text-black"}`} onClick={()=>{navigate("/profile")}}>
                        {pageState}
                    </li>
                </ul>
            </div>
        </header>
    </div>
  )
}

export default Header