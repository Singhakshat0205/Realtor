import React, { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query, where, limit } from 'firebase/firestore';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, FreeMode } from 'swiper/modules';
import "swiper/css/bundle";
import 'swiper/css/navigation';
import 'leaflet/dist/leaflet.css';
import Slider from '../components/Slider';
import ListingItem from '../components/ListingItem';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [offerListing, setOfferListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);

  useEffect(() => {
    async function fetchListings() {
      try {
        // Fetch offers
        const offersQuery = query(
          collection(db, "listings"),
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(8)
     
        );
        const offersSnap = await getDocs(offersQuery);
        const offers = offersSnap.docs.map(doc => ({
          id: doc.id,
          data: doc.data(),
        }));

        // Fetch rent listings
        const rentQuery = query(
          collection(db, "listings"),
          where("type", "==", "rent"),
          orderBy("timestamp", "desc"),
         limit(8)
        );
        const rentSnap = await getDocs(rentQuery);
        const rents = rentSnap.docs.map(doc => ({
          id: doc.id,
          data: doc.data(),
        }));

        // Fetch sale listings
        const saleQuery = query(
          collection(db, "listings"),
          where("type", "==", "sale"),
          orderBy("timestamp", "desc"),
          limit(8)
        );
        const saleSnap = await getDocs(saleQuery);
        const sales = saleSnap.docs.map(doc => ({
          id: doc.id,
          data: doc.data(),
        }));

        // Update state
        setOfferListing(offers);
        setRentListing(rents);
        setSaleListing(sales);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false); // Ensure loading state is turned off in case of error
      }
    }

    fetchListings();
  }, []); // Empty dependency array ensures this runs only once on mount

  if (loading) {
    return <Spinner />;
  }

  return (
    <main >
      <Slider />

      {offerListing.length > 0 && (
        <div className="mx-10 mb-6">
          <h2 className="px-3 text-2xl mt-6 font-semibold">Recent offers</h2>
          <Link to="/offers">
            <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
              More offers
            </p>
          </Link>
          {/* <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
            {offerListing.map((listing) => (
              <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
            ))}
          </ul> */}

          <Swiper
          slidesPerView={4}
          spaceBetween={30}
          freeMode={true}
          
          pagination={{ clickable: true }}
          modules={[FreeMode, Pagination]}
          breakpoints={{
              // when window width is >= 320px
              320: {
                slidesPerView: 1,
                spaceBetween: 10
              },
              // when window width is >= 480px
              480: {
                slidesPerView: 2,
                spaceBetween: 20
              },
              // when window width is >= 768px
              768: {
                slidesPerView: 3,
                spaceBetween: 30
              },
              // when window width is >= 1024px
              1024: {
                slidesPerView: 4,
                spaceBetween: 30
              }
            }}

        >
          {offerListing.map((item) => (
            <SwiperSlide className='py-7' key={item.id}>
              <ListingItem listing={item.data} id={item.id} />
            </SwiperSlide>
          ))}
        </Swiper>
        </div>
      )}


      {rentListing.length > 0 && (
        <div className="mx-10 mb-6">
          <h2 className="px-3 text-2xl mt-6 font-semibold">Places for rent</h2>
          <Link to="/category/rent">
            <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
              Show more places for rent
            </p>
          </Link>
          <Swiper
          slidesPerView={4}
          spaceBetween={30}
          freeMode={true}
          pagination={{ clickable: true }}
          modules={[FreeMode, Pagination]}
          breakpoints={{
              // when window width is >= 320px
              320: {
                slidesPerView: 1,
                spaceBetween: 10
              },
              // when window width is >= 480px
              480: {
                slidesPerView: 2,
                spaceBetween: 20
              },
              // when window width is >= 768px
              768: {
                slidesPerView: 3,
                spaceBetween: 30
              },
              // when window width is >= 1024px
              1024: {
                slidesPerView: 4,
                spaceBetween: 30
              }
            }}
        >
          {rentListing.map((item) => (
            <SwiperSlide className='py-7' key={item.id}>
              <ListingItem listing={item.data} id={item.id} />
            </SwiperSlide>
          ))}
        </Swiper>
        </div>
      )}



      {saleListing.length > 0 && (
        <div className="mx-10 mb-6">
          <h2 className="px-3 text-2xl mt-6 font-semibold">Places for sale</h2>
          <Link to="/category/sale">
            <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
              Show more places for sale
            </p>
          </Link>
           <Swiper
          slidesPerView={4}
          spaceBetween={30}
          freeMode={true}
          pagination={{ clickable: true }}
          modules={[FreeMode, Pagination]}
          breakpoints={{
              // when window width is >= 320px
              320: {
                slidesPerView: 1,
                spaceBetween: 10
              },
              // when window width is >= 480px
              480: {
                slidesPerView: 2,
                spaceBetween: 20
              },
              // when window width is >= 768px
              768: {
                slidesPerView: 3,
                spaceBetween: 30
              },
              // when window width is >= 1024px
              1024: {
                slidesPerView: 4,
                spaceBetween: 30
              }
            }}
        >
          {saleListing.map((item) => (
            <SwiperSlide className='py-7' key={item.id}>
              <ListingItem listing={item.data} id={item.id} />
            </SwiperSlide>
          ))}
         
        </Swiper>
        </div>
      )}
    </main>
  );
}

export default Home;
