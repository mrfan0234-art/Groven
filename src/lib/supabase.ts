import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

// Initialize connection safely with fallback
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL');

// Only instantiate if configured to avoid throwing initialization errors
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface ProjectInquiry {
  id?: string;
  user_id?: string;
  service_type: string;
  design_preference: string;
  budget_range: string;
  timeline: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  company_name?: string;
  project_notes?: string;
  status: 'In Review' | 'Blueprint Phase' | 'Engineering' | 'Deploying' | 'Completed';
  created_at?: string;
}

// In-memory/localStorage mock database to support the preview when Supabase is not configured yet
const getMockData = <T>(key: string, defaultVal: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const saveMockData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
};

export const dbService = {
  // --- AUTH SERVICES ---
  async signUp(email: string, password: string, fullName: string) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (error) throw error;
      return data;
    } else {
      // Mock SignUp
      const users = getMockData<{ email: string; fullName: string; id: string }[]>('groven_mock_users', []);
      if (users.some(u => u.email === email)) {
        throw new Error('An account with this email already exists in mock persistence.');
      }
      const newUser = { id: `usr_${Math.random().toString(36).substr(2, 9)}`, email, fullName };
      users.push(newUser);
      saveMockData('groven_mock_users', users);
      saveMockData('groven_current_user', newUser);
      return { user: { id: newUser.id, email: newUser.email, user_metadata: { full_name: newUser.fullName } } };
    }
  },

  async signIn(email: string, password: string) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } else {
      // Mock SignIn
      const users = getMockData<{ email: string; fullName: string; id: string }[]>('groven_mock_users', []);
      const user = users.find(u => u.email === email);
      if (!user) {
        throw new Error('Invalid email or password under local fallback. (Pro-tip: Sign up an account first!)');
      }
      saveMockData('groven_current_user', user);
      return { user: { id: user.id, email: user.email, user_metadata: { full_name: user.fullName } } };
    }
  },

  async signOut() {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } else {
      localStorage.removeItem('groven_current_user');
    }
  },

  async getCurrentUser() {
    if (isSupabaseConfigured && supabase) {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) return null;
      return user;
    } else {
      const curUser = getMockData<{ email: string; fullName: string; id: string } | null>('groven_current_user', null);
      if (!curUser) return null;
      return {
        id: curUser.id,
        email: curUser.email,
        user_metadata: {
          full_name: curUser.fullName
        }
      };
    }
  },

  // --- PROJECT INQUIRY SERVICES ---
  async submitInquiry(inquiry: Omit<ProjectInquiry, 'status' | 'created_at'>): Promise<ProjectInquiry> {
    const freshInquiry: ProjectInquiry = {
      ...inquiry,
      status: 'In Review',
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const user = await this.getCurrentUser();
      const payload = {
        ...freshInquiry,
        user_id: user?.id || null,
      };
      
      const { data, error } = await supabase
        .from('inquiries')
        .insert([payload])
        .select();

      if (error) throw error;
      return data[0] as ProjectInquiry;
    } else {
      // Mock submit
      const user = await this.getCurrentUser();
      const inquiries = getMockData<ProjectInquiry[]>('groven_inquiries', []);
      const id = `inq_${Math.random().toString(36).substr(2, 9)}`;
      const savedInquiry: ProjectInquiry = {
        ...freshInquiry,
        id,
        user_id: user?.id,
      };
      inquiries.push(savedInquiry);
      saveMockData('groven_inquiries', inquiries);
      return savedInquiry;
    }
  },

  async getMyInquiries(): Promise<ProjectInquiry[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ProjectInquiry[];
    } else {
      // Mock get inquiries belonging to authenticated or mock current user
      const inquiries = getMockData<ProjectInquiry[]>('groven_inquiries', []);
      return inquiries
        .filter(inq => inq.user_id === user.id)
        .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
    }
  }
};
