export const SelectTravelsList = [
  {
    id: 1,
    title: 'Just Me',
    desc: 'A solo traveler in exploration',
    icon: '➳',
    people: '1'
  },
  {
    id: 2,
    title: 'A Couple',
    desc: 'Two travelers in tandem',
    icon: '👫',
    people: '2 People'
  },
  {
    id: 3,
    title: 'Family',
    desc: 'A group of fun-loving adventurers',
    icon: '🏡',
    people: '3 to 5 People'
  },
  {
    id: 4,
    title: 'Friends',
    desc: 'A bunch of thrill-seekers',
    icon: '🎉',
    people: '5 to 10 People'
  }
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: 'Cheap',
    desc: 'Stay conscious of costs',
    icon: '💡',
  },
  {
    id: 2,
    title: 'Moderate',
    desc: 'Keep costs on the average side',
    icon: '💵',
  },
  {
    id: 3,
    title: 'Luxury',
    desc: "Don't worry about costs",
    icon: '✨',
  },
];

export const AI_PROMPT = `Generate Travel Plan for Location : {location} for {totalDays} Days for {traveler} with a {budget} budget.
Provide a Hotels options list with the following details:
- Hotel Name
- Hotel Address
- Price
- Hotel Image URL
- Geo Coordinates (latitude, longitude)
- Rating
- Description

Suggest an itinerary for {totalDays} days with the following details for each day:
- Day number (e.g., Day 1, Day 2, ..., Day {totalDays})
- Best Time to Visit
- A list of places to visit each day, including:
  - Place Name
  - Place Details
  - Place Image URL
  - Geo Coordinates (latitude, longitude)
  - Ticket Pricing
  - Rating
  - Time to travel between locations

Ensure that the output is in proper JSON format with the following structure:
Generate only the JSON structure for the trip data without any extra characters, comments, or formatting like triple backticks. Ensure it is a valid JSON object.
do not give Unterminated string in JSON error.
{
  "tripData": {
    "location": "{location}",
    "totalDays": "{totalDays}",
    "traveler": "{traveler}",
    "budget": "{budget}",
    "hotels": [
      {
        "hotelName": "{hotelName}",
        "hotelAddress": "{hotelAddress}",
        "price": "{price}",
        "hotelImageUrl": "{hotelImageUrl}",
        "geoCoordinates": {
          "latitude": "{latitude}",
          "longitude": "{longitude}"
        },
        "rating": "{rating}",
        "description": "{description}"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "bestTimeToVisit": "{bestTimeToVisit}",
        "places": [
          {
            "placeName": "{placeName}",
            "placeDetails": "{placeDetails}",
            "placeImageUrl": "{placeImageUrl}",
            "geoCoordinates": {
              "latitude": "{latitude}",
              "longitude": "{longitude}"
            },
            "ticketPricing": "{ticketPricing}",
            "rating": "{rating}",
            "timeToTravel": "{timeToTravel}"
          }
        ]
      },
      {
        "day": 2,
        "bestTimeToVisit": "{bestTimeToVisit}",
        "places": [
          {
            "placeName": "{placeName}",
            "placeDetails": "{placeDetails}",
            "placeImageUrl": "{placeImageUrl}",
            "geoCoordinates": {
              "latitude": "{latitude}",
              "longitude": "{longitude}"
            },
            "ticketPricing": "{ticketPricing}",
            "rating": "{rating}",
            "timeToTravel": "{timeToTravel}"
          }
        ]
      },
      ...
      {
        "day": {totalDays},
        "bestTimeToVisit": "{bestTimeToVisit}",
        "places": [
          {
            "placeName": "{placeName}",
            "placeDetails": "{placeDetails}",
            "placeImageUrl": "{placeImageUrl}",
            "geoCoordinates": {
              "latitude": "{latitude}",
              "longitude": "{longitude}"
            },
            "ticketPricing": "{ticketPricing}",
            "rating": "{rating}",
            "timeToTravel": "{timeToTravel}"
          }
        ]
      }
    ]
  }
}`;
