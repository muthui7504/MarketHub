import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppContext } from '../../Context/appContext';
import { FaCamera } from 'react-icons/fa'; // Add an icon for the camera
import LogoDark from '../../images/logo/logo.png';
import Logo from '../../images/logo/logo.png';

const SignUp: React.FC = () => {
  const appContext = useContext(AppContext); 
  if (!appContext) {
    throw new Error('SignIn component must be used within an AppContextProvider');
  }

  const { backendUrl, setIsLoggedin } = appContext;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: '',
    image: '', // Add an image field to the form state
  });

  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(null);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Update image preview
        setFormData({
          ...formData,
          image: reader.result as string, // You may send the file path or convert it to base64 if required by the backend
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
// Handle form submission
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Use FormData to handle file uploads
  const formDataToSend = new FormData();
  formDataToSend.append('name', formData.name);
  formDataToSend.append('email', formData.email);
  formDataToSend.append('password', formData.password);
  formDataToSend.append('userType', formData.userType);

  // Add the image file if it exists
  const imageInput = document.querySelector<HTMLInputElement>('#file-input');
  if (imageInput?.files?.[0]) {
    formDataToSend.append('image', imageInput.files[0]); // Append the image file to the form data
  }

  try {
    const response = await axios.post(`${backendUrl}/api/auth/register`, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set the correct content type
      },
    });

    if (response.data.success) {
      toast.success('Account created successfully. Please verify your email.');
      setIsLoggedin(true);
      navigate('/auth/verify');
    } else {
      toast.error(response.data.message);
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
  }
};


  return (
    <>
      <ToastContainer />
      <div className="flex justify-center">
        <div className="w-full max-w-md p-8 space-y-8 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="text-center">
            <Link className="mb-5 inline-block" to="/">
              <img className="hidden dark:block mx-auto h-12" src={LogoDark} alt="Logo" />
              <img className="dark:hidden mx-auto h-12" src={Logo} alt="Logo" />
            </Link>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Your Account</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Already have an account?{' '}
              <Link to="/auth/signin" className="text-blue-500 hover:underline">
                Sign In
              </Link>
            </p>
  
            {/* Move the image preview here */}
            <div className="relative w-24 h-24 mx-auto mb-4 mt-4">
              {/* Display image preview */}
              {imagePreview ? (
                <img
                  src={imagePreview as string}
                  alt="Profile Preview"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full">
                  <FaCamera size={40} className="text-gray-400" />
                </div>
              )}
              <label
                htmlFor="file-input"
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
              >
                <FaCamera className="text-white" />
              </label>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>
  
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Full Name"
                />
              </div>
  
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Email"
                />
              </div>
  
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
  
              <div>
                <label htmlFor="userType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Role
                </label>
                <select
                  id="userType"
                  name="userType"
                  required
                  value={formData.userType}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">-- Select a role --</option>
                  <option value="supplier">Supplier</option>
                  <option value="seller">Seller</option>
                </select>
              </div>
            </div>
  
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUp;
