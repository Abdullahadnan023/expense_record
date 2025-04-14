import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { ExpenseFormData, categories, paymentTypes } from '../types';

interface ExpenseFormProps {
  onSubmit: (expense: ExpenseFormData) => void;
}

export function ExpenseForm({ onSubmit }: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: 'Other',
    location: '',
    paymentType: 'Cash'
  });

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string>('');

  const getLocationName = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en-US'
          }
        }
      );
      const data = await response.json();
      
      const addressParts = [];
      if (data.address.road) addressParts.push(data.address.road);
      if (data.address.suburb) addressParts.push(data.address.suburb);
      if (data.address.city) addressParts.push(data.address.city);
      if (data.address.state) addressParts.push(data.address.state);
      
      return addressParts.join(', ');
    } catch (error) {
      console.error('Error getting location name:', error);
      throw new Error('Failed to get location name');
    }
  };

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const locationName = await getLocationName(
            position.coords.latitude,
            position.coords.longitude
          );
          setFormData(prev => ({ ...prev, location: locationName }));
          setIsLoadingLocation(false);
        } catch (error) {
          setLocationError('Failed to get location name');
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        setLocationError('Unable to get your location');
        setIsLoadingLocation(false);
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: 'Other',
      location: '',
      paymentType: 'Cash'
    });
    getCurrentLocation();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            id="description"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            required
            
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              id="location"
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <button
              type="button"
              onClick={getCurrentLocation}
              className="absolute inset-y-0 right-0 px-3 flex items-center"
            >
              {isLoadingLocation ? (
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              ) : (
                <span className="text-sm text-blue-500 hover:text-blue-700">Update</span>
              )}
            </button>
          </div>
          {locationError && (
            <p className="mt-1 text-sm text-red-600">{locationError}</p>
          )}
        </div>

        <div>
          <label htmlFor="paymentType" className="block text-sm font-medium text-gray-700">
            Payment Method
          </label>
          <select
            id="paymentType"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.paymentType}
            onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
          >
            {paymentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </button>
      </div>
    </form>
  );
}