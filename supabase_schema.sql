-- ========================================================
-- STRIDEON EMPLOYEE MANAGEMENT SYSTEM (EMS) SCHEMA
-- Tables: Departments, Department Managers, Employees
-- ========================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- 1. DEPARTMENTS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- --------------------------------------------------------
-- 2. DEPARTMENT MANAGERS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.department_managers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    manager_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    role TEXT DEFAULT 'Department Manager',
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    department_name TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    avatar_url TEXT DEFAULT '/assets/avatar-aaron.png',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- --------------------------------------------------------
-- 3. EMPLOYEES TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    department_name TEXT,
    manager_id UUID REFERENCES public.department_managers(id) ON DELETE SET NULL,
    manager_name TEXT,
    employment_type TEXT DEFAULT 'Full-Time' CHECK (employment_type IN ('Full-Time', 'Part-Time', 'Contract', 'Intern')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'inactive', 'on_leave')),
    phone TEXT,
    join_date DATE DEFAULT CURRENT_DATE,
    avatar_url TEXT DEFAULT '/assets/avatar-aaron.png',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- --------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- Enable access for publishable/anon key
-- --------------------------------------------------------
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Departments Policy
DROP POLICY IF EXISTS "Allow public full access on departments" ON public.departments;
CREATE POLICY "Allow public full access on departments" ON public.departments
    FOR ALL USING (true) WITH CHECK (true);

-- Department Managers Policy
DROP POLICY IF EXISTS "Allow public full access on department_managers" ON public.department_managers;
CREATE POLICY "Allow public full access on department_managers" ON public.department_managers
    FOR ALL USING (true) WITH CHECK (true);

-- Employees Policy
DROP POLICY IF EXISTS "Allow public full access on employees" ON public.employees;
CREATE POLICY "Allow public full access on employees" ON public.employees
    FOR ALL USING (true) WITH CHECK (true);

-- --------------------------------------------------------
-- 5. INITIAL SEED DATA
-- Insert initial departments, managers, and employees
-- --------------------------------------------------------

-- Insert Departments
INSERT INTO public.departments (name, code, description)
VALUES 
    ('Creative & Design', 'DES', 'Brand identity, UI/UX, product visuals, and advertising design'),
    ('Product & Specialist', 'PROD', 'Product strategy, specifications, inventory, and market release'),
    ('Human Resources', 'HR', 'Talent acquisition, employee management, and benefits')
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description;

-- Insert Department Managers
DO $$
DECLARE
    des_dept_id UUID;
    prod_dept_id UUID;
    mgr_des_id UUID;
    mgr_prod_id UUID;
BEGIN
    SELECT id INTO des_dept_id FROM public.departments WHERE code = 'DES' LIMIT 1;
    SELECT id INTO prod_dept_id FROM public.departments WHERE code = 'PROD' LIMIT 1;

    -- Manager 1: Victoria Mendoza (Design)
    INSERT INTO public.department_managers (manager_id, name, email, phone, role, department_id, department_name, status)
    VALUES (
        'MGR-2026-101', 
        'Victoria Mendoza', 
        'victoria.mendoza@strideon.com', 
        '+63 917 123 4567', 
        'Creative Director & Design Manager', 
        des_dept_id, 
        'Creative & Design', 
        'active'
    )
    ON CONFLICT (manager_id) DO UPDATE 
    SET department_id = EXCLUDED.department_id, department_name = EXCLUDED.department_name
    RETURNING id INTO mgr_des_id;

    -- Manager 2: Marcus Vance (Product)
    INSERT INTO public.department_managers (manager_id, name, email, phone, role, department_id, department_name, status)
    VALUES (
        'MGR-2026-102', 
        'Marcus Vance', 
        'marcus.vance@strideon.com', 
        '+63 918 987 6543', 
        'Head of Product Management', 
        prod_dept_id, 
        'Product & Specialist', 
        'active'
    )
    ON CONFLICT (manager_id) DO UPDATE 
    SET department_id = EXCLUDED.department_id, department_name = EXCLUDED.department_name
    RETURNING id INTO mgr_prod_id;

    -- Employee 1: Red Reyes
    INSERT INTO public.employees (
        employee_id, name, email, role, department_id, department_name, 
        manager_id, manager_name, employment_type, status, phone
    )
    VALUES (
        'EMP-2026-815',
        'Red Reyes',
        'tumaliuanron@gmail.com',
        'Product Specialist',
        prod_dept_id,
        'Product & Specialist',
        mgr_prod_id,
        'Marcus Vance',
        'Full-Time',
        'pending',
        '+63 995 888 8815'
    )
    ON CONFLICT (employee_id) DO UPDATE 
    SET department_id = EXCLUDED.department_id, 
        manager_id = EXCLUDED.manager_id,
        manager_name = EXCLUDED.manager_name;

    -- Employee 2: Aaron Tumaliuan
    INSERT INTO public.employees (
        employee_id, name, email, role, department_id, department_name, 
        manager_id, manager_name, employment_type, status, phone
    )
    VALUES (
        'EMP-2026-904',
        'Aaron Tumaliuan',
        'aaron.tumaliuan@gmail.com',
        'Graphic Designer',
        des_dept_id,
        'Creative & Design',
        mgr_des_id,
        'Victoria Mendoza',
        'Full-Time',
        'active',
        '+63 920 444 9904'
    )
    ON CONFLICT (employee_id) DO UPDATE 
    SET department_id = EXCLUDED.department_id, 
        manager_id = EXCLUDED.manager_id,
        manager_name = EXCLUDED.manager_name;
END $$;
