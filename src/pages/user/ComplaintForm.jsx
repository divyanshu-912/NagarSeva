import React, { useState } from 'react';
import { submitComplaint } from '../../services/complaintsService';
import Caffiene from '../../assets/Caffiene.png';
import { AlertTriangle, CheckCircle, Phone, MapPin, FileText } from 'lucide-react';

export default function ComplaintForm() {
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
    { 
      id: 'garbage', 
      name: 'Waste Management', 
      hindi: 'कचरा प्रबंधन',
      description: 'Garbage collection, cleaning, sanitation issues',
      hindiDesc: 'कचरा संग्रहण, सफाई, स्वच्छता समस्याएं'
    },
    { 
      id: 'water', 
      name: 'Water Supply',
      hindi: 'जल आपूर्ति', 
      description: 'Water supply, pipeline, quality issues',
      hindiDesc: 'जल आपूर्ति, पाइपलाइन, गुणवत्ता समस्याएं'
    },
    { 
      id: 'road', 
      name: 'Road Maintenance',
      hindi: 'सड़क रखरखाव',
      description: 'Road repair, potholes, street lights',
      hindiDesc: 'सड़क मरम्मत, गड्ढे, स्ट्रीट लाइट'
    }
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
      alert('कृपया सभी फ़ील्ड भरें | Please fill all fields');
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
      alert('शिकायत सबमिट करने में त्रुटि। कृपया पुनः प्रयास करें। | Error submitting complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center px-4 py-12">
        {/* Top Flag */}
        <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-orange-500 via-white to-green-500">
          <div className="max-w-7xl mx-auto mt-1 mb-1 px-4 relative z-10">
            <div className="flex items-center justify-center space-x-4 text-center">
              <span className="text-xs text-blue-700 md:text-xs font-medium tracking-wide">
                भारत सरकार | Government of India | Digital India 
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-md w-full mt-12">
          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Indian Flag Colors */}
            <div className="h-2 bg-gradient-to-r from-orange-500 via-white to-green-600"></div>
            
            <div className="p-8 text-center">
              {/* Logo */}
              <div className="flex justify-center mb-4">
                <img src={Caffiene} className='h-16 w-16' alt="NagarSeva Logo" />
              </div>

              {/* Success Icon */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                शिकायत सफलतापूर्वक दर्ज!
              </h2>
              <h3 className="text-lg font-semibold text-gray-700 mb-6">
                Complaint Submitted Successfully!
              </h3>
              
              <div className="bg-gradient-to-r from-orange-50 to-green-50 rounded-xl p-6 mb-6 border border-orange-200">
                <p className="text-sm text-gray-600 mb-2">आपकी शिकायत आईडी | Your Complaint ID:</p>
                <p className="text-2xl font-bold text-orange-600">{complaintId}</p>
                <p className="text-xs text-gray-500 mt-3">कृपया इस आईडी को नोट कर लें | Please note this ID for tracking</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-semibold text-gray-900 mb-2">अगले चरण | Next Steps:</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>आपकी शिकायत संबंधित विभाग को भेज दी गई है</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>24 घंटों में समीक्षा की जाएगी</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>अपडेट के लिए शिकायत आईडी से ट्रैक करें</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => setSubmitted(false)}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  नई शिकायत दर्ज करें | Submit Another Complaint
                </button>
                
                <a
                  href="/"
                  className="block w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  होम पेज पर जाएं | Go to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 py-8 px-4">
      {/* Top Flag */}
      <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-orange-500 via-white to-green-500">
        <div className="max-w-7xl mx-auto mt-1 mb-1 px-4 relative z-10">
          <div className="flex items-center justify-center space-x-4 text-center">
            <span className="text-xs text-blue-700 md:text-xs font-medium tracking-wide">
              भारत सरकार | Government of India | Digital India 
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-12">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-orange-500 via-white to-green-600"></div>
          
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <img src={Caffiene} className='h-10 w-10' alt="Logo" />
                </div>
                
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">NagarSeva Portal</h1>
                  <p className="text-sm text-gray-600">नागरिक शिकायत पोर्टल | Citizen Complaint Portal</p>
                </div>
              </div>

              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700 font-medium">
                सभी फ़ील्ड अनिवार्य हैं। कृपया सटीक जानकारी प्रदान करें। | All fields are mandatory. Please provide accurate information.
              </p>
            </div>
          </div>
        </div>

        {/* Complaint Form */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FileText className="mr-3 h-6 w-6" />
              शिकायत दर्ज करें | Register Complaint
            </h2>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="citizen_name" className="block text-sm font-semibold text-gray-700 mb-2">
                  पूरा नाम | Full Name *
                </label>
                <input
                  type="text"
                  id="citizen_name"
                  name="citizen_name"
                  value={formData.citizen_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="अपना पूरा नाम दर्ज करें | Enter your full name"
                  required
                />
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="citizen_phone" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  फ़ोन नंबर | Phone Number *
                </label>
                <input
                  type="tel"
                  id="citizen_phone"
                  name="citizen_phone"
                  value={formData.citizen_phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="अपना फ़ोन नंबर दर्ज करें | Enter phone number"
                  pattern="[0-9]{10}"
                  required
                />
              </div>

              {/* Address Field */}
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  पता | Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="समस्या का पूरा पता दर्ज करें | Enter complete address of the issue"
                  required
                />
              </div>

              {/* Department Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  विभाग चुनें | Select Department *
                </label>
                <div className="space-y-3">
                  {departments.map((dept) => (
                    <label 
                      key={dept.id} 
                      className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.department === dept.id 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="department"
                        value={dept.id}
                        checked={formData.department === dept.id}
                        onChange={handleChange}
                        className="mt-1 h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300"
                        required
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {dept.hindi} | {dept.name}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {dept.hindiDesc}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {dept.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description Field */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  शिकायत विवरण | Complaint Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="अपनी शिकायत का विस्तृत विवरण दें | Describe your complaint in detail..."
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 shadow-lg ${
                    submitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl transform hover:scale-[1.02]'
                  }`}
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      शिकायत सबमिट हो रही है... | Submitting...
                    </div>
                  ) : (
                    'शिकायत दर्ज करें | Submit Complaint'
                  )}
                </button>
              </div>

              {/* Help Text */}
              <div className="text-center pt-2">
                <p className="text-sm text-gray-500">
                  सहायता के लिए कॉल करें: <span className="font-semibold text-orange-600">1800-123-4567</span>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 mb-4">
          <p className="text-xs text-gray-500">
            © 2025 Government of India. All rights reserved.<br />
            नागरिक सेवा पोर्टल | Citizen Services Portal
          </p>
        </div>
      </div>
    </div>
  );
}
