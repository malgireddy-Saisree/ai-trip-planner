import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelsList } from '@/constants/options';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { Button } from '@/components/ui/button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { FaGoogle } from "react-icons/fa";
import { db } from '@/service/firebaseConfig';
import { setDoc, doc } from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { X } from 'lucide-react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

function Input({ placeholder, type, onChange }) {
  return (
    <input 
      className="border p-2 w-full rounded shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500" 
      placeholder={placeholder} 
      type={type} 
      onChange={onChange} 
    />
  );
}

function CreateTrip() {
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState({});
  const [chatSession, setChatSession] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [tripOutput, setTripOutput] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading,setLoading]=useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initChatSession = async () => {
      try {
        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        setChatSession(model);
      } catch (error) {
        console.error("Failed to initialize chat session:", error);
        toast.error("Failed to initialize AI service");
      }
    };

    initChatSession();
  }, []);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log(codeResponse);
      localStorage.setItem('user', JSON.stringify(codeResponse));
      
      GetUserProfile(codeResponse);
      
      setOpenDialog(false);
      toast.success("Successfully logged in!");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Login failed. Please try again.");
    }
  });

  const handleInputChange = (name, value) => {
    // Validate "noOfDays"
    if (name === 'noOfDays' && parseInt(value, 10) > 5) {
      toast.error("Please enter trip days less than or equal to 5.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    console.log("Form data updated:", formData);
  }, [formData]);

  const onGenerateTrip = async () => {
    // Check if user is logged in
    setLoading(true);
    const user = localStorage.getItem('user');
    if (!user) {
      setOpenDialog(true);
      return;
    }
    if (!chatSession) {
      toast.error("AI service not ready. Please try again.");
      return;
    }

    // Check if all required fields are filled
    const requiredFields = ['location', 'noOfDays', 'budget', 'traveler'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      // Create a user-friendly error message
      const missingFieldsMessage = missingFields.map(field => {
        switch(field) {
          case 'location': return 'Destination';
          case 'noOfDays': return 'Number of Days';
          case 'budget': return 'Budget';
          case 'traveler': return 'Travel Companions';
          default: return field;
        }
      }).join(', ');

      toast.error(`Please fill in the following fields: ${missingFieldsMessage}`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    let result;

    try {
      const FINAL_PROMPT = AI_PROMPT
        .replace('{location}', formData?.location)
        .replace('{totalDays}', formData?.noOfDays)
        .replace('{traveler}', formData?.traveler)
        .replace('{budget}', formData?.budget)
        .replace('{totalDays}', formData?.noOfDays);
      
      console.log(FINAL_PROMPT);
      
      // Use the chat session to send message
      result = await chatSession.generateContent(FINAL_PROMPT);
      const outputText = result.response.text();
      setTripOutput(outputText);
      console.log(outputText);
    } catch (error) {
      console.error("Trip generation error:", error);
      toast.error("Failed to generate trip. Please try again.");
    }
    
    setLoading(false);
    SaveAiTrip(result?.response?.text());
  };
   const SaveAiTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));

    // Check if userProfile is defined and has an email
    
    const docId = Date.now().toString();

    try {
        await setDoc(doc(db, "AITrips", docId), {
            userSelection: formData,
            tripData: JSON.parse(TripData),
            UserEmail: user?.email, 
            id: docId
        });
        navigate('/view-trip/' + docId);
    } catch (error) {
        console.error("Error saving trip data:", error);
        toast.error("Failed to save trip data. Please try again.");
    } finally {
        setLoading(false);
    }
  };
  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo`, {
      headers: {
        Authorization: `Bearer ${tokenInfo.access_token}`,
        Accept: 'application/json'
      }
    })
    .then((resp) => {
      console.log(resp.data);
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDialog(false);
      onGenerateTrip();
    })
    .catch((error) => {
      console.error("Failed to fetch user profile:", error);
      toast.error("Failed to fetch user profile");
    });
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      {userProfile && (
        <div className="mb-5">
          <h3 className="font-bold text-xl">Welcome, {userProfile.name}!</h3>
          <p>Email: {userProfile.email}</p>
        </div>
      )}
      <h2 className="font-bold text-4xl text-center text-black">Tell us your travel preferences 🏕️🌴</h2>
      <p className="mt-3 text-gray-500 text-lg text-center">Just provide some details below:</p>

      <div className="mt-10 mb-10 p-6 border-2 border-gray-300 rounded-lg shadow-xl bg-white">
        <h2 className="text-2xl my-3 font-bold text-black">What is your destination?</h2>
        <GooglePlacesAutocomplete
          apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
          selectProps={{
            value: place,
            onChange: (v) => {
              setPlace(v);
              handleInputChange('location', v.label);
            },
          }}
        />
      </div>

      <div className="mt-10 mb-10 p-6 border-2 border-gray-300 rounded-lg shadow-xl bg-white">
        <h2 className="text-2xl my-3 font-bold text-black">How many days are you planning for your trip?</h2>
        <Input 
          placeholder="Ex. 3" 
          type="number" 
          onChange={(e) => handleInputChange('noOfDays', e.target.value)}
        />
      </div>

      <div className="mt-10 mb-10 p-6 border-2 border-gray-300 rounded-lg shadow-xl bg-white">
        <h2 className="text-2xl my-3 font-bold text-black">What is your Budget?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectBudgetOptions.map((item, index) => (
            <div 
              key={index} 
              onClick={() => handleInputChange('budget', item.title)}
              className={`p-4 border-2 border-gray-300 cursor-pointer rounded-lg hover:shadow-lg ${formData.budget === item.title ? 'bg-gray-100' : ''}`}
            >
              <h2 className="text-4xl text-black">{item.icon}</h2>
              <h2 className="font-bold text-lg text-black">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 mb-10 p-6 border-2 border-gray-300 rounded-lg shadow-xl bg-white">
        <h2 className="text-2xl my-3 font-bold text-black">Who do you plan on traveling with on your next adventure?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectTravelsList.map((item, index) => (
            <div 
              key={index} 
              onClick={() => handleInputChange('traveler', item.people)}
              className={`p-4 border-2 border-gray-300 cursor-pointer rounded-lg hover:shadow-lg ${formData.traveler === item.people ? 'bg-gray-100' : ''}`}
            >
              <h2 className="text-4xl text-black">{item.icon}</h2>
              <h2 className="font-bold text-lg text-black">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      {tripOutput && (
        <div className="mt-10 p-6 border-2 border-gray-300 rounded-lg shadow-xl bg-white">
          <h2 className="text-2xl my-3 font-bold text-black">Your Generated Trip Itinerary</h2>
          <pre className="whitespace-pre-wrap">{tripOutput}</pre>
        </div>
      )}

      <ToastContainer />
      <div className="my-10 justify-end flex">
        <Button 
          disabled={loading}
          className="bg-black text-white border-none rounded-full px-8 py-4 hover:bg-gray-800 shadow-md transition-all duration-300" 
          onClick={onGenerateTrip}
        >
          {loading ? (
            <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' />
          ) : (
            "Generate trip"
          )}
        </Button>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px] max-w-[90%] rounded-lg bg-white">
          <DialogClose className="absolute top-4 right-4">
            <X className="h-5 w-5 text-gray-500 hover:text-gray-800" />
          </DialogClose>
          
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold mb-4">Login Required</DialogTitle>
            <DialogDescription className="text-center">
              <div className="flex flex-col items-center space-y-4">
                <img 
                  src="/logo.svg" 
                  alt="Logo" 
                  className="mb-4 w-24 h-24 object-contain"
                />
                <h2 className="font-bold text-lg">Sign In with Google</h2>
                <p className="text-center text-gray-600 mb-4">
                  Sign in with Google authentication securely
                </p>
                <Button 
                  className="w-full bg-black text-white hover:bg-gray-800" 
                  onClick={() => login()}
                > 
                  <FaGoogle className="mr-2" />
                  Sign In with Google
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;


