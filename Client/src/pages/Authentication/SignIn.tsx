import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from '../../Context/appContext';
import LogoDark from '../../images/logo/logo.png';
import Logo from '../../images/logo/logo.png';
import axios from 'axios';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const appContext = useContext(AppContext); // Access the context values
  if (!appContext) {
    throw new Error("SignIn component must be used within an AppContextProvider");
  }

  const { backendUrl, setIsLoggedin, setUserData, getUserData } = appContext;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state

    try {
      const response = await axios.post(`${backendUrl}/api/auth/login`, { email, password });
      const { data } = response;
      console.log("Login Response:", data);
      const { success, userType } = data;

      if (success) {
        setIsLoggedin(true);  // Update login status in the context
        setUserData(data.userData);
        await getUserData();  // Store user data in the context
        console.log("User Data:", data.userData); // Debug log

        toast.success('Login successful!');

        // Redirect based on userType
        if (userType === 'seller') {
          navigate('/seller-dashboard');
        } else if (userType === 'supplier') {
          navigate('/');
        } else {
          navigate('/dashboard'); // Default dashboard for other roles
        }
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
      setError('Login failed. Please try again.');
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <div className="text-center">
            <Link className="mb-5 inline-block" to="/">
              <img className="hidden dark:block mx-auto h-12" src={Logo} alt="MarketHub Logo" />
              <img className="dark:hidden mx-auto h-12" src={LogoDark} alt="MarketHub Logo Dark" />
            </Link>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Login to Your Account</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Don’t have an account?{' '}
              <Link to="/auth/signup" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Email"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-blue-500 hover:underline">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;
