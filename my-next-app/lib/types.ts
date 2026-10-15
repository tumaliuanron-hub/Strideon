export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DepartmentManager {
  id: string;
  manager_id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  department_id?: string;
  department_name?: string;
  status: "active" | "inactive" | "on_leave";
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Employee {
  id: string;
  employee_id: string;
  name: string;
  email: string;
  role: string;
  department_id?: string;
  department_name?: string;
  manager_id?: string;
  manager_name?: string;
  employment_type: "Full-Time" | "Part-Time" | "Contract" | "Intern";
  status: "active" | "pending" | "inactive" | "on_leave";
  phone?: string;
  join_date?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseUser {
  id?: string;
  name: string;
  email: string;
  status: "pending" | "active";
  verification_code?: string;
  code?: string;
  employee_id?: string;
}
