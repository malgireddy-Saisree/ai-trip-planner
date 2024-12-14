import { db } from '@/service/firebaseConfig';
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'react-router-dom';
import { collection, query, where, getDocs } from "firebase/firestore";
import UserTripCard from './components/UserTripCard';

function MyTrips() {
    const navigation=useNavigation();
    const [userTrips,setUserTrips] = useState([]);
    useEffect(() =>{
        GetUserTrips();
    },[])
    const GetUserTrips=async()=>{
        const user=JSON.parse(localStorage.getItem('user'));
        if(!user){
            navigation('/');
            return ;
        }
        setUserTrips([]); // Clear trips before fetching
        console.log("Fetching user trips for:", user.email); // Log the user's email

        const q=query(collection(db,'AITrips'),where('UserEmail','==',user?.email))
        
        try {
            const querySnapshot = await getDocs(q);
            console.log("Query executed successfully. Number of trips found:", querySnapshot.size); // Log number of trips found

            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data()); // Log each trip data
                setUserTrips(prev=>[...prev,doc.data()])
            });
        } catch (error) {
            console.error("Error fetching user trips:", error); // Log any errors
        }
    }
   
  return (
    <div className='px-5 mt-12 sm:px-10 md:px-32 lg:px-56 xl:px-72"'>
      <h2 className='font-bold text-3xl mb-10'>My Trips</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-5 my-3'>
        {userTrips?.length>0 ? userTrips.map((trip,index)=>(
            <UserTripCard trip={trip} key={index} />
        ))
        : [1,2,3,4,5,6].map((item,index)=>(
            <div key={index} className='h-[200px] w-full bg-slate-200 animate-pulse rounded-xl'>
            </div>
        ))
        }
      </div>
    </div>
  )
}

export default MyTrips
