-- ========================================================
-- TUMALIUAN EMS / STRIDEON - COMPLETE SUPABASE DATABASE SCHEMA
-- Instructions: Copy and paste this script directly into the 
-- Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- and click "RUN".
-- ========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- 2. USERS TABLE (Email Verification & Account Activation)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    verification_code TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'inactive', 'locked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- --------------------------------------------------------
-- 3. DEPARTMENTS TABLE
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
-- 4. DEPARTMENT MANAGERS TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.department_managers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    manager_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    role TEXT DEFAULT 'Department Manager',
    department_name TEXT DEFAULT 'Creative & Design',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    avatar_url TEXT DEFAULT '/assets/avatar-aaron.png',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- --------------------------------------------------------
-- 5. EMPLOYEES TABLE
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL,
    department_name TEXT DEFAULT 'Product & Specialist',
    manager_name TEXT DEFAULT 'Marcus Vance',
    employment_type TEXT DEFAULT 'Full-Time' CHECK (employment_type IN ('Full-Time', 'Part-Time', 'Contract', 'Intern')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'inactive', 'on_leave')),
    phone TEXT,
    join_date DATE DEFAULT CURRENT_DATE,
    avatar_url TEXT DEFAULT '/assets/avatar-aaron.png',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- --------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- Enables unrestricted read & write for Anon / Web Application
-- --------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Users Table Policies
DROP POLICY IF EXISTS "Allow public full access on users" ON public.users;
CREATE POLICY "Allow public full access on users" ON public.users
    FOR ALL USING (true) WITH CHECK (true);

-- Departments Table Policies
DROP POLICY IF EXISTS "Allow public full access on departments" ON public.departments;
CREATE POLICY "Allow public full access on departments" ON public.departments
    FOR ALL USING (true) WITH CHECK (true);

-- Department Managers Table Policies
DROP POLICY IF EXISTS "Allow public full access on department_managers" ON public.department_managers;
CREATE POLICY "Allow public full access on department_managers" ON public.department_managers
    FOR ALL USING (true) WITH CHECK (true);

-- Employees Table Policies
DROP POLICY IF EXISTS "Allow public full access on employees" ON public.employees;
CREATE POLICY "Allow public full access on employees" ON public.employees
    FOR ALL USING (true) WITH CHECK (true);

-- --------------------------------------------------------
-- 7. INITIAL SEED DATA
-- --------------------------------------------------------

-- Insert Departments
INSERT INTO public.departments (name, code, description)
VALUES 
    ('Creative & Design', 'DES', 'Brand identity, UI/UX, product visuals, and advertising design'),
    ('Product & Specialist', 'PROD', 'Product strategy, specifications, inventory, and market release'),
    ('Human Resources', 'HR', 'Talent acquisition, employee management, and benefits')
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description;

-- Insert Department Managers (Aaron Tumaliuan as Department Manager)
INSERT INTO public.department_managers (manager_id, name, email, phone, role, department_name, status)
VALUES 
    (
        'MGR-2026-101', 
        'Aaron Tumaliuan', 
        'tumaliuanaaron199@gmail.com', 
        '+63 920 444 9904', 
        'Creative Director & Design Department Manager', 
        'Creative & Design', 
        'active'
    ),
    (
        'MGR-2026-102', 
        'Marcus Vance', 
        'marcus.vance@strideon.com', 
        '+63 918 987 6543', 
        'Head of Product Management', 
        'Product & Specialist', 
        'active'
    )
ON CONFLICT (manager_id) DO UPDATE 
SET name = EXCLUDED.name, 
    email = EXCLUDED.email, 
    role = EXCLUDED.role, 
    department_name = EXCLUDED.department_name;

-- Insert Employees (Red Reyes as Employee)
INSERT INTO public.employees (
    employee_id, name, email, role, department_name, 
    manager_name, employment_type, status, phone
)
VALUES 
    (
        'EMP-2026-815',
        'Red Reyes',
        'tumaliuanron@gmail.com',
        'Product Specialist',
        'Product & Specialist',
        'Marcus Vance',
        'Full-Time',
        'pending',
        '+63 995 888 8815'
    )
ON CONFLICT (employee_id) DO UPDATE 
SET name = EXCLUDED.name, 
    email = EXCLUDED.email, 
    status = EXCLUDED.status;

-- Insert Initial User Record for Activation System
INSERT INTO public.users (name, email, verification_code, status)
VALUES 
    ('Aaron Tumaliuan', 'tumaliuanaaron199@gmail.com', '', 'active'),
    ('Red Reyes', 'tumaliuanron@gmail.com', '', 'pending')
ON CONFLICT (email) DO UPDATE 
SET name = EXCLUDED.name;
