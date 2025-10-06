
import { supabase } from '../lib/supabase.js'

export const assignTask = async (taskData) => {
  
    console.log(' Assigning task with data:', taskData);
    
    const task = {
      complaint_id: taskData.complaint_id,
      assigned_by: taskData.assigned_by,
      assigned_to: taskData.assigned_to,
      department_id: taskData.department_id,
      title: taskData.title,
      description: taskData.description,
      status: 'pending',
      priority: taskData.priority || 'medium',
      created_at: new Date().toISOString()
    };

    console.log(' Task object prepared:', task);


    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select(`
        *,
        assigned_by_profile:user_profiles!tasks_assigned_by_fkey(name),
        assigned_to_profile:user_profiles!tasks_assigned_to_fkey(name)
      `)
      .single();

    console.log(' Database response:', { data, error });

    if (data && !error) {
      const { error: complaintError } = await supabase
        .from('complaints')
        .update({ 
          status: 'assigned',
          assigned_worker_id: taskData.assigned_to,
          assigned_manager_id: taskData.assigned_by,
          assigned_at: new Date().toISOString()
        })
        .eq('id', taskData.complaint_id);
      
  
      return {
        success: true,
        data: {
          ...data,
          assigned_by_name: data.assigned_by_profile?.name,
          assigned_to_name: data.assigned_to_profile?.name
        }
      };
    }

    if (error) {
      console.error(' Database error:', error);
    }

   
    
   

  
};

export const getTasksByManager = async (managerId) => {

   
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_by_profile:user_profiles!tasks_assigned_by_fkey(name),
        assigned_to_profile:user_profiles!tasks_assigned_to_fkey(name),
        complaints(citizen_name, description, address)
      `)
      .eq('assigned_by', managerId)
      .order('created_at', { ascending: false });

    if (data && !error) {
      return data.map(task => ({
        ...task,
        assigned_by_name: task.assigned_by_profile?.name,
        assigned_to_name: task.assigned_to_profile?.name
      }));
    }

    
};

export const getTasksByWorker = async (workerId) => {
  
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_by_profile:user_profiles!tasks_assigned_by_fkey(name),
        assigned_to_profile:user_profiles!tasks_assigned_to_fkey(name),
        complaints(citizen_name, description, address, citizen_phone)
      `)
      .eq('assigned_to', workerId)
      .order('created_at', { ascending: false });

    if (data && !error) {
      return data.map(task => ({
        ...task,
        assigned_by_name: task.assigned_by_profile?.name,
        assigned_to_name: task.assigned_to_profile?.name
      }));
    }

    
};

export const getTasksByDepartment = async (departmentId) => {

    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_by_profile:user_profiles!tasks_assigned_by_fkey(name),
        assigned_to_profile:user_profiles!tasks_assigned_to_fkey(name),
        complaints(citizen_name, description, address)
      `)
      .eq('department_id', departmentId)
      .order('created_at', { ascending: false });

    if (data && !error) {
      return data.map(task => ({
        ...task,
        assigned_by_name: task.assigned_by_profile?.name,
        assigned_to_name: task.assigned_to_profile?.name
      }));
    }

   
};

// Update task status by worker
export const updateTaskStatus = async (taskId, newStatus, workerId) => {

    
    const updateData = {
      status: newStatus,
      updated_at: new Date().toISOString()
    };
    
    // If completing task, add completed timestamp
    if (newStatus === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
      .eq('assigned_to', workerId) 
      .select(`
        *,
        assigned_by_profile:user_profiles!tasks_assigned_by_fkey(name),
        assigned_to_profile:user_profiles!tasks_assigned_to_fkey(name),
        complaints(citizen_name, description, address, citizen_phone)
      `)
      .single();

   

    if (data && !error) {
     
      if (newStatus === 'completed') {
        await supabase
          .from('complaints')
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', data.complaint_id);
      } else if (newStatus === 'in-progress') {
        await supabase
          .from('complaints')
          .update({ status: 'in-progress' })
          .eq('id', data.complaint_id);
      }
      
      return {
        success: true,
        data: {
          ...data,
          assigned_by_name: data.assigned_by_profile?.name,
          assigned_to_name: data.assigned_to_profile?.name
        }
      };
    } else {
     
      throw new Error(error?.message || 'Failed to update task status');
    }

 
};

//Admin view
export const getAllTasks = async () => {

    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assigned_by_profile:user_profiles!tasks_assigned_by_fkey(name),
        assigned_to_profile:user_profiles!tasks_assigned_to_fkey(name),
        complaints(citizen_name, description, address),
        departments(name)
      `)
      .order('created_at', { ascending: false });

    if (data && !error) {
      return data.map(task => ({
        ...task,
        assigned_by_name: task.assigned_by_profile?.name,
        assigned_to_name: task.assigned_to_profile?.name,
        department_name: task.departments?.name
      }));
    }

 
};

export const getTaskStats = async (departmentId = null, managerId = null) => {
 
    let query = supabase.from('tasks').select('status, priority, created_at');
    
    if (departmentId) {
      query = query.eq('department_id', departmentId);
    }
    
    if (managerId) {
      query = query.eq('assigned_by', managerId);
    }

    const { data, error } = await query;

    if (data && !error) {
      return {
        total: data.length,
        pending: data.filter(t => t.status === 'pending').length,
        in_progress: data.filter(t => t.status === 'in-progress').length,
        completed: data.filter(t => t.status === 'completed').length,
        high_priority: data.filter(t => t.priority === 'high').length
      };
    }

   
    

  
};

export const createTask = async (taskData) => {

    const task = {
      assigned_by: taskData.assigned_by,
      assigned_to: taskData.assigned_to,
      department_id: taskData.department_id,
      title: taskData.title,
      description: taskData.description,
      status: 'pending',
      priority: taskData.priority || 'medium',
      due_date: taskData.due_date,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();

    if (data && !error) {
      return { success: true, data };
    }

   
};


export const getTasks = getAllTasks;