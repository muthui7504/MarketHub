import { useState, useEffect, useContext } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import CoverDefault from '../images/cover/cover-01.png';
import ProfileDefault from '../images/user/user-06.png';
import axios from 'axios';
import { AppContext } from '../Context/appContext';

const SellerProfile = () => {
  const [seller, setSeller] = useState({
    name: '',
    companyName: '',
    businessName: '',    // New field for business name
    sellerType: '',
    categories: '',       // New field for categories
    coverImage: '',
    profileImage: '',
  });

  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error('Settings component must be used within an AppContextProvider');
  }
  const { backendUrl } = appContext;

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/update/get-seller`, {
          withCredentials: true,
        });
        const profileData = response.data.profile;
        setSeller({
          name: profileData.name,
          companyName: profileData.companyName,
          businessName: profileData.businessName || '',  // Retrieve business name
          sellerType: profileData.sellerType || '',
          categories: profileData.preferredCategories ? profileData.preferredCategories.join(', ') : '',  // Retrieve categories
          coverImage: profileData.coverImage ? `${backendUrl}${profileData.coverImage}` : '',
          profileImage: profileData.image ? `${backendUrl}${profileData.image}` : '',
        });
      } catch (error) {
        console.error('Error fetching seller data:', error);
      }
    };

    fetchSellerData();
  }, [backendUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      console.log(event.target.files[0]);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Seller Profile" />

      <div className="rounded-sm border bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
        {/* Cover Image Section */}
        <div className="relative h-35 md:h-65">
          <img
            src={seller.coverImage || CoverDefault}
            alt="Cover"
            className="h-full w-full object-cover rounded-tl-sm rounded-tr-sm"
          />
          <div className="absolute bottom-1 right-1 xsm:bottom-4 xsm:right-4">
            <label htmlFor="coverUpload" className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-white bg-primary rounded cursor-pointer hover:bg-opacity-90">
              <input type="file" id="coverUpload" className="hidden" onChange={handleFileChange} />
              <span>Edit Cover</span>
            </label>
          </div>
        </div>

        {/* Profile Image and Info Section */}
        <div className="text-center px-4 pb-6 lg:pb-8">
          <div className="relative -mt-14 mx-auto w-32 h-32 rounded-full bg-white p-1 shadow-md">
            <img
              src={seller.profileImage || ProfileDefault}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
            <label htmlFor="profileUpload" className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer">
              <input type="file" id="profileUpload" className="hidden" onChange={handleFileChange} />
              <span className="sr-only">Edit Profile Image</span>
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.414 4.586a2 2 0 00-2.828 0L9 10.172V14h3.828l5.586-5.586a2 2 0 000-2.828l-1-1z" />
                <path
                  fillRule="evenodd"
                  d="M15 6l2 2-5.586 5.586H9V10.414L15 6zm-4.414 8H5a1 1 0 01-1-1v-4.586l6-6A1 1 0 0111 3h4a1 1 0 011 1v4a1 1 0 01-.293.707l-6 6A1 1 0 0110.586 14z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </div>

          <div className="mt-4">
            <h3 className="text-2xl font-semibold">{seller.name}</h3>
            <span className="block text-sm">{seller.companyName}</span>
            <span className="block text-sm">{seller.businessName}</span>  {/* Display business name */}
            <p className="text-sm">{seller.categories}</p>  {/* Display categories */}
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerProfile;
