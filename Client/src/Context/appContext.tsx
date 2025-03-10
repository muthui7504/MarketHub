import { createContext, useState, useEffect, ReactNode } from "react";
import { toast } from 'react-toastify';
import axios from 'axios';

axios.defaults.withCredentials = true;


interface UserData {
  id: string;
  name: string;
  isAccountVerified: boolean;
}

// Define the type for the context value
interface AppContextProps {
  backendUrl: string;
  isLoggedin: boolean;
  setIsLoggedin: (value: boolean) => void;
  userData:UserData | null; // Replace 'any' with a proper interface
  setUserData: (data: UserData | null) => void;  
  getUserData: () => Promise<void>;
  getAuthState: () => Promise<void>;
}

// Default value for the context
export const AppContext = createContext<AppContextProps | undefined>(undefined);
 
interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;

  const [isLoggedin, setIsLoggedin] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);

 
  // Fetch user data
  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/data', {withCredentials: true });
      if (data.success && data.userData) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error occurred while fetching user data");
    }
  };
   // Check if user is authenticated
   const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
      if (data.success) {
        setIsLoggedin(true);
        await getUserData(); // Fetch user data after successful auth
      }
    } catch (error: any) {
      console.error("Auth State Error:", error); // Debug log
      toast.error(error.response?.data?.message || "Error occurred during authentication");
    }
  };


  // Fetch product data
  // Fetch product data for the logged-in user




  useEffect(() => {
    getAuthState();
  }, []); // Empty dependency array to run once on mount

  // Context value that will be provided to other components
  const value: AppContextProps = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    getAuthState
  };


  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};