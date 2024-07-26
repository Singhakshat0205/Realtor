import React from 'react'
import { FcGoogle } from 'react-icons/fc';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { db } from '../firebase'
import { setDoc,doc, getDoc, serverTimestamp } from 'firebase/firestore'



const OAuth = () => {

const navigate= useNavigate();

  const onGoogleClick=async ()=>{
          try {
            const auth= getAuth();
            const provider= new GoogleAuthProvider();
            
            const result= await signInWithPopup(auth, provider);
            const user= result.user;
            console.log(user);
          
            const docRef= doc(db, "users", user.uid);

            const docSnap= await getDoc(docRef);
            if(!docSnap.exists()){
              await setDoc(docRef, {
                name:user.displayName, 
                email:user.email,
                timeStamp: serverTimestamp()
              })
            }
           
            toast.success("sign in successful");
            navigate('/');
          } catch (error) {
            
            toast.error('Could not authorize with google');

          }
  };
  return (
    <button type='button' onClick={onGoogleClick} className='flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-800
    active:bg-red-900 shadow-md hover:shadow-lg active:shadow-lg transition duration-150 ease-in-out rounded-md'>
     <FcGoogle className='text-2xl bg-white rounded-full mr-2'/>
     Continue with Google
    </button>
  )
}

export default OAuth;