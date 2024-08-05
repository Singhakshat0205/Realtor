import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { MdLocationOn } from "react-icons/md";
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { Navigation, Autoplay ,Pagination} from 'swiper/modules';
import { FaBed } from "react-icons/fa";
import { FaBath } from "react-icons/fa";
import { FaParking } from "react-icons/fa";
import { FaChair } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import 'swiper/css/navigation';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FaShare } from "react-icons/fa";
import { getAuth } from 'firebase/auth';
import Contact from '../components/Contact';


const Listing = () => {

    
     const auth= getAuth();
     
    const [listing, setListing]= useState(null);
    const [loading, setLoading]= useState(true);
     const [shareLink, setShareLink]= useState(false);
     const [landlordDetails, setLandlordDetails ]= useState(null);
     const [contactLandlord, setContactLandlord]= useState(false);

    const params= useParams();

   
   
    useEffect(()=>{
        async function fetchListing(){
          
            const docRef= doc(db, "listings", params.listingId);
            const docSnap= await getDoc(docRef);
            if(docSnap.exists){
                setListing(docSnap.data());            
                setLoading(false);   
            }
            else{
                setLoading(false);
                toast.error("Cannot fetch listing");
            }
        }
        fetchListing(); 
       
     
    },[params.listingId]);

    

    if(loading){
        return <Spinner/>
    }
     


    const {address, bathrooms, bedrooms, description,name, parking, furbished, regularPrice, type ,offer, discountedPrice, userRef}= listing;

    // listing.email= auth.currentUser.email;
   
  
   


  return (
     <main >
    
  
        <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
      >
        {listing.imgUrls.map((url, index) => (
            
          <SwiperSlide key={index}>
         
           <div
            // style={{ background: `url(${imageUrl})  center, no-repeat`, backgroundSize: "cover", }} 

         className="relative w-full h-[430px] overflow-hidden" >
   
         <img role="presentation"
           src={url} loading="lazy" 
         className="object-fit w-full h-full " alt="property-image" />
             
         </div> 
          </SwiperSlide>
        ))}
      </Swiper>
      <div className='fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-1 border-gray-400 rounded-full w-12 h-12 
      shadow-lg shadow-gray-300 flex justify-center items-center' onClick={()=>{
      navigator.clipboard.writeText(window.location.href)
      setShareLink(true);
      setTimeout(()=>setShareLink(false), 2000);
      }
      }>
      <FaShare/>
      </div>
      {
        shareLink && (
            <p className='fixed top-[23%] right-[5%] font-semibold border-1 border-gray-400 rounded-lg bg-white z-10 p-2'>
                Link Copied
            </p>
        )
      }


     <div className='m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5 '>
      <div className='w-full'>
           <p className='text-2xl mb-3 font-bold text-blue-950'>{name}- Rs.{" "}  
           {!offer ? 
            regularPrice
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ","):
            
            discountedPrice
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
             }

             {type==='rent'? " / Month":""} 
           </p>
           <p className='flex items-center mt-6 mb-3 font-semibold text-lg'>   
           <MdLocationOn className='text-green-700 '

           />
            {address}
            </p>
            <button className='cursor-default bg-red-700 text-white py-1 px-20 text-md rounded-lg'>
               For {type==="rent"? "Rent":"Sale"}
            </button>

            <p className="mt-3 mb-3">
            <span className="font-semibold">Description - </span>
            {listing.description}
          </p>
            <ul className="flex items-center space-x-2 sm:space-x-10 text-sm font-semibold mb-6">
            <li className="flex items-center whitespace-nowrap">
              <FaBed className="text-lg mr-1" />
              {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaBath className="text-lg mr-1" />
              {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaParking className="text-lg mr-1" />
              {listing.parking ? "Parking spot" : "No parking"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaChair className="text-lg mr-1" />
              {listing.furnished ? "Furnished" : "Not furnished"}
            </li>
          </ul>

            {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
            <div className="mt-6">
              <button
                onClick={() => setContactLandlord(true)}
                className="px-7 py-2 bg-blue-600 text-white font-medium text-md uppercase rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg w-full text-center transition duration-150 ease-in-out "
              >
                Contact Landlord
              </button>
            </div>
          )}

          {
            contactLandlord && (
              <Contact listing={listing} userRef={listing.userRef}/>
            )
          }

      </div>
      <div className="w-full h-[200px] md:h-[400px] z-10 overflow-x-hidden mt-6 md:mt-0 md:ml-2">
      <MapContainer
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>
                {listing.address}
              </Popup>
            </Marker>
          </MapContainer>
      </div>

     
       

     </div>
   


     </main>
  )
}

export default Listing