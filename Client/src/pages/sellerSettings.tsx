import React, { useState, useContext, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import axios from 'axios';
import { AppContext } from '../Context/appContext';
import { toast } from 'react-toastify';

const SellerSettings: React.FC = () => {
  const [formData, setFormData] = useState<{
    businessName: string;
    preferredCategories: string;
    phone: string;
    address: string;
    image: File | null;
    imagePreview: string | null;
  }>({
    businessName: '',
    preferredCategories: '',
    phone: '',
    address: '',
    image: null,
    imagePreview: null,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("SellerSettings component must be used within an AppContextProvider");
  }
  const { backendUrl } = appContext;

  // Fetch seller details from backend
  const fetchSellerDetails = async (searchParams = {}) => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/update/get-seller`, {
        params: searchParams,
        withCredentials: true,
      });

      if (response.data.success && response.data.profile) {
        const { businessName, preferredCategories, phone, address, image } = response.data.profile;
        setFormData({
          businessName: businessName || '', 
          preferredCategories: preferredCategories || '',
          phone: phone || '',
          address: address || '',
          image: null,
          imagePreview: image ? `${backendUrl}${image}` : null,
        });
      } else {
        toast.error(response.data.message || 'Seller details not found');
      }
    } catch (error) {
      console.error('Error fetching seller details:', error);
      toast.error('Failed to fetch seller details.');
    }

    setLoading(false);
  };
  useEffect(() => {
    fetchSellerDetails({});
  }, [backendUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file, imagePreview: URL.createObjectURL(file) });
    }
  };

  const validateForm = () => {
    const { businessName, phone } = formData;
    const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/;
    if (!businessName.trim()) {
      toast.error('Business Name is required.');
      return false;
    }
    if (!phoneRegex.test(phone)) {
      toast.error('Invalid phone number format.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    const formDataToSend = new FormData();
    for (const key in formData) {
      if (key !== 'imagePreview') {
        formDataToSend.append(key, formData[key as keyof typeof formData] as any);
      }
    }
  
    setSubmitting(true);
    try {
      const response = await axios.put(`${backendUrl}/api/update/update-seller`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
  
      const { success, message, seller } = response.data;
  
      if (success && seller) {
        setFormData({
          businessName: seller.businessName || '',
          preferredCategories: seller.preferredCategories || '',
          phone: seller.phone || '',
          address: seller.address || '',
          image: null,
          imagePreview: seller.image ? `${backendUrl}/uploads/${seller.image}` : null,
        });
        toast.success('Profile updated successfully!');
      } else {
        toast.error(message);
      }
    } catch (error: any) {
      toast.error('Error updating seller');
    } finally {
      setSubmitting(false);
    }
  };
  
  
  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Settings" />

      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Seller Profile Information</h3>
            </div>
            <div className="p-7">
              <form onSubmit={handleSubmit}>
                {/* Business Name */}
                <div className="mb-5.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="businessName">
                    Business Name
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="businessName"
                    id="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Business Name"
                  />
                </div>

                {/* Preferred Categories */}
                <div className="mb-5.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="preferredCategories">
                    Preferred Categories
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="preferredCategories"
                    id="preferredCategories"
                    value={formData.preferredCategories}
                    onChange={handleInputChange}
                    placeholder="e.g., Clothing, Accessories"
                  />
                </div>

                {/* Phone Number */}
                <div className="mb-5.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+123 456 7890"
                  />
                </div>

                {/* Address */}
                <div className="mb-5.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="address">
                    Address
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Business Address"
                  />
                </div>

                {/* Business Logo */}
                <div className="mb-5.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="image">
                    Business Logo
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {formData.imagePreview && (
                    <div className="mt-3">
                      <img src={formData.imagePreview} alt="Business Logo Preview" className="h-20 w-20 object-cover" />
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <button
                  className="mt-4 w-full rounded bg-primary py-3 text-center text-white hover:bg-opacity-90"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerSettings;
