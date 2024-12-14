import './index.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CreateTrip from './create-trip/index.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import Header from "./components/ui/custom/Header";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Viewtrip from './viewtrip/[tripId]';
import MyTrips from './my-trips';

const router=createBrowserRouter([
  {
    path:'/',
    element:<App/>
  },
  {
    path:'/create-trip',
    element:<CreateTrip/>
  },
  {
    path:'/view-trip/:tripId',
    element:<Viewtrip/>
  },
  {
    path:'/my-trips',
    element:<MyTrips/>
  }
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
        <Header/>
        <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
