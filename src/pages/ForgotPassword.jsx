import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { toast } from 'react-toastify';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = () => {
      
 

    const [email, setEmail]= useState("");
   
    const onInputChange=(e)=>{
      setEmail(e.target.value);
    }

   const onSubmit= async(e)=>{

    e.preventDefault();
    try {
        
      const auth= getAuth();
      const response= await sendPasswordResetEmail(auth, email);
      toast.success('E-mail sent successfully');

        
    } catch (error) {

      toast.error("Could not send reset password");
      
    }
   }


  return (
    <section>
        <h1 className='text-3xl text-center py-6 font-bold'>Forgot Password</h1>

        <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto '>
            <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
                <img  src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357" alt="sign-in-photo" className='w-full rounded-2xl'/>
            </div>
            <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
                <form onSubmit={onSubmit}>
                    <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white mb-8 border-gray-300 rounded-md transition ease-in-out' 
                    id="email"
                    type='email'  
                    placeholder='E-mail address' 
                    value={email}
                     
                    onChange={onInputChange} />

                    <div className='flex justify-between py-4 whitespace-nowrap text-sm sm:text-lg mb-6 '>
                        <p >Don't have an account? 
                           <Link to="/sign-up" className='text-red-500 ml-1 hover:text-red-700 transition duration-200 ease-in-out'> 
                           Register</Link>
                         </p>
                         <p>
                          <Link to='/sign-in' className='text-blue-500 hover:text-blue-700'>Sign In instead</Link>
                         </p>
                    
                    </div>

                    <button type='submit' className='w-full bg-blue-500 text-white px-7 py-3 text-sm font-medium uppercase rounded-md hover:bg-blue-700 transition  duration-150 ease-in-out active:bg-blue-800'>Send Reset Password
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

export default ForgotPassword