import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'

function InfoSection({trip}) {
  const [photoUrl,setPhotoUrl] = useState(null);

  useEffect(()=>{
    const GetPlaceImg = async () => {
      if (trip && trip.userSelection) {
        const data = {
          textQuery: trip.userSelection.location || '',
        };

        try {
          console.log("Request Data:", data);
          const result = await GetPlaceDetails(data);
          console.log("API Response:", result);

          if (result?.data?.places?.length && result.data.places[0]?.photos?.length > 3) {
            const photoName = result.data.places[0].photos[3].name;
            const photoUrl = PHOTO_REF_URL.replace('{NAME}', photoName);
            setPhotoUrl(photoUrl);
          } else {
            console.error("No valid photos found for the location.");
          }
        } catch (error) {
          console.error("Error fetching place details:", error.response ? error.response.data : error.message);
        }
      }
    };

    GetPlaceImg();
  },[trip])

  console.log("Full Trip Details:", JSON.stringify(trip, null, 2));

  return (
    <div>
      <img src={photoUrl || '/road-trip-vacation.jpg'}  className='h-[330px] w-full object-cover rounded-xl'/>
       <div className='flex justify-between items-center'>
            <div className='my-6 flex flex-col gap-2'>
                <h2 className='font-bold text-2xl'>{trip?.userSelection?.location || 'Unknown Location'}</h2>
                <div className='flex gap-6 mt-4'>
                    <h2 className='bg-gray-200 font-medium text-gray-600 rounded-full p-1 px-4 md:text-md'>🗓️ {trip?.userSelection?.noOfDays || 'N/A'} Day</h2>
                    <h2 className='bg-gray-200 font-medium text-gray-600 rounded-full p-1 px-4 md:text-md'>👩‍👧‍👦 Number of Travelers: {trip?.userSelection?.traveler || 'N/A'}</h2>
                    <h2 className='bg-gray-200 font-medium text-gray-600 rounded-full p-1 px-4 md:text-md'>💵 {trip?.userSelection?.budget || 'N/A'} Budget</h2>
                </div>
            </div>
       </div>
    </div>
  )
}

export default InfoSection
