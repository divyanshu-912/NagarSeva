// Test Database utilities - Helper functions for testing
// src/utils/testDatabase.js

import { supabase } from '../lib/supabase';

// Test database connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
    
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection test error:', error);
    return false;
  }
};

// Create test data for development
export const createTestData = async () => {
  try {
    console.log('Creating test data...');

    // Create test user profiles if they don't exist
    const testUsers = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'manager@nagarseva.com',
        name: 'राज कुमार (Manager)',
        role: 'manager',
        department: 'Public Works',
        phone: '+91 98765 43210',
        is_available: true
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        email: 'worker1@nagarseva.com',
        name: 'सुरेश यादव (Worker)',
        role: 'worker',
        department: 'Public Works',
        phone: '+91 98765 43211',
        is_available: true,
        manager_id: '11111111-1111-1111-1111-111111111111'
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        email: 'worker2@nagarseva.com',
        name: 'गीता शर्मा (Worker)',
        role: 'worker',
        department: 'Sanitation',
        phone: '+91 98765 43212',
        is_available: true
      }
    ];

    // Check if user_profiles table exists, if not, we'll skip this part
    const { data: existingUsers, error: userError } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);

    if (!userError) {
      // Insert test users
      for (const user of testUsers) {
        const { error: insertError } = await supabase
          .from('user_profiles')
          .upsert(user, { onConflict: 'id' });
        
        if (insertError) {
          console.warn('Could not insert test user:', user.email, insertError);
        }
      }
      console.log('Test users created/updated');
    } else {
      console.log('User profiles table not found, skipping user creation');
    }

    // Create test tasks if tasks table exists
    const { data: existingTasks, error: taskError } = await supabase
      .from('tasks')
      .select('id')
      .limit(1);

    if (!taskError) {
      const testTasks = [
        {
          title: 'मुख्य सड़क की सफाई',
          description: 'सेक्टर 15 की मुख्य सड़क पर सफाई कार्य करना है। कूड़ा-कचरा हटाना और सड़क को साफ करना।',
          priority: 'High',
          status: 'Pending',
          department: 'Public Works',
          created_by: '11111111-1111-1111-1111-111111111111',
          location: 'Main Street, Sector 15',
          task_type: 'Cleaning',
          estimated_hours: 4.0
        },
        {
          title: 'स्ट्रीट लाइट की मरम्मत',
          description: 'पार्क रोड पर 3 स्ट्रीट लाइट्स काम नहीं कर रही हैं। इन्हें ठीक करना है।',
          priority: 'Medium',
          status: 'Assigned',
          department: 'Public Works',
          assigned_to: '22222222-2222-2222-2222-222222222222',
          created_by: '11111111-1111-1111-1111-111111111111',
          location: 'Park Road, Sector 12',
          task_type: 'Electrical',
          estimated_hours: 2.5
        }
      ];

      for (const task of testTasks) {
        const { error: insertError } = await supabase
          .from('tasks')
          .insert(task);
        
        if (insertError) {
          console.warn('Could not insert test task:', task.title, insertError);
        }
      }
      console.log('Test tasks created');
    } else {
      console.log('Tasks table not found, skipping task creation');
    }

    console.log('Test data creation completed');
    return true;
  } catch (error) {
    console.error('Error creating test data:', error);
    return false;
  }
};

// Clear test data
export const clearTestData = async () => {
  try {
    console.log('Clearing test data...');

    // Clear test tasks
    const { error: taskError } = await supabase
      .from('tasks')
      .delete()
      .in('created_by', ['11111111-1111-1111-1111-111111111111']);

    if (taskError) {
      console.warn('Could not clear test tasks:', taskError);
    }

    // Clear test users
    const { error: userError } = await supabase
      .from('user_profiles')
      .delete()
      .in('id', [
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
        '33333333-3333-3333-3333-333333333333'
      ]);

    if (userError) {
      console.warn('Could not clear test users:', userError);
    }

    console.log('Test data cleared');
    return true;
  } catch (error) {
    console.error('Error clearing test data:', error);
    return false;
  }
};

// Get database statistics
export const getDatabaseStats = async () => {
  try {
    const stats = {};

    // Count complaints
    const { count: complaintsCount, error: complaintsError } = await supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true });

    if (!complaintsError) {
      stats.complaints = complaintsCount;
    }

    // Count user profiles if table exists
    const { count: usersCount, error: usersError } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });

    if (!usersError) {
      stats.users = usersCount;
    }

    // Count tasks if table exists
    const { count: tasksCount, error: tasksError } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true });

    if (!tasksError) {
      stats.tasks = tasksCount;
    }

    return stats;
  } catch (error) {
    console.error('Error getting database stats:', error);
    return {};
  }
};

// Test authentication
export const testAuth = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Auth test failed:', error);
      return false;
    }

    console.log('Current user:', user ? user.email : 'Not logged in');
    return true;
  } catch (error) {
    console.error('Auth test error:', error);
    return false;
  }
};

// Helper function to format Indian names and text
export const formatIndianText = (text) => {
  if (!text) return '';
  return text.trim();
};

// Helper function to format phone numbers
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Format as +91 XXXXX XXXXX
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  } else if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  
  return phone;
};

// Helper function to get priority color
export const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'text-red-600 bg-red-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'low':
      return 'text-green-600 bg-green-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

// Helper function to get status color
export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
    case 'pending assignment':
      return 'text-orange-600 bg-orange-100';
    case 'assigned':
      return 'text-blue-600 bg-blue-100';
    case 'in progress':
      return 'text-purple-600 bg-purple-100';
    case 'completed':
    case 'resolved':
      return 'text-green-600 bg-green-100';
    case 'closed':
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export default {
  testConnection,
  createTestData,
  clearTestData,
  getDatabaseStats,
  testAuth,
  formatIndianText,
  formatPhoneNumber,
  getPriorityColor,
  getStatusColor
};