import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { EffectFade ,Navigation, Autoplay} from 'swiper/modules';
import { Swiper, SwiperSlide } from "swiper/react";

import SwiperCore from "swiper";
import "swiper/css/bundle";

import 'swiper/css/navigation';

const Listing = () => {

    

    const [listing, setListing]= useState(null);
    const [loading, setLoading]= useState(true);

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
  return (
     <main>
            <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[Navigation, EffectFade, Autoplay]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
            
          <SwiperSlide key={index}>
            <div
              className="relative w-auto h-[500px] "
              style={{
                background: `url(${url}) center no-repeat`,
                backgroundSize: "cover",
                objectFit: "contain",
                display:'block'
              }} 
            >
              
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

     <div>
        hi three
     </div>
     </main>
  )
}

export default Listing