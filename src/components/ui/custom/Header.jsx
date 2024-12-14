import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { X } from 'lucide-react';
import axios from 'axios';

function Header() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    console.log("User object:", user);
  }, []);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
  });

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'Application/json'
      }
    }).then((resp) => {
      console.log(resp.data);
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDialog(false);
      window.location.reload();
    }).catch((error) => {
      console.error("Error fetching user profile:", error);
    });
  };

  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-4'>
      <img src='/logo.svg' alt="Logo" className="h-10" />
      <div>
        {user ?
          <div className='flex items-center gap-4'>
            <a href="/create-trip">
              <Button variant="outline" className="rounded-full">Create Trip</Button>
            </a>
            <a href="/my-trips">
              <Button variant="outline" className="rounded-full">My Trips</Button>
            </a>
            <Popover>
              <PopoverTrigger>
                {user.picture ? (
                  <img src={user.picture} className='rounded-full w-[38px] h-[38px]' alt="User Profile" />
                ) : (
                  <div className='rounded-full w-[38px] h-[38px] bg-gray-300 flex items-center justify-center'>
                    <span className='text-gray-600'>?</span>
                  </div>
                )}
              </PopoverTrigger>
              <PopoverContent>
                <h2 className="cursor-pointer" onClick={() => {
                  googleLogout();
                  localStorage.clear();
                  window.location.reload();
                }}>Logout</h2>
              </PopoverContent>
            </Popover>
          </div>
          : <Button 
              onClick={() => setOpenDialog(true)} 
              className="bg-black text-white rounded-lg"
            >
              Sign In
            </Button>
        }
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
                  <FcGoogle className="mr-2" />
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

export default Header;
