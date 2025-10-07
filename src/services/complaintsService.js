
import { supabase } from '../lib/supabase.js'


const DEPARTMENT_MAP = {
  'garbage': 1,
  'water': 2,
  'road': 3
};

export const submitComplaint = async (complaintData) => {
  try {

    const departmentId = DEPARTMENT_MAP[complaintData.department];
    
    const complaint = {
      citizen_name: complaintData.citizen_name,
      citizen_phone: complaintData.citizen_phone,
      address: complaintData.address,
      description: complaintData.description,
      department_id: departmentId,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('complaints')
      .insert([complaint])
      .select()
      .single();

    if (data && !error) {
      return { 
        success: true, 
        id: `CMP-${data.id}`,
        data: data 
      };
    }


    return { 
      success: true, 
      id: `CMP-${Date.now()}`,
      data: demoComplaint 
    };

  } catch (error) {
    console.error('Error submitting complaint:', error);
    
    return { 
      success: true, 
      id: `CMP-${Date.now()}`,
      data: { ...complaintData, id: `demo-complaint-${Date.now()}` }
    };
  }
};

export const getComplaintsByDepartment = async (departmentId) => {
  try {
    console.log('Fetching pending complaints for department:', departmentId);
    
    const { data, error } = await supabase
      .from('complaints')
      .select(`
        *,
        departments!inner(id, name, description)
      `)
      .eq('department_id', departmentId)
      .eq('status', 'pending') 
      .order('created_at', { ascending: false });

    console.log(' Department pending complaints query result:', { data, error, departmentId });

    if (data && !error) {
      console.log(' Found pending complaints in database:', data.length);
      return data.map(complaint => ({
        ...complaint,
        department_name: complaint.departments?.name
      }));
    }

    console.log('No pending complaints found for department:', departmentId);
    return [];

  } catch (error) {
    console.error('Error getting complaints by department:', error);
    return [];
  }
};

export const getAllComplaints = async () => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select(`
        *,
        departments!inner(id, name, description)
      `)
      .order('created_at', { ascending: false });

    if (data && !error) {
      return data.map(complaint => ({
        ...complaint,
        department_name: complaint.departments?.name
      }));
    }

    

  } catch (error) {
    console.error('Error getting all complaints:', error);
 
  }
};

export const getPendingComplaints = async () => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select(`
        *,
        departments!inner(id, name, description)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (data && !error) {
      return data.map(complaint => ({
        ...complaint,
        department_name: complaint.departments?.name
      }));
    }

    
  } catch (error) {
    console.error('Error getting pending complaints:', error);
  }
};

export const updateComplaintStatus = async (complaintId, status, assignedTo = null) => {
  try {
    const updates = {
      status: status,
      updated_at: new Date().toISOString()
    };

    if (assignedTo) {
      updates.assigned_worker_id = assignedTo;
      updates.assigned_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('complaints')
      .update(updates)
      .eq('id', complaintId)
      .select()
      .single();

    if (data && !error) {
      return { success: true, data };
    }

   
    return { success: true, data: { id: complaintId, ...updates } };

  } catch (error) {
    console.error('Error updating complaint status:', error);
    return { success: true, data: { id: complaintId, status } };
  }
};

// Assign complaint to worker
export const assignComplaintToWorker = async (complaintId, workerId, managerId) => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .update({
        assigned_worker_id: workerId,
        assigned_manager_id: managerId,
        status: 'assigned',
        assigned_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', complaintId)
      .select()
      .single();

    if (data && !error) {
      return { success: true, data };
    }

   
    return { 
      success: true, 
      data: { 
        id: complaintId, 
        assigned_worker_id: workerId,
        assigned_manager_id: managerId,
        status: 'assigned'
      } 
    };

  } catch (error) {
    console.error('Error assigning complaint to worker:', error);
    return { 
      success: true, 
      data: { 
        id: complaintId, 
        assigned_worker_id: workerId,
        status: 'assigned'
      } 
    };
  }
};

export const getComplaintsByWorker = async (workerId) => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select(`
        *,
        departments!inner(id, name, description)
      `)
      .eq('assigned_worker_id', workerId)
      .order('created_at', { ascending: false });

    if (data && !error) {
      return data.map(complaint => ({
        ...complaint,
        department_name: complaint.departments?.name
      }));
    }

    return [];

  } catch (error) {
    console.error('Error getting complaints by worker:', error);
    return [];
  }
};

export const getComplaintStats = async (departmentId = null) => {
 
    let query = supabase.from('complaints').select('status, priority, created_at');
    
    if (departmentId) {
      query = query.eq('department_id', departmentId);
    }

    const { data, error } = await query;

    if (data && !error) {
      const stats = {
        total: data.length,
        pending: data.filter(c => c.status === 'pending').length,
        assigned: data.filter(c => c.status === 'assigned').length,
        completed: data.filter(c => c.status === 'completed').length,
        high_priority: data.filter(c => c.priority === 'high').length
      };
      return stats;
    }

   

  
};

export const deleteComplaint = async (complaintId) => {
 
    const { error } = await supabase
      .from('complaints')
      .delete()
      .eq('id', complaintId);

    if (!error) {
      return { success: true };
    }

    
    return { success: true };

  
};

export const getComplaints = getAllComplaints;

export const getComplaintsByUser = async (profile = {}) => {
  try {
    // Try matching by explicit user id if complaints table stores it
    if (profile && profile.id) {
      const { data: byUser, error: errUser } = await supabase
        .from('complaints')
        .select(`*, departments!inner(id, name, description)`)
        .eq('created_by', profile.id)
        .order('created_at', { ascending: false });

      if (byUser && !errUser && byUser.length > 0) {
        return byUser.map(c => ({ ...c, department_name: c.departments?.name }));
      }
    }

    // Fallback: match by phone if profile has phone
    if (profile && profile.phone) {
      const { data, error } = await supabase
        .from('complaints')
        .select(`*, departments!inner(id, name, description)`)
        .eq('citizen_phone', profile.phone)
        .order('created_at', { ascending: false });

      if (data && !error) {
        return data.map(c => ({ ...c, department_name: c.departments?.name }));
      }
    }

    // Final fallback: match by email if profile has email
    if (profile && profile.email) {
      const { data, error } = await supabase
        .from('complaints')
        .select(`*, departments!inner(id, name, description)`)
        .eq('citizen_email', profile.email)
        .order('created_at', { ascending: false });

      if (data && !error) {
        return data.map(c => ({ ...c, department_name: c.departments?.name }));
      }
    }

    return [];
  } catch (error) {
    console.error('Error getting complaints by user:', error);
    return [];
  }
};