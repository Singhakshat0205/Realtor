import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { db } from '../firebase';
import { collection, getDocs, limit, orderBy, query, where, startAfter } from 'firebase/firestore';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

const Category = () => {

    const params= useParams();
    const [listings, setListings]= useState(null);
    const [lastFetchedListing, setLastFetchedListing]= useState(null)
    const [loading, setLoading]=useState(true) 

    useEffect(()=>{
      const getListings=async ()=>{
       try{
        const listingRef= collection(db, "listings");
        const q= query(listingRef,
            where("type", "==", params.categoryName),
            orderBy("timestamp", "desc"),
            limit(8)
        )
        const listing=[];
        const querySnap= await getDocs(q);

        setLastFetchedListing(querySnap.docs[querySnap.docs.length-1]);
        
        querySnap.forEach((doc)=>{
            return listing.push({
                id:doc.id,
                data:doc.data()
            })
        })

        setListings(listing);
        setLoading(false)

    }
    catch(error){
        toast.error("something went wrong");
    }

    }

      getListings();
      

    },[params.categoryName]);

    async function onFetchMoreListings() {
        try {
          const listingRef = collection(db, "listings");
          const q = query(
            listingRef,
            where("type", "==", params.categoryName),
            orderBy("timestamp", "desc"),
            startAfter(lastFetchedListing),
            limit(4)
          );
          const querySnap = await getDocs(q);
          const lastVisible = querySnap.docs[querySnap.docs.length - 1];
          setLastFetchedListing(lastVisible);
          const listings = [];
          querySnap.forEach((doc) => {
            return listings.push({
              id: doc.id,
              data: doc.data(),
            });
          });
          if(querySnap.docs.length ===0 ){
            setLoading(false);
            toast.error(`No more ${params.categoryName} listings available`);
            return;
          }
          setListings((prevState) => [...prevState, ...listings]);
          setLoading(false);
        } catch (error) {
          toast.error("Could not fetch listing");
        }
      }

      return (
        <div className="max-w-6xl mx-auto px-3">
          <h1 className="text-3xl text-center mt-6 font-bold mb-6">
            {params.categoryName === "rent" ? "Places for rent" : "Places for sale"}
          </h1>
          {loading ? (
            <Spinner />
          ) : listings && listings.length > 0 ? (
            <>
              <main>
                <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {listings.map((listing) => (
                    <ListingItem
                      key={listing.id}
                      id={listing.id}
                      listing={listing.data}
                    />
                  ))}
                </ul>
              </main>
              {lastFetchedListing && (
                <div className="flex justify-center items-center">
                  <button
                    onClick={onFetchMoreListings}
                    className="bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out"
                  >
                    Load more
                  </button>
                </div>
              )}
            </>
          ) : (
            <p>
              There are no current{" "}
              {params.categoryName === "rent"
                ? "places for rent"
                : "places for sale"}
            </p>
          )}
        </div>
      );
    }


export default Category