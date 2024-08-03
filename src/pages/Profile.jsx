import { getAuth, updateProfile } from 'firebase/auth'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { FcHome } from "react-icons/fc";
import { FaTrash } from "react-icons/fa";
import ListingItem from '../components/ListingItem';
import { Link } from 'react-router-dom';


const Profile = () => {


  const auth= getAuth();
   const navigate= useNavigate();
   const [listings, setListings]= useState(null);
   const [loading, setLoading]= useState(true);
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

  useEffect(()=>{
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }

     fetchUserListings();
  },[auth.currentUser.uid]);
   

 const onDelete = async(listingID)=>{
   

  if(window.confirm("Are you sure you want to delete?")){
    await deleteDoc(doc(db, "listings", listingID))
    const updatedListings= listings.filter(
      (listItem)=>listItem.id!==listingID)

    setListings(updatedListings);
    toast.success("Listing Successfully Deleted")
  }

   
 }

 const onEdit= async(listingID)=>{
    navigate(`/edit-listing/${listingID}`)
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

        <div className='max-w-6xl px-3 mt-6 mx-auto'>
          {!loading  && (
            <>
              <h2 className='text-2xl text-center font-semibold '>My Listings</h2>

              <ul className="sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                 {listings.map((listing)=>
                  <ListingItem 
                  key={listing.id} 
                   id= {listing.id}
                   listing={listing.data}
                   onDelete={()=>{onDelete(listing.id)}}
                   onEdit={()=>{onEdit(listing.id)}}
                  />
                 )}
              </ul>
            </>
          )}
        </div> 

  </>)
}

export default Profile