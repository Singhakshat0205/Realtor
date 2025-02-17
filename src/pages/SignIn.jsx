import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
     
   const [showPassword, setShowPassword]= useState(true);

    const [formData, setFormData]= useState({
        email: "",
        password:""
    });
    
    const navigate= useNavigate();

    const {email, password}= formData;
   
    const onInputChange=(e)=>{
       setFormData({...formData,
        [e.target.id] :e.target.value
        });
    }

    const handleSubmit=async (e)=>{
           e.preventDefault();
        try {
            const auth= getAuth();
            const userCredentials= await signInWithEmailAndPassword(auth, email, password);

            if(userCredentials.user){
                navigate('/');
                toast.success('signed-in successfully');
            }

        } catch (error) {
          toast.error('Wrong Credentials');
        }

    }

  return (
    <section>
        <h1 className='text-3xl text-center py-6 font-bold'>Sign In</h1>

        <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto '>
            <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
                <img  src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357" alt="sign-in-photo" className='w-full rounded-2xl'/>
            </div>
            <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
                <form onSubmit={handleSubmit}>
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
                        <p >Don't have an account? 
                           <Link to="/sign-up" className='text-red-500 ml-1 hover:text-red-700 transition duration-200 ease-in-out'> 
                           Register</Link>
                         </p>
                         <p>
                          <Link to='/forgot-password' className='text-blue-500 hover:text-blue-700'>Forgot-Password</Link>
                         </p>
                    
                    </div>

                    <button type='submit' className='w-full bg-blue-500 text-white px-7 py-3 text-sm font-medium uppercase rounded-md hover:bg-blue-700 transition  duration-150 ease-in-out active:bg-blue-800'>Sign in
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

export default SignIn