import { Button } from '@/components/ui/button';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';

function PlaceCardItem({ place }) {
    const [photoUrl, setPhotoUrl] = useState();

    useEffect(() => {
        if (place) {
            GetPlaceImg();
        }
    }, [place]);

    const GetPlaceImg = async () => {
        const data = {
            textQuery: place.placeName
        };
        try {
            const result = await GetPlaceDetails(data);
            if (result.data.places && result.data.places[0].photos[3]) {
                const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', result.data.places[0].photos[3].name);
                setPhotoUrl(PhotoUrl);
            } else {
                console.error("No photos found for the place.");
            }
        } catch (error) {
            console.error("Error fetching place details:", error);
        }
    };

    return (
        <div>
            <Link to={`https://www.google.com/maps/search/?api=1&query=${place.placeName},${place.geoCoordinates.latitude},${place.geoCoordinates.longitude}`} target='_blank'>
                <div className='my-4 bg-gray-50 p-2 gap-2 border rounded-lg flex flex-cols-2 hover:scale-105 transition-all hover:shadow-md cursor-pointer '>
                    <div className='py-2 mx-3'>
                        <img 
                            src={photoUrl || place.placeImageUrl} 
                            alt={place.placeName} 
                            className='w-[900px] h-[200px] rounded-xl object-cover'
                        />
                    </div>
                    <div>
                        <h2 className='font-medium text-sm text-orange-600'>{place.timeToTravel}</h2>
                        <h2 className='font-bold'>{place.placeName}</h2>
                        <p className='text-sm text-gray-500'>{place.placeDetails}</p>
                        <h2 className='text-blue-700 text-sm'>{place.ticketPricing}</h2>
                        <h2 className='text-sm text-yellow-500'>⭐{place.rating}</h2>
                    </div>
                    <div className='mt-36'>
                        <Button><FaLocationDot /></Button>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default PlaceCardItem;