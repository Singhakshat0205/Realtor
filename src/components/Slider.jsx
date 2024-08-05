import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper/modules";
import { loading } from "react";
import "swiper/css/bundle";
import { useNavigate } from "react-router-dom";
export default function Slider() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchListings() {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
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
    fetchListings();
  }, []);
  if (loading) {
    return <Spinner />;
  }
  if (listings.length === 0) {
    return <></>;
  }
  return (
    listings && (
      <>
       <Swiper 
       
       spaceBetween={30}
        centeredSlides={true} 
        slidesPerView={1}
        autoplay={{ delay: 2500, disableOnInteraction: false, }} 
        pagination={{ clickable: true, }} 
        navigation={true}
         modules={[Autoplay, Pagination, Navigation]} >


        {listings.map(({ data, id }) => {

         const imageUrl = data.imgUrls && data.imgUrls[0] ? data.imgUrls[0] : <Spinner/>; return ( 
          
          <SwiperSlide  key={id} onClick={() => navigate(`/category/${data.type}/${id}`)} >
          <source  srcSet={listings.imgUrls}/>
           <div
            // style={{ background: `url(${imageUrl})  center, no-repeat`, backgroundSize: "cover", }} 

         className="relative w-full h-[430px] overflow-hidden" >
   
         <img role="presentation"
           src={imageUrl} loading="lazy" 
         className="object-fit w-full h-full " alt="property-image" />
             
         </div> 
         <p className="text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] shadow-lg opacity-90 p-2 rounded-br-3xl"> {data.name} </p> 
         <p className="text-[#f1faee] absolute left-1 bottom-1 font-semibold max-w-[90%] bg-[#e63946] shadow-lg opacity-90 p-2 rounded-tr-3xl"> Rs. {data.discountedPrice ?? data.regularPrice} {data.type === "rent" && " / month"} </p> </SwiperSlide> ); })} </Swiper>
      </>
    )
  );
}