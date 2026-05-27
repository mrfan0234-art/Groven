export interface Service {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  description?: string;
  features?: string[];
  duration?: string;
  complexityScore?: number;
}

export interface ClientInquiry {
  id?: string;
  service_type: string;
  design_preference: string;
  budget_range: string;
  timeline: string;
  contact_name: string;
  contact_email: string;
  company_name?: string;
  project_notes?: string;
  status: 'In Review' | 'Blueprint Phase' | 'Engineering' | 'Deploying' | 'Completed';
  created_at?: string;
}
