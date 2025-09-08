'use client';

import React, { useEffect, useState } from 'react';
import { apiGet, apiPut } from '@/lib/axiosInstance'; // Added apiPut for edit requests

type Address = {
  country: string;
  state: string;
  city: string;
  area: string;
  pincode: number;
};

type User = {
  _id: string;
  userName: string;
  memberType: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  address: Address;
  listedProperties: any[];
  purchasedProperties: any[];
};

// Type for edit form data
type EditFormData = {
  fullName: string;
//   email: string;
  mobileNumber: string;
  address: Address;
};

const UserPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    fullName: '',
    // email: '',
    mobileNumber: '',
    address: {
      country: '',
      state: '',
      city: '',
      area: '',
      pincode: 0,
    },
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiGet('api/users/me');
        setUser(res.data.data);
        // Initialize edit form with current user data
        if (res.data.data) {
          setEditFormData({
            fullName: res.data.data.fullName,
            // email: res.data.data.email,
            mobileNumber: res.data.data.mobileNumber,
            address: { ...res.data.data.address },
          });
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Call edit API endpoint
      const response = await apiPut('api/users/edit', editFormData);
      
      if (response.data.success) {
        // Update local state with edited data
        if (user) {
          setUser({
            ...user,
            fullName: editFormData.fullName,
            // email: email,
            mobileNumber: editFormData.mobileNumber,
            address: { ...editFormData.address },
            updatedAt: new Date().toISOString(),
          });
        }
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
  
  if (!user) return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md p-6 bg-white rounded-xl shadow-md text-center">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Failed to load user data</h2>
        <p className="text-gray-600">Please try refreshing the page or check your connection</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-indigo-600 px-6 py-4 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Edit Profile</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={editFormData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
   
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={editFormData.mobileNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={editFormData.address.country}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={editFormData.address.state}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={editFormData.address.city}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                  <input
                    type="text"
                    name="area"
                    value={editFormData.address.area}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input
                    type="number"
                    name="pincode"
                    value={editFormData.address.pincode || ''}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                  disabled={isSaving}
                >
                  {isSaving && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-8 py-12 text-center sm:text-left sm:flex sm:items-center">
          <div className="mx-auto sm:mx-0 bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 sm:w-32 sm:h-32" />
          <div className="mt-6 sm:mt-0 sm:ml-8 text-white relative w-full">
            <div className="absolute top-0 right-0">
              <button
                onClick={handleEditClick}
                className="flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Profile
              </button>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold">{user.fullName}</h1>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>@{user.userName}</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem label="Full Name" value={user.fullName || "NA"} />
                  <InfoItem label="Username" value={user.userName || "NA"} />
                  <InfoItem label="Email" value={user.email || "NA"} />
                  <InfoItem label="Mobile" value={user.mobileNumber || "NA"} />
                  <InfoItem label="Member Type" value={user.memberType || "NA"} />
                  <InfoItem 
                    label="Status" 
                    value={user.isActive ? 'Active' : 'Inactive'} 
                    status={user.isActive} 
                  />
                  <InfoItem 
                    label="Created At" 
                    value={new Date(user.createdAt).toLocaleString() || "NA"} 
                  />
                  <InfoItem 
                    label="Updated At" 
                    value={new Date(user.updatedAt).toLocaleString() || "NA"} 
                  />
                </div>
              </div>
            </div>

            {/* Properties Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Properties Summary</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <StatCard 
                    label="Listed Properties" 
                    value={user?.listedProperties?.length ?? 0} 
                    color="bg-blue-100 text-blue-800"
                  />
                  <StatCard 
                    label="Purchased Properties" 
                    value={user?.purchasedProperties?.length ?? 0} 
                    color="bg-green-100 text-green-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Address */}
          <div>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden h-full">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Address Information</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {user.address && (
                    <>
                      <InfoItem label="Country" value={user.address.country} />
                      <InfoItem label="State" value={user.address.state} />
                      <InfoItem label="City" value={user.address.city} />
                      <InfoItem label="Area" value={user.address.area} />
                      <InfoItem label="Pincode" value={user.address.pincode.toString()} />
                    </>
                  )}
                </div>
                <div className="mt-8 bg-gray-50 rounded-lg p-4">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48" />
                  <p className="text-center text-gray-500 mt-2 text-sm">Location Map</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Info Item Component
const InfoItem = ({ label, value, status }: { label: string; value: string; status?: boolean }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <div className="flex items-center mt-1">
      {status !== undefined && (
        <span className={`w-3 h-3 rounded-full mr-2 ${status ? 'bg-green-500' : 'bg-red-500'}`}></span>
      )}
      <p className="text-lg font-medium text-gray-900">{value}</p>
    </div>
  </div>
);

// Reusable Stat Card Component
const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <div className={`mt-2 text-3xl font-bold ${color} rounded-lg py-3 px-4 inline-block`}>
      {value || "NA"}
    </div>
  </div>
);

export default UserPage;