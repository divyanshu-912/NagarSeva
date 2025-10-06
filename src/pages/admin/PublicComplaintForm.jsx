import React, { useState } from 'react';
import { submitComplaint } from '../../services/complaintsService';

export default function PublicComplaintForm() {
  const [formData, setFormData] = useState({
    citizen_name: '',
    citizen_phone: '',
    address: '',
    description: '',
    department: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState(null);

  const departments = [
    { id: 'garbage', name: 'Waste Management', description: 'Garbage collection, cleaning, sanitation issues' },
    { id: 'water', name: 'Water Supply', description: 'Water supply, pipeline, quality issues' },
    { id: 'road', name: 'Road Maintenance', description: 'Road repair, potholes, street lights' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.citizen_name || !formData.citizen_phone || !formData.address || 
        !formData.description || !formData.department) {
      alert('Please fill all fields');
      return;
    }

    setSubmitting(true);
    
    try {
      const response = await submitComplaint(formData);
      setComplaintId(response.id || 'CMP-' + Date.now());
      setSubmitted(true);
      
      // Reset form
      setFormData({
        citizen_name: '',
        citizen_phone: '',
        address: '',
        description: '',
        department: ''
      });
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('Error submitting complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Success Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {/* Indian Flag Colors */}
            <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-green-600 mb-6"></div>
            
            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Complaint Submitted Successfully!</h2>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Your Complaint ID:</p>
              <p className="text-xl font-bold text-blue-600">{complaintId}</p>
            </div>
            
           
            
            <button
              onClick={() => setSubmitted(false)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Submit Another Complaint
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="bg-white rounded-lg shadow-sm mb-6">

          <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-green-600"></div>
          
          <div className="p-6">
            <div className="flex items-center space-x-4">
           
              <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Nagar Seva Portal</h1>
                <p className="text-sm text-gray-600">Submit Your Complaint Online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Complaint Form */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Register Your Complaint</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
          
              <div>
                <label htmlFor="citizen_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="citizen_name"
                  name="citizen_name"
                  value={formData.citizen_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="citizen_phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="citizen_phone"
                  name="citizen_phone"
                  value={formData.citizen_phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter complete address where the issue is"
                  required
                />
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Department *
                </label>
                <div className="space-y-3">
                  {departments.map((dept) => (
                    <label key={dept.id} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="department"
                        value={dept.id}
                        checked={formData.department === dept.id}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        required
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{dept.name}</div>
                        <div className="text-sm text-gray-600">{dept.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Complaint Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your complaint in detail..."
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                    submitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green opacity-80 hover:opacity-100'
                  } text-white`}
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Complaint'
                  )}
                </button>
              </div>

             
             
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}