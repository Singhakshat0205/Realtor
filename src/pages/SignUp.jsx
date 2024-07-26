import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc , serverTimestamp} from "firebase/firestore"; 
import { db } from '../firebase';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SignUp = () => {
     
   const [showPassword, setShowPassword]= useState(false);

    const [formData, setFormData]= useState({
        name:"",
        email: "",
        password:""
    });

    const navigate= useNavigate();
   
    const onInputChange=(e)=>{
       setFormData({...formData,
        [e.target.id] :e.target.value
        });
    }
    
    const {name,email, password}= formData;
    const onSubmit= async(e)=>{
       e.preventDefault();
         try {
          
             
            const auth= getAuth();
            const userCredentials= await createUserWithEmailAndPassword(auth, email,password);
            
            updateProfile(auth.currentUser, {
                displayName:name
            })

            const user= userCredentials.user;
            const formDataCopy= {...formData};
            delete formDataCopy.password;
            formDataCopy.timestamp= serverTimestamp()

           
           await setDoc(doc(db,"users", user.uid), formDataCopy);
             toast.success('Registered Successfully');
             navigate("/")
         } catch (error) {
            console.log(error);
            const errorMsg= error.message.split('auth/')[1].replace(/[().]/g, '');
            toast.error(errorMsg);
         }
    }
    

  return (
    <section>
        <h1 className='text-3xl text-center py-6 font-bold'>Sign Up</h1>

        <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto '>
            <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
                <img  src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357" alt="sign-in-photo" className='w-full rounded-2xl'/>
            </div>
            <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
                <form onSubmit={onSubmit}>
                <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white mb-8 border-gray-300 rounded-md transition ease-in-out' 
                    id="name"
                    type='text'  
                    placeholder='Full Name' 
                    value={formData.name}
                     
                    onChange={onInputChange} />
                    <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white mb-8 border-gray-300 rounded-md transition ease-in-out' 
                    id="email"
                    type='email'  
                    placeholder='E-mail address' 
                    value={formData.email}
                     
                    onChange={onInputChange} />
                    <div className='relative '>
                    <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300  rounded-md transition ease-in-out' 
                    id="password"
                    type={showPassword ? 'text':'password'}  
                    placeholder='Password' 
                    value={formData.password}
                     
                    onChange={onInputChange} />
                    {showPassword ? <FaEyeSlash className='absolute right-3 top-3 text-xl cursor-pointer' onClick={()=>setShowPassword(false)} />:<FaEye className='absolute right-3 top-3 text-xl cursor-pointer' onClick={()=>setShowPassword(true)}/>}
                    </div>
                    <div className='flex justify-between py-4 whitespace-nowrap text-sm sm:text-lg mb-6 '>
                        <p >Have an account? 
                           <Link to="/sign-in" className='text-red-500 ml-1 hover:text-red-700 transition duration-200 ease-in-out'> 
                           Sign In</Link>
                         </p>
                         <p>
                          <Link to='/forgot-password' className='text-blue-500 hover:text-blue-700'>Forgot-Password</Link>
                         </p>
                    
                    </div>

                    <button type='submit' className='w-full bg-blue-500 text-white px-7 py-3 text-sm font-medium uppercase rounded-md hover:bg-blue-700 transition  duration-150 ease-in-out active:bg-blue-800'>Sign Up
                </button>
                <div className='my-4 before:border-t flex before:flex-1 items-center before:border-gray-400
                after:border-t  after:flex-1 after:border-gray-4>>>00'>
                    <p className='text-center font-semibold mx-4 '> OR</p>
                </div>
                 <OAuth/>
                </form>

              
            </div>
        </div>
    </section>
  )
}

export default SignUp