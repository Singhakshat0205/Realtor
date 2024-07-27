import { getAuth, updateProfile } from 'firebase/auth'
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FcHome } from "react-icons/fc";
import { Link } from 'react-router-dom';
const Profile = () => {

  const auth= getAuth();
   const navigate= useNavigate();
    const [changeDetail, setChangeDetail]= useState(false);
  const [formData, setFormData]= useState({
    name:auth.currentUser.displayName,
    email:auth.currentUser.email
  })


  const onLogOut= ()=>{
     auth.signOut();
     toast.success("Signed out successfully");
     navigate("/");

  }
   
  const onsubmit= async()=>{
    try {
      
      if(auth.currentUser.displayName!==name){
        //update displayname in firebase auth
       await updateProfile(auth.currentUser, {
        displayName:name
       })

       //update the displayname in firestore
        
       const docRef= doc(db, "users", auth.currentUser.uid)
        await updateDoc(docRef, {name});
        toast.success("Profile details updated");
      }


    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  const {name, email}= formData;


  const toggleDetail= ()=>{

    if(changeDetail){onsubmit()}
     const detail= changeDetail;
    setChangeDetail(!detail);


  }
  
  const handleChange= (e)=>{
      setFormData(
      (prev)=>({
        ...prev,
        [e.target.id]:e.target.value
      })
      )
  }

  

  return ( <>
        <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
          <h1 className='text-3xl text-center mt-6 font-bold '>My Profile</h1>
          <div className='w-full md:w-[50%] mt-6 px-3'>
            <form>
             {/* Name input */}
              <input  type='text' value={name} id='name'  disabled={!changeDetail} onChange={handleChange} className={`w-full px-4 py-2 mb-6  text-xl text-gray-700 bg-white border border-gray-300 rounded-md transition ease-in-out ${changeDetail && 'bg-red-200 focus:bg-red-300'  }`}/>
             
             {/* email input */}
             <input  type='email' value={email} id='email'  disabled className='w-full px-4 py-2 mb-6 text-xl text-gray-700 bg-white border border-gray-300 rounded-md transition ease-in-out'/>
             
             <div className='flex justify-between  whitespace-nowrap text-sm sm:text-lg mb-6'>
                
              <p className='flex items-center'>Do you want to change your name?  
                   
                    <span onClick={toggleDetail} className='text-red-600 hover:text-red-800 transition ease-in-out duration-200 ml-1 cursor-pointer'> 
                    {changeDetail ? "Apply Changes":"Edit"}
                    </span>
              </p>
              <p onClick={onLogOut} className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer'>
                  Sign Out
              </p>
             </div>

            </form>

            <button type='submit' className=' w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800 '>
            <Link to="/create-listing" className='flex justify-center items-center '>
             <FcHome className='mr-2 text-3xl bg-red-200 rounded-full p-1 border-2'/>
             Sell or rent your home
             </Link>
            </button>

          </div>
        </section>

  </>)
}

export default Profile