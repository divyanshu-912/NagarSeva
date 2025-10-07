
import { supabase } from '../lib/supabase.js'

export const loginUser = async (identifier, password) => {

   
    const { data: userProfile, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        departments!inner(id, name, description)
      `)
      .or(`email.eq.${identifier},username.eq.${identifier}`)
      .single();


    if (userProfile && !error) {
      if (userProfile.password === 'password' || userProfile.password === password) {
   
        
        const loginData = {
          user: {
            id: userProfile.id,
            email: userProfile.email,
            created_at: userProfile.created_at
          },
          profile: {
            ...userProfile,
            department_name: userProfile.departments?.name,
            department_id: userProfile.departments?.id || userProfile.department_id
          }
        };
        
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(loginData));
        return loginData;
      } else {
        console.log('Password mismatch');
        throw new Error('Invalid password');
      }
    }

    console.log(' User not found in database');
    throw new Error('User not found');

 
};

export const getCurrentUser = async () => {
  
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      return {
        user: parsed.user,
        profile: parsed.profile
      };
    }
    // If no user in localStorage, seed a dummy user for development/testing
    try {
      if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production') {
        return { user: null, profile: null };
      }
    } catch (e) {
      // ignore and proceed to seed in non-production or unknown env
    }

    const demoProfile = {
      id: 9999,
      username: 'demo.user',
      name: 'Demo User',
      email: 'demo.user@example.com',
      phone: '9999999999',
      department_id: 1,
      department_name: 'Waste Management',
      role: 'user',
      created_at: new Date().toISOString()
    };

  
    const loginData = { user: demoUser, profile: demoProfile };
    try {
      localStorage.setItem('user', JSON.stringify(loginData));
    } catch (e) {
      // ignore storage errors
    }

    return { user: demoUser, profile: demoProfile };
 
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('user');
  return { success: true };
};

//workers by department for manager
export const getWorkersByDepartment = async (managerId, departmentId) => {
  try {
    console.log(' Fetching workers for department:', departmentId);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('department_id', departmentId)
      .eq('role', 'worker');

    console.log(' Workers query result:', { data, error });

    if (data && !error) {
      console.log('Found workers in database:', data.length);
      return data;
    }

    console.log('No workers found in database for department:', departmentId);
    return [];

  } catch (error) {
    console.error(' Error fetching workers:', error);
    return [];
  }
};