import React, { useState, useContext, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import axios from 'axios';
import { AppContext } from '../Context/appContext';
import { toast } from 'react-toastify';

const Settings: React.FC = () => {
  const [formData, setFormData] = useState<{
    companyName: string;
    companyDescription: string;
    categories: string;
    phone: string;
    address: string;
    image: File | null;
    imagePreview: string | null;
  }>({
    companyName: '',
    companyDescription: '',
    categories: '',
    phone: '',
    address: '',
    image: null,
    imagePreview: null,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("Settings component must be used within an AppContextProvider");
  }
  const { backendUrl } = appContext;

  // Function to fetch supplier details from the backend
  const fetchSupplierDetails = async (searchParams = {}) => {
    setLoading(true);

    try {
      const response = await axios.get(`${backendUrl}/api/update/get-supplier`, {
        params: searchParams,
        withCredentials: true,
      });

      if (response.data.success && response.data.profile) {
        const { companyName, companyDescription, categories, phone, address, image } = response.data.profile;
        setFormData({
          companyName: companyName || '',  // Ensure fallback to an empty string
          companyDescription: companyDescription || '',
          categories: categories || '',
          phone: phone || '',
          address: address || '',
          image: null, // Handle image with separate state
          imagePreview: image ? `${backendUrl}${image}` : null,
        });
      } else {
        toast.error(response.data.message || 'Supplier details not found');
      }
    } catch (error) {
      console.error('Error fetching supplier details:', error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to fetch supplier details.');
      } else {
        toast.error('Failed to fetch supplier details.');
      }
    }

    setLoading(false);
  };

  // Fetch supplier details when component mounts
  useEffect(() => {
    fetchSupplierDetails({});
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

  // Basic validation for required fields and phone format
  const validateForm = () => {
    const { companyName, phone } = formData;
    const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/;
    if (!companyName.trim()) {
      toast.error('Company Name is required.');
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
      const response = await axios.put(`${backendUrl}/api/update/update-supplier`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      const { success, message, supplier } = response.data;

      if (success) {
        setFormData({
          companyName: supplier.companyName || '',
          companyDescription: supplier.companyDescription || '',
          categories: supplier.categories || '',
          phone: supplier.phone || '',
          address: supplier.address || '',
          image: null,
          imagePreview: supplier.image ? `${backendUrl}/uploads/${supplier.image}` : null,
        });
        toast.success('Profile updated successfully!');
      } else {
        toast.error(message || 'Failed to update profile');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error updating supplier');
    }
    setSubmitting(false);
  };

  return (
    <div className="mx-auto max-w-270">
      <Breadcrumb pageName="Settings" />

      <div className="grid grid-cols-5 gap-8">
        {/* Supplier Form */}
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Supplier Profile Information</h3>
            </div>
            <div className="p-7">
              <form onSubmit={handleSubmit}>
                {/* Company Name */}
                <div className="mb-5.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="companyName">
                    Company Name
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="companyName"
                    id="companyName"
                    value={formData.companyName}  // Ensure always defined (empty string if no value)
                    onChange={handleInputChange}
                    placeholder="Company Name"
                  />
                </div>

                {/* Company Description */}
                <div className="mb-5.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="companyDescription">
                    Company Description
                  </label>
                  <textarea
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    name="companyDescription"
                    id="companyDescription"
                    value={formData.companyDescription}
                    onChange={handleInputChange}
                    placeholder="Describe your company"
                  />
                </div>

                {/* Categories */}
                <div className="mb-5.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="categories">
                    Categories
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="categories"
                    id="categories"
                    value={formData.categories}
                    onChange={handleInputChange}
                    placeholder="e.g., Electronics, Furniture"
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
                    placeholder="Company Address"
                  />
                </div>

                {/* Company Logo */}
                <div className="mb-5.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white" htmlFor="image">
                    Company Logo
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
                      <img src={formData.imagePreview} alt="Company Logo Preview" className="h-20 w-20 object-cover" />
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

export default Settings;
