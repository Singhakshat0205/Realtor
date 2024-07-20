import React from 'react'
import '../index.css'
import { useLocation } from 'react-router'
import { useNavigate } from 'react-router'
const Header = () => {

     
    
    const navigate= useNavigate();
    const location= useLocation();
    console.log(location);

    const pathMatchRoute=(route)=>{
        if(route===location.pathname){return true;}

    }
  return (
    <div className='bg-white border-b shadow-sm z-50 '>
        <header className='flex justify-between items-center px-3 max-w-6xl mx-auto '>
            <div>
                <img src='https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg'  alt='realtor.com' className='h-7 cursor-pointer  ' onClick={()=>navigate("/")} />
            </div>
            <div >
                <ul className='flex space-x-10'>
                    <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMatchRoute("/") && "border-b-red-600 text-black"}  `}onClick={()=>navigate("/")}>Home</li>
                    <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMatchRoute("/offers") && "border-b-red-600 text-black"} `} onClick={()=>{navigate("/offers")}}>Offers</li>
                    <li 
                    className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMatchRoute("/sign-in") && "border-b-red-600 text-black"} `} onClick={()=>{navigate("/sign-in")}}>
                        Sign-in
                    </li>
                </ul>
            </div>
        </header>
    </div>
  )
}

export default Header