import React, { useEffect, useState } from 'react'
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getAuth, prodErrorMap } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection, getDoc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate, useParams } from 'react-router';
import { doc } from 'firebase/firestore';


const EditListing = () => {

  const navigate= useNavigate();


 
  const auth= getAuth();
  
  const [listing, setListing]= useState(null);
  const [geolocationEnabled , setGeolocationEnabled ]= useState(true);
  const [loading, setLoading]= useState(false);

    const [formData, setFormData]= useState({
        type:'rent',
        name:"",
        bedrooms:1,
        bathrooms:2,
        parking:false,
        furnished:false,
        address:'',
        description:"",
        offer: true,
        regularPrice:0,
        discountedPrice:0,
        latitude:0,
        longitude:0,
        images:{}
    })
  
    const {type, 
        name, 
        bedrooms, 
        bathrooms, 
        parking, 
        furnished, 
        address,
        description,
        offer,
        regularPrice,
        discountedPrice,
        latitude,
        longitude,
        images

    }= formData

    const params= useParams();


    useEffect(()=>{
        if(listing && listing.userRef !== auth.currentUser.uid){
            toast.error("Unauthorized Access");
            navigate("/");
        }
    },[auth.currentUser.uid, navigate, listing])

    useEffect(()=>{
    setLoading(true);
    const fetchListing=async ()=>{
        const docRef= doc(db, "listings", params.listingId )
        const docSnap= await getDoc(docRef);
    
        console.log(docSnap);
        
        if(docSnap.exists && docSnap._document!==null){
            setListing(docSnap.data());
            setFormData({...docSnap.data()});
            setLoading(false);
        }
        else{
            setLoading(false);
            navigate("/")
            toast.error("Listing not found");

        }
    }

    fetchListing();

    },[navigate, params.listingId]);

 

    const onChange= (e)=>{
        
      let boolean= null;
      if(e.target.value ==="true"){
        boolean=true;
      }
      if(e.target.value==="false"){
        boolean =false;
      }

      if(e.target.files){
        setFormData((prevState)=>({
          ...prevState, images:e.target.files
        })
      )
      }

      if(!e.target.files){
        setFormData((prevState)=>({
          ...prevState,
          [e.target.id]:boolean ?? e.target.value
        }))
      }                                                          
    }



    const onSubmit=async (e)=>{
        
      e.preventDefault();
      setLoading(true);
      if (+discountedPrice >= +regularPrice) {
        setLoading(false);
        toast.error("Discounted price needs to be less than regular price");
        return;
      }

      if (images.length > 6) {
        setLoading(false);
        toast.error("maximum 6 images are allowed");
        return;
      }
      
      let geolocation= {

      };
       let location
          
      


      if(geolocationEnabled){
     
         const headers={
          'x-rapidapi-key':'371f007674mshfd67def6547b250p18f574jsn8c2bcf91e9c5',
          'x-rapidapi-host':'trueway-geocoding.p.rapidapi.com',

        }

        const url = `https://trueway-geocoding.p.rapidapi.com/Geocode?address=${address}&language=en`;
          try{
          const response= await axios.get(url,{headers:headers});

          geolocation.lat= response?.data?.results[0]?.location?.lat ?? 0;
          geolocation.lng= response?.data?.results[0]?.location?.lng ?? 0;
          }
          catch(error){
            setLoading(false);
            toast.error("Enter a valid address");
            return;
          }
      
  
      }else{
             geolocation.lat= latitude;
             geolocation.lng= longitude;
      }


        const storeImage=async(image)=>{
        return new Promise((resolve, reject)=>{
          const storage= getStorage()
          const filename= `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
          const storageRef= ref(storage, filename);
          const uploadTask= uploadBytesResumable(storageRef, image);

              // Register three observers:
              // 1. 'state_changed' observer, called any time the state changes
              // 2. Error observer, called on failure
              // 3. Completion observer, called on successful completion
              uploadTask.on('state_changed', 
                (snapshot) => {
                  // Observe state change events such as progress, pause, and resume
                  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log('Upload is ' + progress + '% done');
                  switch (snapshot.state) {
                    case 'paused':
                      console.log('Upload is paused');
                      break;
                    case 'running':
                      console.log('Upload is running');
                      break;

                      default:
                        console.log("upload starts shortly");
                  }
                }, 
                (error) => {
                  // Handle unsuccessful uploads
                  reject(error);
                }, 
                () => {
                  // Handle successful uploads on complete
                  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  resolve(downloadURL);
                  });
                }
              );
                      })


      } 
       
      const imgUrls= await Promise.all(
        [...images]
        .map((image)=> storeImage(image)))
        .catch((error)=>{
          setLoading(false);
          toast.error("Images not uploaded")
          return;
        })
      

      const formDataCopy= {
        ...formData,
        imgUrls,
        geolocation,
        timestamp:serverTimestamp(),
        userRef: auth.currentUser.uid,
      };

      delete formDataCopy.images;
      !formDataCopy.offer && delete formDataCopy.discountedPrice;
      delete formDataCopy.latitude;
      delete formDataCopy.longitude;

      
      const docRef= doc(db , "listings", params.listingId);
      await updateDoc(docRef, formDataCopy);
      setLoading(false);
      toast.success("Listing Updated");
      navigate(`/category/${formDataCopy.type}/${docRef.id}`)
        
    }


    if(loading){
      return <Spinner/>
    }

  return (
   <main className="max-w-md px-2 mx-auto">
    <h1 className='text-3xl text-center mt-6 font-bold '>
        Update Listing
    </h1>
    
    <form onSubmit={onSubmit}>
        <p className=' text-lg mt-6 font-semibold'>Sell / Rent</p>
        <div className='flex '>
            <button type="button"  
            id='type' 
            value="sale" 
            onClick={onChange} 
            className={`mr-3 px-7  py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full
             ${
              type === "rent"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}>
              sell 
             </button>
             <button
            type="button"
            id="type"
            value="rent"
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              type === "sale"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
          >
            rent
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Name</p>
        <input type='text' id='name' value={name}  onChange={onChange} placeholder='Property Name'  maxLength="32"
          minLength="10"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"/>
        
        <div className="flex space-x-6 mb-6">
          <div>
            <p className="text-lg font-semibold">Beds</p>
            <input
              type="number"
              id="bedrooms"
              value={bedrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
            />
          </div>
          <div>
            <p className="text-lg font-semibold">Baths</p>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
            />
          </div>
        </div>

        <p className="text-lg mt-6 font-semibold">Parking spot</p>
        <div className="flex">
          <button
            type="button"
            id="parking"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !parking ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="parking"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              parking ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            no
          </button>
        </div>


        <p className="text-lg mt-6 font-semibold">Furnished</p>
        <div className="flex">
          <button
            type="button"
            id="furnished"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !furnished ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            yes
          </button>
          <button
            type="button"
            id="furnished"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              furnished ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            no
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Address</p>
        <textarea
          type="text"
          id="address"
          value={address}
          onChange={onChange}
          placeholder="Address"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        {!geolocationEnabled && (
          <div className='flex space-x-6 mb-6'>
            <div className='text-lg'>
              <p className='text-lg font-semibold '>Latitude</p>
              <input type='number'  
                value={latitude}
                id='latitude'
                onChange={onChange}
                required
                min="-90"
                max="90"
                className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center'
              /> 
            </div>
            <div className='text-lg'>
              <p className='text-lg font-semibold '>Longitude</p>
              <input type='number'  
                value={longitude}
                id='longitude'
                onChange={onChange}
                required
                min="-180"
                max="180"
                className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center'
              /> 
            </div>

          </div>
        )}


     <p className="text-lg font-semibold">Description</p>
        <textarea
          type="text"
          id="description"
          value={description}
          onChange={onChange}
          placeholder="Description"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

<p className="text-lg  font-semibold">Offer</p>
        <div className="flex">
          <button
            type="button"
            id="offer"
            value={true}
            onClick={onChange}
            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            yes
          </button>
          <button
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
            className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            no
          </button>
        </div>
         

         <div className='flex space-x-5 mt-9 mb-6'>
         <div className=''>
            <p className='text-lg font-semibold'>Regular Price</p>
            <div className=''>
              <input  
              required 
              type='number'
               id='regularPrice' 
               value={regularPrice}
                onChange={onChange}
                min={50}
                className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
               />
             

            </div>
          
         </div> 
         {type === 'rent' && (
                <div className='mt-9 '>
                <p className='text-xl w-full whitespace-nowrap '>Rs. / Month</p>
                </div>
               ) }
         </div>
        
        {offer && (
          <div className='flex space-x-5 mt-9 mb-6'>
         <div className=''>
            <p className='text-lg font-semibold'>Discounted Price</p>
            <div className=''>
              <input  
              required ={offer}
              type='number'
               id='discountedPrice' 
               value={discountedPrice}
                onChange={onChange}
                min={50}
                className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center'
               />
             

            </div>
          
         </div> 
         {type === 'rent' && (
                <div className='mt-9 '>
                <p className='text-xl w-full whitespace-nowrap '>Rs. / Month</p>
                </div>
               ) }
         </div>
        )}
          
        <div className='mb-6'>
          <p className='text-lg font-semibold '>Images</p>
          <p className='text-gray-600'>The first image will be the cover (max 6)</p>
          <input 
          type='file' 
          id="images" 
          onChange={onChange} 
          accept='.jpg,.png, .jpeg'
          required
          multiple
          className='w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:border-slate-600 ' />
        </div>

        <button type='submit' className='w-full mb-6 px-7 py-3 bg-blue-600 text-white font-medium text-sm  uppercase rounded shadow -md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'>
         Update Listing
        </button>

    </form>


   </main>
   
  )
}

export default EditListing