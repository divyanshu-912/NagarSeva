import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../../services/userService';
import { getComplaintsByUser } from '../../services/complaintsService';

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { user, profile: userProfile } = await getCurrentUser();
      setProfile(userProfile || null);

      const complaintsData = await getComplaintsByUser(userProfile || {});
      setComplaints(complaintsData || []);
      setLoading(false);
    };
    load();
  }, []);

  const counts = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    assigned: complaints.filter(c => c.status === 'assigned').length,
    completed: complaints.filter(c => c.status === 'completed').length
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          {profile ? (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Name:</strong> {profile.name || profile.username || '-'}</p>
                <p><strong>Email:</strong> {profile.email || '-'}</p>
                <p><strong>Phone:</strong> {profile.phone || '-'}</p>
               
              </div>
              <div>
                <h3 className="font-semibold">Complaint Summary</h3>
                <ul className="mt-2 space-y-2">
                  <li>Total complaints: <strong>{counts.total}</strong></li>
                  
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600 mt-4">You are not logged in.</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">My Complaints</h2>

          {loading ? (
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
            </div>
          ) : complaints.length === 0 ? (
            <p className="text-sm text-gray-600">No complaints found for your profile.</p>
          ) : (
            <div className="space-y-4">
              {complaints.map(c => (
                <div key={c.id} className="border p-4 rounded-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{c.citizen_name || 'Anonymous'}</h3>
                      <p className="text-sm text-gray-600">{c.department_name || 'General' } • {new Date(c.created_at).toLocaleString()}</p>
                    </div>
                    <div className="text-sm">
                      <span className={`px-2 py-1 rounded text-white ${c.status === 'pending' ? 'bg-orange-500' : c.status === 'assigned' ? 'bg-blue-600' : 'bg-green-600'}`}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">{c.description}</p>
                  <p className="mt-2 text-sm text-gray-500">Address: {c.address}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
