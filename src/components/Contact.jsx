import { doc, getDoc } from 'firebase/firestore';
import React, { useState, useRef, useEffect } from 'react'
import { toast } from 'react-toastify';
import { db } from '../firebase';



const Contact = ({userRef, listing}) => {
    
 
    const [landLord, setLandlord]= useState(null);
    const message= useRef("");
   
   
    useEffect(()=>{
        const getLandlord= async()=>{
          try {

            const docRef= doc(db,"users",userRef);
            const docSnap= await getDoc(docRef);

            if(docSnap.exists){
                setLandlord(docSnap.data());
            }
            
          } catch (error) {
            toast.error("Cannot find details");
          }
        }

        getLandlord();
    },[userRef]);

 

  return (
         <>
            {
                landLord!==null && (
                    
                    <div>
                        <p className='text-lg mt-3 text-gray-600'>contact {landLord.name} regarding this listing</p>
                        <div>
                            <textarea
                            ref={message}
                            rows={2}
                            className='w-full px-4 mt-2 py-2 text-xl text-gray-600 bg-white border border-bray-300 rounded-md transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600'
                            >

                            </textarea>

                          <a
                                href={`mailto:${listing.email}?Subject=${(listing.name)}&body=${(message)}`}
                                >
                                <button className="px-7 py-3 bg-blue-600 text-white rounded text-sm uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full text-center mb-6" type="button">
                                Send Message
                                </button>
                            </a>
                        </div>
                    </div>
                )
            }
         </>  
    

  )
}

export default Contact