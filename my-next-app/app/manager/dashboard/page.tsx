"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Clock,
  ClipboardList,
  CalendarDays,
  Megaphone,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  Search,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Calendar as CalendarIcon,
  Filter,
  Check,
  ChevronLeft,
  ChevronRight,
  User,
  Sliders,
  FileText,
  Building,
  MoreVertical,
  ArrowRight
} from "lucide-react";

// Types
type ManagerTab = "dashboard" | "employees" | "attendance" | "tasks" | "leave-requests" | "announcements" | "settings";

interface EmployeeRecord {
  id: string;
  name: string;
  department: string;
  position: string;
  email: string;
  status: "Active" | "On Leave" | "Inactive";
}

interface AttendanceRecord {
  id: string;
  employeeId: string;
  name: string;
  date: string;
  checkIn: string;
  checkOut: string;
  workHours: string;
  status: "Present" | "Late" | "Absent";
}

interface TaskRecord {
  id: string;
  title: string;
  assignedTo: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  status: "In Progress" | "To Do" | "Completed";
  progress: number;
}

interface LeaveRequestRecord {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  position: string;
  leavePeriod: string;
  leaveType: string;
  dateRequested: string;
  reason: string;
  attachments: number;
  status: "Pending" | "Approved" | "Rejected";
  managerNote?: string;
}

interface AnnouncementRecord {
  id: string;
  title: string;
  message: string;
  targetDepartment: string;
  priority: "Normal" | "High" | "Urgent" | "Low";
  publishDate: string;
  publishedAt: string;
  author: string;
}

const INITIAL_ANNOUNCEMENTS: AnnouncementRecord[] = [
  {
    id: "ann-1",
    title: "System Maintenance Notice",
    message: `Dear Team,

Please be informed that our system will undergo scheduled maintenance on October 18, 2026 (Sunday) from 12:00 AM to 4:00 AM.

During this time, some features may be temporarily unavailable. We apologize for any inconvenience this may cause.

Thank you for your understanding.

Best regards,
IT Department`,
    targetDepartment: "All Departments",
    priority: "Normal",
    publishDate: "September 07, 2026 11:00 AM",
    publishedAt: "October 12, 2026 10:00 AM",
    author: "IT Department",
  },
  {
    id: "ann-2",
    title: "Quarterly Performance Reviews",
    message: `Department heads and team leads are scheduled to complete staff evaluations for Q3 by next Friday. Please review your department employees list.`,
    targetDepartment: "All Departments",
    priority: "High",
    publishDate: "October 08, 2026 09:00 AM",
    publishedAt: "October 08, 2026 09:00 AM",
    author: "Human Resources",
  },
];

// Initial Mock Datasets strictly matching the user's mockups
const INITIAL_EMPLOYEES: EmployeeRecord[] = [
  { id: "EMP001", name: "Red Reyes", department: "Marketing", position: "Marketing Specialists", email: "rreyes@strideon.com", status: "Active" },
  { id: "EMP002", name: "Franz Fernando", department: "Design", position: "Graphic Designer", email: "fernando@strideon.com", status: "Active" },
  { id: "EMP003", name: "Elizehr Manlapat", department: "Sales", position: "Sales Associate", email: "elimnlpt@strideon.com", status: "Active" },
  { id: "EMP004", name: "Yanie Yabut", department: "Warehouse", position: "Warehouse Staff", email: "yabutyani@strideon.com", status: "Active" },
  { id: "EMP005", name: "Giemel Bernabe", department: "Finance", position: "Finance Assistant", email: "gmelb@strideon.com", status: "On Leave" },
  { id: "EMP006", name: "Jamel Banaga", department: "IT Support", position: "IT Support Specialist", email: "jmlb@strideon.com", status: "Active" },
  { id: "EMP007", name: "Gabrielle Ugaban", department: "Network", position: "Cloud Architect", email: "gabugab@strideon.com", status: "Active" },
  { id: "EMP008", name: "Lance Reyes", department: "Cybersecurity", position: "Security Analyst", email: "reyesef@strideon.com", status: "Inactive" },
  { id: "EMP009", name: "Michael Moran", department: "Software Development", position: "Backend Developer", email: "mich@strideon.com", status: "On Leave" },
  { id: "EMP010", name: "Dwane Obligar", department: "Network", position: "Network Engineer", email: "dwanie@strideon.com", status: "Inactive" },
  { id: "EMP011", name: "Sophia Alcantara", department: "Human Resources", position: "HR Specialist", email: "salcantara@strideon.com", status: "Active" },
  { id: "EMP012", name: "Marcus Villanueva", department: "Software Development", position: "Frontend Developer", email: "mvillanueva@strideon.com", status: "Active" },
  { id: "EMP013", name: "Bea Bianca Cruz", department: "Marketing", position: "Content Strategist", email: "bcruz@strideon.com", status: "Active" },
  { id: "EMP014", name: "Christian Dave Santos", department: "Operations", position: "Operations Coordinator", email: "csantos@strideon.com", status: "Active" },
  { id: "EMP015", name: "Alyssa Marie Torres", department: "Design", position: "UI/UX Designer", email: "atorres@strideon.com", status: "Active" },
  { id: "EMP016", name: "Paolo Miguel Ramos", department: "Finance", position: "Financial Analyst", email: "pramos@strideon.com", status: "Active" },
  { id: "EMP017", name: "Katrina Mae Diaz", department: "IT Support", position: "Technical Support Lead", email: "kdiaz@strideon.com", status: "Active" },
  { id: "EMP018", name: "Joshua Nathaniel Lim", department: "Network", position: "Systems Administrator", email: "jlim@strideon.com", status: "Active" },
  { id: "EMP019", name: "Andrea Nicole Castro", department: "Human Resources", position: "Talent Acquisition Lead", email: "acastro@strideon.com", status: "Active" },
  { id: "EMP020", name: "Kevin Angelo Gomez", department: "Software Development", position: "Full Stack Engineer", email: "kgomez@strideon.com", status: "Active" },
  { id: "EMP021", name: "Patricia Gail Mendoza", department: "Sales", position: "Account Executive", email: "pmendoza@strideon.com", status: "Active" },
  { id: "EMP022", name: "Dominic Rafael Soriano", department: "Warehouse", position: "Logistics Supervisor", email: "dsoriano@strideon.com", status: "Active" },
  { id: "EMP023", name: "Stephanie Claire Rivera", department: "Cybersecurity", position: "Security Engineer", email: "srivera@strideon.com", status: "Active" },
  { id: "EMP024", name: "Kenneth Roy Del Rosario", department: "Operations", position: "Process Quality Specialist", email: "kdelrosario@strideon.com", status: "Active" },
];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  { id: "att-1", employeeId: "EMP001", name: "Red Reyes", date: "August 24, 2026", checkIn: "8:02 AM", checkOut: "5:05 PM", workHours: "9 hrs 3 mins", status: "Present" },
  { id: "att-2", employeeId: "EMP002", name: "Franz Fernando", date: "August 24, 2026", checkIn: "8:15 AM", checkOut: "5:15 PM", workHours: "9 hrs", status: "Late" },
  { id: "att-3", employeeId: "EMP003", name: "Elizehr Manlapat", date: "August 24, 2026", checkIn: "8:02 AM", checkOut: "5:09 PM", workHours: "9 hrs 7 mins", status: "Present" },
  { id: "att-4", employeeId: "EMP004", name: "Yanie Yabut", date: "August 24, 2026", checkIn: "7:58 AM", checkOut: "4:52 PM", workHours: "8 hrs 54 mins", status: "Present" },
  { id: "att-5", employeeId: "EMP005", name: "Giemel Bernabe", date: "August 24, 2026", checkIn: "---", checkOut: "---", workHours: "No record", status: "Absent" },
  { id: "att-6", employeeId: "EMP006", name: "Jamel Banaga", date: "August 24, 2026", checkIn: "8:05 AM", checkOut: "5:01 PM", workHours: "8 hrs 56 mins", status: "Present" },
  { id: "att-7", employeeId: "EMP007", name: "Gabrielle Ugaban", date: "August 24, 2026", checkIn: "9:01 AM", checkOut: "5:19 PM", workHours: "8 hrs 18 mins", status: "Late" },
  { id: "att-8", employeeId: "EMP008", name: "Lance Reyes", date: "August 24, 2026", checkIn: "8:00 AM", checkOut: "5:00 PM", workHours: "9 hrs", status: "Present" },
  { id: "att-9", employeeId: "EMP009", name: "Michael Moran", date: "August 24, 2026", checkIn: "---", checkOut: "---", workHours: "No record", status: "Absent" },
  { id: "att-10", employeeId: "EMP010", name: "Dwane Obligar", date: "August 24, 2026", checkIn: "9:59 AM", checkOut: "5:00 PM", workHours: "7 hrs 1 min", status: "Late" },
  { id: "att-11", employeeId: "EMP011", name: "Sophia Alcantara", date: "August 24, 2026", checkIn: "7:55 AM", checkOut: "5:00 PM", workHours: "9 hrs 5 mins", status: "Present" },
  { id: "att-12", employeeId: "EMP012", name: "Marcus Villanueva", date: "August 24, 2026", checkIn: "8:00 AM", checkOut: "5:02 PM", workHours: "9 hrs 2 mins", status: "Present" },
  { id: "att-13", employeeId: "EMP013", name: "Bea Bianca Cruz", date: "August 24, 2026", checkIn: "7:50 AM", checkOut: "5:05 PM", workHours: "9 hrs 15 mins", status: "Present" },
  { id: "att-14", employeeId: "EMP014", name: "Christian Dave Santos", date: "August 24, 2026", checkIn: "7:45 AM", checkOut: "4:55 PM", workHours: "9 hrs 10 mins", status: "Present" },
  { id: "att-15", employeeId: "EMP015", name: "Alyssa Marie Torres", date: "August 24, 2026", checkIn: "8:01 AM", checkOut: "5:03 PM", workHours: "9 hrs 2 mins", status: "Present" },
  { id: "att-16", employeeId: "EMP016", name: "Paolo Miguel Ramos", date: "August 24, 2026", checkIn: "7:58 AM", checkOut: "5:00 PM", workHours: "9 hrs 2 mins", status: "Present" },
  { id: "att-17", employeeId: "EMP017", name: "Katrina Mae Diaz", date: "August 24, 2026", checkIn: "8:04 AM", checkOut: "5:08 PM", workHours: "9 hrs 4 mins", status: "Present" },
  { id: "att-18", employeeId: "EMP018", name: "Joshua Nathaniel Lim", date: "August 24, 2026", checkIn: "8:00 AM", checkOut: "5:01 PM", workHours: "9 hrs 1 min", status: "Present" },
  { id: "att-19", employeeId: "EMP019", name: "Andrea Nicole Castro", date: "August 24, 2026", checkIn: "7:52 AM", checkOut: "5:00 PM", workHours: "9 hrs 8 mins", status: "Present" },
  { id: "att-20", employeeId: "EMP020", name: "Kevin Angelo Gomez", date: "August 24, 2026", checkIn: "7:59 AM", checkOut: "5:05 PM", workHours: "9 hrs 6 mins", status: "Present" },
  { id: "att-21", employeeId: "EMP021", name: "Patricia Gail Mendoza", date: "August 24, 2026", checkIn: "8:02 AM", checkOut: "5:00 PM", workHours: "8 hrs 58 mins", status: "Present" },
  { id: "att-22", employeeId: "EMP022", name: "Dominic Rafael Soriano", date: "August 24, 2026", checkIn: "7:40 AM", checkOut: "4:48 PM", workHours: "9 hrs 8 mins", status: "Present" },
  { id: "att-23", employeeId: "EMP023", name: "Stephanie Claire Rivera", date: "August 24, 2026", checkIn: "7:56 AM", checkOut: "5:00 PM", workHours: "9 hrs 4 mins", status: "Present" },
  { id: "att-24", employeeId: "EMP024", name: "Kenneth Roy Del Rosario", date: "August 24, 2026", checkIn: "8:00 AM", checkOut: "5:00 PM", workHours: "9 hrs", status: "Present" },
];

const INITIAL_TASKS: TaskRecord[] = [
  { id: "task-1", title: "Prepare Marketing Material", assignedTo: "Red Reyes", priority: "High", dueDate: "Sept 07, 2026", status: "In Progress", progress: 40 },
  { id: "task-2", title: "Design Product Banner", assignedTo: "Franz Fernando", priority: "Medium", dueDate: "Sept 02, 2026", status: "In Progress", progress: 20 },
  { id: "task-3", title: "Monthly Sales Report", assignedTo: "Elizehr Manlapat", priority: "High", dueDate: "Aug 30, 2026", status: "To Do", progress: 0 },
  { id: "task-4", title: "Track Stock Levels", assignedTo: "Yanie Yabut", priority: "Low", dueDate: "Aug, 19 2026", status: "To Do", progress: 0 },
  { id: "task-5", title: "Manage payment terminals", assignedTo: "Giemel Bernabe", priority: "Medium", dueDate: "Sept 11, 2026", status: "To Do", progress: 0 },
  { id: "task-6", title: "Log asset assignments", assignedTo: "Jamel Banaga", priority: "Medium", dueDate: "Oct 09, 2026", status: "In Progress", progress: 60 },
  { id: "task-7", title: "Inventory Auditing", assignedTo: "Gabrielle Ugaban", priority: "Low", dueDate: "Aug 22, 2026", status: "Completed", progress: 100 },
  { id: "task-8", title: "Isolate untrusted gear", assignedTo: "Lance Reyes", priority: "High", dueDate: "Aug 28, 2026", status: "Completed", progress: 100 },
  { id: "task-9", title: "API Gateway Optimization", assignedTo: "Michael Moran", priority: "High", dueDate: "Sept 15, 2026", status: "In Progress", progress: 75 },
  { id: "task-10", title: "Onboarding Documentation", assignedTo: "Sophia Alcantara", priority: "Medium", dueDate: "Sept 18, 2026", status: "Completed", progress: 100 },
  { id: "task-11", title: "Dashboard UI Refactor", assignedTo: "Marcus Villanueva", priority: "High", dueDate: "Sept 22, 2026", status: "In Progress", progress: 55 },
  { id: "task-12", title: "Social Media Campaign Plan", assignedTo: "Bea Bianca Cruz", priority: "Medium", dueDate: "Sept 25, 2026", status: "To Do", progress: 0 },
  { id: "task-13", title: "Warehouse Dispatch Log Review", assignedTo: "Christian Dave Santos", priority: "Low", dueDate: "Sept 28, 2026", status: "Completed", progress: 100 },
  { id: "task-14", title: "Mobile App Wireframing", assignedTo: "Alyssa Marie Torres", priority: "High", dueDate: "Oct 02, 2026", status: "In Progress", progress: 35 },
  { id: "task-15", title: "Q3 Expense Reconciliation", assignedTo: "Paolo Miguel Ramos", priority: "High", dueDate: "Oct 05, 2026", status: "To Do", progress: 0 },
  { id: "task-16", title: "Helpdesk Ticket Resolution", assignedTo: "Katrina Mae Diaz", priority: "Medium", dueDate: "Oct 08, 2026", status: "Completed", progress: 100 },
  { id: "task-17", title: "Server Rack Wiring Audit", assignedTo: "Joshua Nathaniel Lim", priority: "Medium", dueDate: "Oct 12, 2026", status: "To Do", progress: 0 },
  { id: "task-18", title: "Technical Recruitment Screening", assignedTo: "Andrea Nicole Castro", priority: "Low", dueDate: "Oct 14, 2026", status: "In Progress", progress: 45 },
  { id: "task-19", title: "Database Migration Script", assignedTo: "Kevin Angelo Gomez", priority: "High", dueDate: "Oct 16, 2026", status: "To Do", progress: 0 },
  { id: "task-20", title: "Client Acquisition Presentation", assignedTo: "Patricia Gail Mendoza", priority: "Medium", dueDate: "Oct 20, 2026", status: "In Progress", progress: 80 },
  { id: "task-21", title: "Safety Equipment Inspection", assignedTo: "Dominic Rafael Soriano", priority: "Low", dueDate: "Oct 22, 2026", status: "Completed", progress: 100 },
  { id: "task-22", title: "Firewall Penetration Testing", assignedTo: "Stephanie Claire Rivera", priority: "High", dueDate: "Oct 25, 2026", status: "In Progress", progress: 65 },
  { id: "task-23", title: "Standard Operating Procedures Update", assignedTo: "Kenneth Roy Del Rosario", priority: "Medium", dueDate: "Oct 28, 2026", status: "To Do", progress: 0 },
  { id: "task-24", title: "Router Firmware Upgrade", assignedTo: "Dwane Obligar", priority: "High", dueDate: "Nov 02, 2026", status: "Completed", progress: 100 },
];

const INITIAL_LEAVE_REQUESTS: LeaveRequestRecord[] = [
  { id: "leave-1", employeeId: "EMP001", name: "Red Reyes", department: "Marketing", position: "Marketing Specialists", leavePeriod: "October 07 - 10, 2026", leaveType: "Vacation", dateRequested: "September 29, 2026", reason: "Family Vacation", attachments: 0, status: "Pending" },
  { id: "leave-2", employeeId: "EMP002", name: "Franz Fernando", department: "Design", position: "Graphic Designer", leavePeriod: "September 04, 2026", leaveType: "Sick Leave", dateRequested: "September 03, 2026", reason: "Fever", attachments: 0, status: "Pending" },
  { id: "leave-3", employeeId: "EMP003", name: "Elizehr Manlapat", department: "Sales", position: "Sales Associate", leavePeriod: "September 06 - 07, 2026", leaveType: "Personal", dateRequested: "September 01, 2026", reason: "Personal Matters", attachments: 0, status: "Approved" },
  { id: "leave-4", employeeId: "EMP004", name: "Yanie Yabut", department: "Warehouse", position: "Warehouse Staff", leavePeriod: "August 16, 2026", leaveType: "Sick Leave", dateRequested: "August 15, 2026", reason: "Not Feeling Well", attachments: 0, status: "Approved" },
  { id: "leave-5", employeeId: "EMP005", name: "Giemel Bernabe", department: "Finance", position: "Finance Assistant", leavePeriod: "September 28 - 31, 2026", leaveType: "Vacation", dateRequested: "September 20, 2026", reason: "Out of Town", attachments: 0, status: "Rejected" },
  { id: "leave-6", employeeId: "EMP006", name: "Jamel Banaga", department: "IT Support", position: "IT Support Specialist", leavePeriod: "August 19, 2026", leaveType: "Personal", dateRequested: "August 18, 2026", reason: "Family Emergency", attachments: 0, status: "Approved" },
  { id: "leave-7", employeeId: "EMP007", name: "Gabrielle Ugaban", department: "Network", position: "Cloud Architect", leavePeriod: "September 09, 2026", leaveType: "Personal", dateRequested: "September 05, 2026", reason: "Medical Check Up", attachments: 0, status: "Approved" },
  { id: "leave-8", employeeId: "EMP008", name: "Lance Reyes", department: "Cybersecurity", position: "Security Analyst", leavePeriod: "November 18 - 22, 2026", leaveType: "Vacation", dateRequested: "October 10, 2026", reason: "Reunion", attachments: 0, status: "Pending" },
  { id: "leave-9", employeeId: "EMP011", name: "Sophia Alcantara", department: "Human Resources", position: "HR Specialist", leavePeriod: "October 14 - 15, 2026", leaveType: "Vacation", dateRequested: "October 01, 2026", reason: "Rest & Recreation", attachments: 0, status: "Pending" },
  { id: "leave-10", employeeId: "EMP012", name: "Marcus Villanueva", department: "Software Development", position: "Frontend Developer", leavePeriod: "October 19, 2026", leaveType: "Sick Leave", dateRequested: "October 18, 2026", reason: "Flu Symptoms", attachments: 1, status: "Pending" },
  { id: "leave-11", employeeId: "EMP013", name: "Bea Bianca Cruz", department: "Marketing", position: "Content Strategist", leavePeriod: "September 15 - 16, 2026", leaveType: "Vacation", dateRequested: "September 10, 2026", reason: "Family Gathering", attachments: 0, status: "Approved" },
  { id: "leave-12", employeeId: "EMP015", name: "Alyssa Marie Torres", department: "Design", position: "UI/UX Designer", leavePeriod: "October 25 - 28, 2026", leaveType: "Vacation", dateRequested: "October 12, 2026", reason: "Annual Vacation", attachments: 0, status: "Pending" },
  { id: "leave-13", employeeId: "EMP016", name: "Paolo Miguel Ramos", department: "Finance", position: "Financial Analyst", leavePeriod: "September 12, 2026", leaveType: "Personal", dateRequested: "September 08, 2026", reason: "Bank Transaction", attachments: 0, status: "Approved" },
  { id: "leave-14", employeeId: "EMP018", name: "Joshua Nathaniel Lim", department: "Network", position: "Systems Administrator", leavePeriod: "August 30, 2026", leaveType: "Sick Leave", dateRequested: "August 29, 2026", reason: "Migraine", attachments: 0, status: "Approved" },
  { id: "leave-15", employeeId: "EMP020", name: "Kevin Angelo Gomez", department: "Software Development", position: "Full Stack Engineer", leavePeriod: "October 22 - 24, 2026", leaveType: "Personal", dateRequested: "October 15, 2026", reason: "Relocation", attachments: 0, status: "Rejected" },
  { id: "leave-16", employeeId: "EMP021", name: "Patricia Gail Mendoza", department: "Sales", position: "Account Executive", leavePeriod: "November 05 - 07, 2026", leaveType: "Vacation", dateRequested: "October 17, 2026", reason: "Out of Town", attachments: 0, status: "Pending" },
  { id: "leave-17", employeeId: "EMP023", name: "Stephanie Claire Rivera", department: "Cybersecurity", position: "Security Engineer", leavePeriod: "October 30, 2026", leaveType: "Personal", dateRequested: "October 16, 2026", reason: "Family Event", attachments: 0, status: "Approved" },
];

// Interactive Pagination Component matching Mockup & Screenshot aesthetics
interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  itemLabel?: string;
  onPageChange: (page: number) => void;
}

function PaginationBar({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  itemLabel = "employees",
  onPageChange,
}: PaginationBarProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between pt-6 border-t border-[#20252c] mt-4 text-xs text-[#8b949e]">
      <span>
        Showing {startItem} to {endItem} of {totalItems} {itemLabel}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          aria-label="Previous Page"
          className={`w-8 h-8 flex items-center justify-center rounded-lg border transition ${
            currentPage <= 1
              ? "border-[#242930] text-[#484f58] cursor-not-allowed opacity-40"
              : "border-[#2b313a] bg-[#14181d] text-[#8b949e] hover:bg-[#20252c] hover:text-white cursor-pointer"
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => {
          const isActive = currentPage === pageNum;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              aria-label={`Page ${pageNum}`}
              aria-current={isActive ? "page" : undefined}
              className={`min-w-[32px] h-8 px-2.5 flex items-center justify-center rounded-lg text-xs font-semibold transition cursor-pointer ${
                isActive
                  ? "bg-[#2b313a] text-white shadow-sm"
                  : "border border-[#2b313a] bg-[#14181d] text-[#8b949e] hover:bg-[#20252c] hover:text-white"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          aria-label="Next Page"
          className={`w-8 h-8 flex items-center justify-center rounded-lg border transition ${
            currentPage >= totalPages
              ? "border-[#242930] text-[#484f58] cursor-not-allowed opacity-40"
              : "border-[#2b313a] bg-[#14181d] text-[#8b949e] hover:bg-[#20252c] hover:text-white cursor-pointer"
          }`}
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function ManagerDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Navigation State
  const initialTab = (searchParams.get("tab") as ManagerTab) || "dashboard";
  const [activeTab, setActiveTab] = useState<ManagerTab>(initialTab);

  // Manager identity
  const [managerName, setManagerName] = useState("Daniel Padilla");
  const [managerRole, setManagerRole] = useState("Department Manager");
  const [managerId, setManagerId] = useState("MGR-2026-101");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Datasets
  const [employees, setEmployees] = useState<EmployeeRecord[]>(INITIAL_EMPLOYEES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [tasks, setTasks] = useState<TaskRecord[]>(INITIAL_TASKS);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestRecord[]>(INITIAL_LEAVE_REQUESTS);

  // Leave Requests state
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequestRecord>(INITIAL_LEAVE_REQUESTS[0]);
  const [leaveManagerNote, setLeaveManagerNote] = useState("");

  // Tasks state
  const [taskFilterTab, setTaskFilterTab] = useState<"All Tasks" | "To Do" | "In Progress" | "Completed">("All Tasks");
  const [showCreateTaskDrawer, setShowCreateTaskDrawer] = useState(false);
  const [showUpdateTaskDrawer, setShowUpdateTaskDrawer] = useState(false);
  const [selectedTaskForUpdate, setSelectedTaskForUpdate] = useState<TaskRecord>(INITIAL_TASKS[1]);
  const [taskSearchQuery, setTaskSearchQuery] = useState("");

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [newTaskDueDate, setNewTaskDueDate] = useState("2026-10-15");
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState("Franz Fernando");

  // Update task form state
  const [updateTaskProgress, setUpdateTaskProgress] = useState(20);
  const [updateTaskStatus, setUpdateTaskStatus] = useState<"To Do" | "In Progress" | "Completed">("In Progress");
  const [updateTaskRemarks, setUpdateTaskRemarks] = useState("");

  // Search & Filter states
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employeeDeptFilter, setEmployeeDeptFilter] = useState("All Departments");
  const [employeeStatusFilter, setEmployeeStatusFilter] = useState("All Status");

  const [attDeptFilter, setAttDeptFilter] = useState("All Departments");
  const [attStatusFilter, setAttStatusFilter] = useState("All Status");

  const [leaveSearch, setLeaveSearch] = useState("");
  const [leaveStatusFilter, setLeaveStatusFilter] = useState("All Status");
  const [leaveDeptFilter, setLeaveDeptFilter] = useState("All Department");

  // Pagination states (interactive < 1 2 3 > controls)
  const [empPage, setEmpPage] = useState(1);
  const empPerPage = 10;

  const [attPage, setAttPage] = useState(1);
  const attPerPage = 10;

  const [taskPage, setTaskPage] = useState(1);
  const taskPerPage = 8;

  const [leavePage, setLeavePage] = useState(1);
  const leavePerPage = 8;

  // Leave Date Range Filter State
  const [showLeaveDatePicker, setShowLeaveDatePicker] = useState(false);
  const [leaveStartDate, setLeaveStartDate] = useState("2026-08-01");
  const [leaveEndDate, setLeaveEndDate] = useState("2026-11-30");
  const [leaveDateLabel, setLeaveDateLabel] = useState("August 01 - November 31, 2026");
  const [leaveDatePreset, setLeaveDatePreset] = useState<"all" | "aug" | "sep" | "oct" | "nov" | "custom">("all");
  const [customLeaveStart, setCustomLeaveStart] = useState("2026-08-01");
  const [customLeaveEnd, setCustomLeaveEnd] = useState("2026-11-30");

  // Attendance Date Range Filter State
  const [showAttDatePicker, setShowAttDatePicker] = useState(false);
  const [attStartDate, setAttStartDate] = useState("2026-08-18");
  const [attEndDate, setAttEndDate] = useState("2026-08-24");
  const [attDateLabel, setAttDateLabel] = useState("August 18, 2026 - August 24, 2026");
  const [customAttStart, setCustomAttStart] = useState("2026-08-18");
  const [customAttEnd, setCustomAttEnd] = useState("2026-08-24");

  // Announcement state & Post Announcement Form state
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>(INITIAL_ANNOUNCEMENTS);
  const [isPostingAnnouncement, setIsPostingAnnouncement] = useState(true);

  const [annTitle, setAnnTitle] = useState("System Maintenance Notice");
  const [annMessage, setAnnMessage] = useState(
`Dear Team,

Please be informed that our system will undergo scheduled maintenance on October 18, 2026 (Sunday) from 12:00 AM to 4:00 AM.

During this time, some features may be temporarily unavailable. We apologize for any inconvenience this may cause.

Thank you for your understanding.

Best regards,
IT Department`
  );
  const [annTargetDept, setAnnTargetDept] = useState("All Departments");
  const [annPriority, setAnnPriority] = useState<"Normal" | "High" | "Urgent" | "Low">("Normal");
  const [annPublishDate, setAnnPublishDate] = useState("September 07, 2026 11:00 AM");

  const handlePublishAnnouncement = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!annTitle.trim() || !annMessage.trim()) {
      showToast("Please provide both title and announcement message.");
      return;
    }

    const created: AnnouncementRecord = {
      id: `ann-${Date.now()}`,
      title: annTitle.trim(),
      message: annMessage.trim(),
      targetDepartment: annTargetDept,
      priority: annPriority,
      publishDate: annPublishDate,
      publishedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      author: managerName || "Department Manager",
    };

    setAnnouncements((prev) => [created, ...prev]);
    showToast(`Announcement published to ${annTargetDept}!`);
  };

  const handleSaveDraft = () => {
    showToast("Announcement draft saved successfully.");
  };

  // Sync Identity on mount
  useEffect(() => {
    const paramName = searchParams.get("name");
    const paramId = searchParams.get("managerId") || searchParams.get("empId");
    if (paramName) setManagerName(paramName);
    if (paramId) setManagerId(paramId);

    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("currentUserName");
      const storedRole = localStorage.getItem("currentUserRole");
      const storedId = localStorage.getItem("currentUserEmpId");
      if (storedName && !paramName) setManagerName(storedName);
      if (storedRole) setManagerRole(storedRole);
      if (storedId && !paramId) setManagerId(storedId);
    }
  }, [searchParams]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Handle Leave Request Actions
  const handleApproveLeave = () => {
    if (!selectedLeave) return;
    setLeaveRequests((prev) =>
      prev.map((l) => (l.id === selectedLeave.id ? { ...l, status: "Approved", managerNote: leaveManagerNote } : l))
    );
    setSelectedLeave((prev) => ({ ...prev, status: "Approved", managerNote: leaveManagerNote }));
    showToast(`Leave request for ${selectedLeave.name} approved.`);
  };

  const handleRejectLeave = () => {
    if (!selectedLeave) return;
    setLeaveRequests((prev) =>
      prev.map((l) => (l.id === selectedLeave.id ? { ...l, status: "Rejected", managerNote: leaveManagerNote } : l))
    );
    setSelectedLeave((prev) => ({ ...prev, status: "Rejected", managerNote: leaveManagerNote }));
    showToast(`Leave request for ${selectedLeave.name} rejected.`);
  };

  // Handle Create Task
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const created: TaskRecord = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      assignedTo: newTaskAssignedTo,
      priority: newTaskPriority,
      dueDate: newTaskDueDate,
      status: "To Do",
      progress: 0,
    };

    setTasks((prev) => [created, ...prev]);
    setShowCreateTaskDrawer(false);
    setNewTaskTitle("");
    setNewTaskDesc("");
    showToast(`New task assigned to ${newTaskAssignedTo}`);
  };

  // Handle Update Task
  const handleSaveTaskProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskForUpdate) return;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTaskForUpdate.id
          ? {
              ...t,
              progress: updateTaskProgress,
              status: updateTaskProgress === 100 ? "Completed" : updateTaskStatus,
            }
          : t
      )
    );
    setShowUpdateTaskDrawer(false);
    showToast(`Task progress updated to ${updateTaskProgress}%`);
  };

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchSearch =
        emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
        emp.id.toLowerCase().includes(employeeSearch.toLowerCase()) ||
        emp.email.toLowerCase().includes(employeeSearch.toLowerCase());
      const matchDept = employeeDeptFilter === "All Departments" || emp.department === employeeDeptFilter;
      const matchStatus = employeeStatusFilter === "All Status" || emp.status === employeeStatusFilter;
      return matchSearch && matchDept && matchStatus;
    });
  }, [employees, employeeSearch, employeeDeptFilter, employeeStatusFilter]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchTab =
        taskFilterTab === "All Tasks"
          ? true
          : taskFilterTab === "To Do"
          ? t.status === "To Do"
          : taskFilterTab === "In Progress"
          ? t.status === "In Progress"
          : t.status === "Completed";
      const matchSearch =
        t.title.toLowerCase().includes(taskSearchQuery.toLowerCase()) ||
        t.assignedTo.toLowerCase().includes(taskSearchQuery.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [tasks, taskFilterTab, taskSearchQuery]);

  // Leave Date Range Handlers
  const handleSelectLeavePreset = (preset: "all" | "aug" | "sep" | "oct" | "nov") => {
    setLeaveDatePreset(preset);
    if (preset === "all") {
      setLeaveStartDate("2026-08-01");
      setLeaveEndDate("2026-11-30");
      setLeaveDateLabel("August 01 - November 31, 2026");
    } else if (preset === "aug") {
      setLeaveStartDate("2026-08-01");
      setLeaveEndDate("2026-08-31");
      setLeaveDateLabel("August 01 - August 31, 2026");
    } else if (preset === "sep") {
      setLeaveStartDate("2026-09-01");
      setLeaveEndDate("2026-09-30");
      setLeaveDateLabel("September 01 - September 30, 2026");
    } else if (preset === "oct") {
      setLeaveStartDate("2026-10-01");
      setLeaveEndDate("2026-10-31");
      setLeaveDateLabel("October 01 - October 31, 2026");
    } else if (preset === "nov") {
      setLeaveStartDate("2026-11-01");
      setLeaveEndDate("2026-11-30");
      setLeaveDateLabel("November 01 - November 30, 2026");
    }
    setShowLeaveDatePicker(false);
  };

  const handleApplyCustomLeaveRange = () => {
    if (!customLeaveStart || !customLeaveEnd) return;
    setLeaveStartDate(customLeaveStart);
    setLeaveEndDate(customLeaveEnd);
    setLeaveDatePreset("custom");

    try {
      const s = new Date(customLeaveStart);
      const e = new Date(customLeaveEnd);
      const sStr = s.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const eStr = e.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      setLeaveDateLabel(`${sStr} - ${eStr}`);
    } catch {
      setLeaveDateLabel(`${customLeaveStart} - ${customLeaveEnd}`);
    }
    setShowLeaveDatePicker(false);
  };

  const handleResetLeaveDate = () => {
    handleSelectLeavePreset("all");
  };

  // Attendance Date Range Handlers
  const handleSelectAttPreset = (preset: "week" | "today" | "all") => {
    if (preset === "week") {
      setAttStartDate("2026-08-18");
      setAttEndDate("2026-08-24");
      setAttDateLabel("August 18, 2026 - August 24, 2026");
    } else if (preset === "today") {
      setAttStartDate("2026-08-24");
      setAttEndDate("2026-08-24");
      setAttDateLabel("August 24, 2026 (Today)");
    } else {
      setAttStartDate("2026-08-01");
      setAttEndDate("2026-08-31");
      setAttDateLabel("August 01 - August 31, 2026");
    }
    setShowAttDatePicker(false);
  };

  const handleApplyCustomAttRange = () => {
    if (!customAttStart || !customAttEnd) return;
    setAttStartDate(customAttStart);
    setAttEndDate(customAttEnd);
    try {
      const s = new Date(customAttStart);
      const e = new Date(customAttEnd);
      const sStr = s.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const eStr = e.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      setAttDateLabel(`${sStr} - ${eStr}`);
    } catch {
      setAttDateLabel(`${customAttStart} - ${customAttEnd}`);
    }
    setShowAttDatePicker(false);
  };

  // Filtered leave requests
  const filteredLeaves = useMemo(() => {
    return leaveRequests.filter((l) => {
      const matchSearch =
        l.name.toLowerCase().includes(leaveSearch.toLowerCase()) ||
        l.department.toLowerCase().includes(leaveSearch.toLowerCase());
      const matchStatus = leaveStatusFilter === "All Status" || l.status === leaveStatusFilter;
      const matchDept = leaveDeptFilter === "All Department" || l.department === leaveDeptFilter;

      // Date Range Filter (based on dateRequested)
      let matchDate = true;
      if (leaveStartDate && leaveEndDate) {
        const start = new Date(leaveStartDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(leaveEndDate);
        end.setHours(23, 59, 59, 999);

        const reqDate = new Date(l.dateRequested);
        if (!isNaN(reqDate.getTime())) {
          matchDate = reqDate >= start && reqDate <= end;
        }
      }

      return matchSearch && matchStatus && matchDept && matchDate;
    });
  }, [leaveRequests, leaveSearch, leaveStatusFilter, leaveDeptFilter, leaveStartDate, leaveEndDate]);

  // Filtered attendance records
  const filteredAttendance = useMemo(() => {
    return attendance.filter((rec) => {
      const matchStatus =
        attStatusFilter === "All Status" ? true : rec.status === attStatusFilter;
      const emp = employees.find((e) => e.id === rec.employeeId);
      const matchDept =
        attDeptFilter === "All Departments"
          ? true
          : emp?.department === attDeptFilter;

      // Date Range Filter
      let matchDate = true;
      if (attStartDate && attEndDate) {
        const start = new Date(attStartDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(attEndDate);
        end.setHours(23, 59, 59, 999);

        const recDate = new Date(rec.date);
        if (!isNaN(recDate.getTime())) {
          matchDate = recDate >= start && recDate <= end;
        }
      }

      return matchStatus && matchDept && matchDate;
    });
  }, [attendance, attStatusFilter, attDeptFilter, employees, attStartDate, attEndDate]);

  // Reset page to 1 when filters or search change
  useEffect(() => {
    setEmpPage(1);
  }, [employeeSearch, employeeDeptFilter, employeeStatusFilter]);

  useEffect(() => {
    setAttPage(1);
  }, [attStatusFilter, attDeptFilter, attStartDate, attEndDate]);

  useEffect(() => {
    setTaskPage(1);
  }, [taskFilterTab, taskSearchQuery]);

  useEffect(() => {
    setLeavePage(1);
  }, [leaveSearch, leaveStatusFilter, leaveDeptFilter, leaveStartDate, leaveEndDate]);

  // Sliced Paginated Data & Total Pages
  const empTotalPages = Math.max(1, Math.ceil(filteredEmployees.length / empPerPage));
  const paginatedEmployees = useMemo(() => {
    const start = (empPage - 1) * empPerPage;
    return filteredEmployees.slice(start, start + empPerPage);
  }, [filteredEmployees, empPage, empPerPage]);

  const attTotalPages = Math.max(1, Math.ceil(filteredAttendance.length / attPerPage));
  const paginatedAttendance = useMemo(() => {
    const start = (attPage - 1) * attPerPage;
    return filteredAttendance.slice(start, start + attPerPage);
  }, [filteredAttendance, attPage, attPerPage]);

  const taskTotalPages = Math.max(1, Math.ceil(filteredTasks.length / taskPerPage));
  const paginatedTasks = useMemo(() => {
    const start = (taskPage - 1) * taskPerPage;
    return filteredTasks.slice(start, start + taskPerPage);
  }, [filteredTasks, taskPage, taskPerPage]);

  const leaveTotalPages = Math.max(1, Math.ceil(filteredLeaves.length / leavePerPage));
  const paginatedLeaves = useMemo(() => {
    const start = (leavePage - 1) * leavePerPage;
    return filteredLeaves.slice(start, start + leavePerPage);
  }, [filteredLeaves, leavePage, leavePerPage]);

  // Breadcrumb generator
  const renderBreadcrumb = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard";
      case "employees":
        return "Employees > View Employees";
      case "attendance":
        return "Attendance > Attendance Records";
      case "tasks":
        return "Tasks";
      case "leave-requests":
        return "Leave Request > Manage Leave Request";
      case "announcements":
        return isPostingAnnouncement ? "Announcement > Post Announcement" : "Announcements";
      case "settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-[#111316] text-[#e6edf3] font-sans flex antialiased selection:bg-neutral-800 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1e2329] border border-[#2f3640] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* SIDEBAR                                                  */}
      {/* ======================================================== */}
      <aside className="w-64 bg-[#0d0f12] border-r border-[#1e2227] flex flex-col justify-between shrink-0 select-none">
        <div>
          {/* Top Strideon Brand */}
          <div className="p-6 flex flex-col items-center justify-center border-b border-[#181b20]">
            <Image
              src="/assets/strideon-shoe-white.png"
              alt="Strideon Emblem"
              width={56}
              height={44}
              priority
              className="h-10 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]"
            />
            <span className="mt-2 text-xs font-extrabold tracking-[0.25em] text-white uppercase">
              STRIDEON
            </span>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1 mt-2">
            {/* Dashboard */}
            <button
              type="button"
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-[#20252c] text-white font-semibold shadow-sm"
                  : "text-[#8b949e] hover:text-white hover:bg-[#15191e]"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 stroke-[1.8]" />
              <span>Dashboard</span>
            </button>

            {/* Employees */}
            <button
              type="button"
              onClick={() => setActiveTab("employees")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === "employees"
                  ? "bg-[#20252c] text-white font-semibold shadow-sm"
                  : "text-[#8b949e] hover:text-white hover:bg-[#15191e]"
              }`}
            >
              <Users className="w-4 h-4 stroke-[1.8]" />
              <span>Employees</span>
            </button>

            {/* Attendance */}
            <button
              type="button"
              onClick={() => setActiveTab("attendance")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === "attendance"
                  ? "bg-[#20252c] text-white font-semibold shadow-sm"
                  : "text-[#8b949e] hover:text-white hover:bg-[#15191e]"
              }`}
            >
              <Clock className="w-4 h-4 stroke-[1.8]" />
              <span>Attendance</span>
            </button>

            {/* Tasks */}
            <button
              type="button"
              onClick={() => setActiveTab("tasks")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === "tasks"
                  ? "bg-[#20252c] text-white font-semibold shadow-sm"
                  : "text-[#8b949e] hover:text-white hover:bg-[#15191e]"
              }`}
            >
              <ClipboardList className="w-4 h-4 stroke-[1.8]" />
              <span>Tasks</span>
            </button>

            {/* Leave Requests */}
            <button
              type="button"
              onClick={() => setActiveTab("leave-requests")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === "leave-requests"
                  ? "bg-[#20252c] text-white font-semibold shadow-sm"
                  : "text-[#8b949e] hover:text-white hover:bg-[#15191e]"
              }`}
            >
              <CalendarDays className="w-4 h-4 stroke-[1.8]" />
              <span>Leave Requests</span>
            </button>

            {/* Announcements */}
            <button
              type="button"
              onClick={() => setActiveTab("announcements")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === "announcements"
                  ? "bg-[#20252c] text-white font-semibold shadow-sm"
                  : "text-[#8b949e] hover:text-white hover:bg-[#15191e]"
              }`}
            >
              <Megaphone className="w-4 h-4 stroke-[1.8]" />
              <span>Announcements</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-[#181b20] space-y-1">
          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === "settings"
                ? "bg-[#20252c] text-white font-semibold"
                : "text-[#8b949e] hover:text-white hover:bg-[#15191e]"
            }`}
          >
            <Settings className="w-4 h-4 stroke-[1.8]" />
            <span>Settings</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.removeItem("isManager");
              }
              router.push("/manager-login");
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium text-[#8b949e] hover:text-red-400 hover:bg-[#1f1618] transition cursor-pointer"
          >
            <LogOut className="w-4 h-4 stroke-[1.8]" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* MAIN VIEWPORT CONTAINER                                  */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* TOP HEADER BAR */}
        <header className="h-16 bg-[#111316] border-b border-[#1e2227] px-6 lg:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-none">
              Department Manager
            </h1>
            <p className="text-[11px] text-[#8b949e] mt-1 leading-none font-medium">
              {renderBreadcrumb()}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button
              type="button"
              className="p-2 text-[#8b949e] hover:text-white hover:bg-[#1a1e24] rounded-full transition relative cursor-pointer"
            >
              <Bell className="w-4 h-4 stroke-[1.8]" />
              <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1.5 right-1.5 ring-2 ring-[#111316]" />
            </button>

            {/* Profile Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2.5 p-1.5 pr-2 rounded-full hover:bg-[#1a1e24] transition cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-800 ring-1 ring-neutral-700">
                  <Image
                    src="/assets/avatar.png"
                    alt="Department Manager"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-semibold text-white leading-none">
                    Department Manager
                  </p>
                  <p className="text-[10px] text-[#8b949e] leading-none mt-1">
                    Manager
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#8b949e]" />
              </button>

              {/* Profile dropdown */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-[#191d23] border border-[#2b313a] rounded-xl shadow-2xl p-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-[#252b33] mb-1">
                    <p className="font-bold text-white">{managerName}</p>
                    <p className="text-[10px] text-[#8b949e] font-mono">{managerId}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      router.push("/");
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#222831] text-[#c9d1d9] transition cursor-pointer"
                  >
                    Switch to Employee Portal
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      router.push("/manager-login");
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#222831] text-red-400 transition cursor-pointer"
                  >
                    Log out of Management
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT SWITCHER */}
        <main className="p-6 lg:p-8 flex-1">
          {/* ======================================================== */}
          {/* TAB 1: DASHBOARD (Matches Mockup 1)                      */}
          {/* ======================================================== */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Header Title */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Dashboard
                </h2>
                <p className="text-xs text-[#8b949e] mt-1">
                  Welcome Back, <span className="text-white font-medium">{managerName}</span>!
                </p>
                <p className="text-xs text-[#8b949e]">
                  Here&apos;s what&apos;s happening with your team today.
                </p>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Employees */}
                <div className="bg-[#171b20] border border-[#23272e] rounded-xl p-4 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-lg bg-[#20252c] flex items-center justify-center text-[#8b949e]">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#8b949e] font-medium leading-none">Total Employees</p>
                    <p className="text-xl font-bold text-white mt-1.5 leading-none">24</p>
                  </div>
                </div>

                {/* Present Today */}
                <div className="bg-[#171b20] border border-[#23272e] rounded-xl p-4 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-lg bg-[#0070f3] text-white flex items-center justify-center shadow-sm">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#8b949e] font-medium leading-none">Present Today</p>
                    <p className="text-xl font-bold text-white mt-1.5 leading-none">19</p>
                  </div>
                </div>

                {/* Absent Today */}
                <div className="bg-[#171b20] border border-[#23272e] rounded-xl p-4 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-lg bg-[#ef4444] text-white flex items-center justify-center shadow-sm">
                    <X className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#8b949e] font-medium leading-none">Absent Today</p>
                    <p className="text-xl font-bold text-white mt-1.5 leading-none">2</p>
                  </div>
                </div>

                {/* Pending */}
                <div className="bg-[#171b20] border border-[#23272e] rounded-xl p-4 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-lg bg-[#f59e0b] text-white flex items-center justify-center shadow-sm">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#8b949e] font-medium leading-none">Pending</p>
                    <p className="text-xl font-bold text-white mt-1.5 leading-none">5</p>
                  </div>
                </div>
              </div>

              {/* 2x2 Grid of Dashboard Widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Attendance Overview */}
                <div className="bg-[#171b20] border border-[#23272e] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      Attendance Overview
                    </h3>
                    <button
                      onClick={() => setActiveTab("attendance")}
                      className="text-xs text-[#3b82f6] hover:underline cursor-pointer font-medium"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-[#22262d]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded bg-[#22c55e]" />
                        <span className="text-[#c9d1d9]">Present</span>
                      </div>
                      <span className="text-white font-mono">19</span>
                      <span className="text-[#8b949e] font-mono">95%</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-[#22262d]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded bg-[#eab308]" />
                        <span className="text-[#c9d1d9]">Late</span>
                      </div>
                      <span className="text-white font-mono">3</span>
                      <span className="text-[#8b949e] font-mono">3%</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-[#22262d]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded bg-[#ef4444]" />
                        <span className="text-[#c9d1d9]">Absent</span>
                      </div>
                      <span className="text-white font-mono">2</span>
                      <span className="text-[#8b949e] font-mono">2%</span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded bg-[#06b6d4]" />
                        <span className="text-[#c9d1d9]">On Leave</span>
                      </div>
                      <span className="text-white font-mono">0</span>
                      <span className="text-[#8b949e] font-mono">0%</span>
                    </div>
                  </div>
                </div>

                {/* 2. Recent Employees */}
                <div className="bg-[#171b20] border border-[#23272e] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      Recent Employees
                    </h3>
                    <button
                      onClick={() => setActiveTab("employees")}
                      className="text-xs text-[#3b82f6] hover:underline cursor-pointer font-medium"
                    >
                      View All
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#1f242b] text-[#8b949e] rounded-lg">
                          <th className="py-2 px-3 rounded-l-lg font-medium">Name</th>
                          <th className="py-2 px-3 font-medium">Department</th>
                          <th className="py-2 px-3 rounded-r-lg font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#20252c]">
                        {employees.slice(0, 5).map((emp) => (
                          <tr key={emp.id} className="hover:bg-[#1a1e24] transition">
                            <td className="py-2.5 px-3 font-medium text-white">{emp.name}</td>
                            <td className="py-2.5 px-3 text-[#8b949e]">{emp.department}</td>
                            <td className="py-2.5 px-3 text-[#22c55e] font-medium">{emp.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. Team Tasks ('s happening) */}
                <div className="bg-[#171b20] border border-[#23272e] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      &apos;s happening
                    </h3>
                    <button
                      onClick={() => setActiveTab("tasks")}
                      className="text-xs text-[#3b82f6] hover:underline cursor-pointer font-medium"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between py-1.5 border-b border-[#22262d]">
                      <span className="text-white font-medium">Finish marketing campaign report</span>
                      <span className="text-[#8b949e]">Marketing</span>
                      <span className="text-[#8b949e]">Due Oct 10, 2026</span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-[#22262d]">
                      <span className="text-white font-medium">Update product catalog</span>
                      <span className="text-[#8b949e]">Sales</span>
                      <span className="text-[#8b949e]">Due Nov 10, 2026</span>
                    </div>

                    <div className="flex items-center justify-between py-1.5 border-b border-[#22262d]">
                      <span className="text-white font-medium">Team meeting preparation</span>
                      <span className="text-[#8b949e]">Operations</span>
                      <span className="text-[#8b949e]">Due Nov 10, 2026</span>
                    </div>

                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-white font-medium">Client follow up</span>
                      <span className="text-[#8b949e]">Sales</span>
                      <span className="text-[#8b949e]">Due Nov 10, 2026</span>
                    </div>
                  </div>
                </div>

                {/* 4. Announcements */}
                <div className="bg-[#171b20] border border-[#23272e] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      Announcements
                    </h3>
                    <button
                      onClick={() => setActiveTab("announcements")}
                      className="text-xs text-[#3b82f6] hover:underline cursor-pointer font-medium"
                    >
                      View All
                    </button>
                  </div>

                  {/* Announcement Card */}
                  <div className="bg-[#121518] border border-[#22262d] rounded-xl p-5 flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#00dfc4] flex items-center justify-center text-black shrink-0 shadow-sm">
                      <Megaphone className="w-8 h-8 stroke-[2]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white">System Maintenance</h4>
                      <p className="text-xs text-[#8b949e] mt-1.5 leading-relaxed">
                        The system will be down for maintenance on October 18, 2026 from 12:00 AM to 4:00 AM
                      </p>
                      <p className="text-[10px] text-[#555d68] mt-2 font-medium">
                        October 12, 2026
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: EMPLOYEES (Matches Mockup 3)                      */}
          {/* ======================================================== */}
          {activeTab === "employees" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-[#171b20] border border-[#23272e] rounded-2xl p-6">
                <p className="text-xs text-[#8b949e] mb-4">
                  View employees within your department.
                </p>

                {/* Search & Filter Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-[#8b949e] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={employeeSearch}
                      onChange={(e) => setEmployeeSearch(e.target.value)}
                      placeholder="Search employee..."
                      className="w-full bg-[#121518] border border-[#242930] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-[#555d68] outline-none focus:border-[#3b82f6]"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Department Dropdown */}
                    <div className="relative">
                      <select
                        value={employeeDeptFilter}
                        onChange={(e) => setEmployeeDeptFilter(e.target.value)}
                        className="bg-[#121518] border border-[#242930] rounded-xl px-3 py-2 pr-8 text-xs text-[#c9d1d9] outline-none appearance-none cursor-pointer focus:border-[#3b82f6]"
                      >
                        <option>All Departments</option>
                        <option>Marketing</option>
                        <option>Design</option>
                        <option>Sales</option>
                        <option>Warehouse</option>
                        <option>Finance</option>
                        <option>IT Support</option>
                        <option>Network</option>
                        <option>Cybersecurity</option>
                        <option>Software Development</option>
                        <option>Human Resources</option>
                        <option>Operations</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#8b949e] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Status Dropdown */}
                    <div className="relative">
                      <select
                        value={employeeStatusFilter}
                        onChange={(e) => setEmployeeStatusFilter(e.target.value)}
                        className="bg-[#121518] border border-[#242930] rounded-xl px-3 py-2 pr-8 text-xs text-[#c9d1d9] outline-none appearance-none cursor-pointer focus:border-[#3b82f6]"
                      >
                        <option>All Status</option>
                        <option>Active</option>
                        <option>On Leave</option>
                        <option>Inactive</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#8b949e] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Employees Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#1f242b] text-[#8b949e]">
                        <th className="py-2.5 px-4 rounded-l-lg font-medium">Employee ID</th>
                        <th className="py-2.5 px-4 font-medium">Employee Name</th>
                        <th className="py-2.5 px-4 font-medium">Department</th>
                        <th className="py-2.5 px-4 font-medium">Position</th>
                        <th className="py-2.5 px-4 font-medium">Email</th>
                        <th className="py-2.5 px-4 rounded-r-lg font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#20252c]">
                      {paginatedEmployees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-[#1a1e24] transition">
                          <td className="py-3 px-4 font-mono text-[#8b949e]">{emp.id}</td>
                          <td className="py-3 px-4 font-semibold text-white">{emp.name}</td>
                          <td className="py-3 px-4 text-[#c9d1d9]">{emp.department}</td>
                          <td className="py-3 px-4 text-[#8b949e]">{emp.position}</td>
                          <td className="py-3 px-4 text-[#8b949e]">{emp.email}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                                emp.status === "Active"
                                  ? "border-emerald-500/40 text-emerald-400 bg-emerald-950/20"
                                  : emp.status === "On Leave"
                                  ? "border-amber-500/40 text-amber-400 bg-amber-950/20"
                                  : "border-neutral-700 text-neutral-400 bg-neutral-900"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  emp.status === "Active"
                                    ? "bg-emerald-400"
                                    : emp.status === "On Leave"
                                    ? "bg-amber-400"
                                    : "bg-neutral-500"
                                }`}
                              />
                              <span>{emp.status}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer Pagination */}
                <PaginationBar
                  currentPage={empPage}
                  totalPages={empTotalPages}
                  totalItems={filteredEmployees.length}
                  itemsPerPage={empPerPage}
                  itemLabel="employees"
                  onPageChange={setEmpPage}
                />
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: ATTENDANCE RECORDS (Matches Mockup 2)              */}
          {/* ======================================================== */}
          {activeTab === "attendance" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Attendance Records
                </h2>
                <p className="text-xs text-[#8b949e] mt-1">
                  View and monitor attendance records of your department.
                </p>
              </div>

              {/* 5 Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {/* Total Employees */}
                <div
                  onClick={() => setAttStatusFilter("All Status")}
                  className={`bg-[#171b20] border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition select-none ${
                    attStatusFilter === "All Status"
                      ? "border-neutral-500 bg-[#1e2329]"
                      : "border-[#23272e] hover:border-[#303640]"
                  }`}
                  title="Click to show All Status"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#20252c] flex items-center justify-center text-[#8b949e]">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#8b949e] font-medium leading-none">Total Employees</p>
                    <p className="text-lg font-bold text-white mt-1 leading-none">24</p>
                    <p className="text-[9px] text-[#555d68] mt-1">In this department</p>
                  </div>
                </div>

                {/* Average Attendance */}
                <div className="bg-[#171b20] border border-[#23272e] rounded-xl p-4 flex items-center gap-3 select-none">
                  <div className="w-10 h-10 rounded-lg bg-[#22c55e] text-white flex items-center justify-center">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#8b949e] font-medium leading-none">Average Attendance</p>
                    <p className="text-lg font-bold text-white mt-1 leading-none">92%</p>
                    <p className="text-[9px] text-[#555d68] mt-1">This Month</p>
                  </div>
                </div>

                {/* Present Today */}
                <div
                  onClick={() => setAttStatusFilter("Present")}
                  className={`bg-[#171b20] border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition select-none ${
                    attStatusFilter === "Present"
                      ? "border-[#0070f3] ring-1 ring-[#0070f3] bg-[#0c1829]"
                      : "border-[#23272e] hover:border-[#303640]"
                  }`}
                  title="Click to filter by Present"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#0070f3] text-white flex items-center justify-center shadow-sm">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#8b949e] font-medium leading-none">Present Today</p>
                    <p className="text-lg font-bold text-white mt-1 leading-none">19</p>
                    <p className="text-[9px] text-[#555d68] mt-1">83% of total</p>
                  </div>
                </div>

                {/* Late Today */}
                <div
                  onClick={() => setAttStatusFilter("Late")}
                  className={`bg-[#171b20] border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition select-none ${
                    attStatusFilter === "Late"
                      ? "border-[#f59e0b] ring-1 ring-[#f59e0b] bg-[#241a08]"
                      : "border-[#23272e] hover:border-[#303640]"
                  }`}
                  title="Click to filter by Late"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#f59e0b] text-white flex items-center justify-center shadow-sm">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#8b949e] font-medium leading-none">Late Today</p>
                    <p className="text-lg font-bold text-white mt-1 leading-none">3</p>
                    <p className="text-[9px] text-[#555d68] mt-1">13% of total</p>
                  </div>
                </div>

                {/* Absent Today */}
                <div
                  onClick={() => setAttStatusFilter("Absent")}
                  className={`bg-[#171b20] border rounded-xl p-4 flex items-center gap-3 cursor-pointer transition select-none ${
                    attStatusFilter === "Absent"
                      ? "border-[#ef4444] ring-1 ring-[#ef4444] bg-[#290c0f]"
                      : "border-[#23272e] hover:border-[#303640]"
                  }`}
                  title="Click to filter by Absent"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#ef4444] text-white flex items-center justify-center shadow-sm">
                    <X className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#8b949e] font-medium leading-none">Absent Today</p>
                    <p className="text-lg font-bold text-white mt-1 leading-none">2</p>
                    <p className="text-[9px] text-[#555d68] mt-1">4% of total</p>
                  </div>
                </div>
              </div>

              {/* Attendance Table Container */}
              <div className="bg-[#171b20] border border-[#23272e] rounded-2xl p-6">
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  {/* Date Range */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowAttDatePicker((prev) => !prev)}
                      className={`bg-[#121518] border rounded-xl px-3.5 py-2 text-xs text-[#c9d1d9] flex items-center gap-2 cursor-pointer transition select-none ${
                        showAttDatePicker || attStartDate !== "2026-08-18" || attEndDate !== "2026-08-24"
                          ? "border-[#3b82f6] text-white ring-1 ring-[#3b82f6]/40 bg-[#161d27]"
                          : "border-[#242930] hover:border-[#38414e] hover:text-white"
                      }`}
                      title="Click to filter attendance by date range"
                    >
                      <CalendarIcon className="w-3.5 h-3.5 text-[#3b82f6]" />
                      <span>{attDateLabel}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-[#8b949e] ml-2 transition-transform duration-200 ${
                          showAttDatePicker ? "rotate-180 text-white" : ""
                        }`}
                      />
                    </button>

                    {showAttDatePicker && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowAttDatePicker(false)}
                        />
                        <div className="absolute left-0 top-full mt-2 w-80 bg-[#161a20] border border-[#2a303c] rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn backdrop-blur-md">
                          <div className="flex items-center justify-between pb-3 border-b border-[#222832]">
                            <div className="flex items-center gap-2 text-white font-semibold text-xs">
                              <CalendarIcon className="w-3.5 h-3.5 text-[#3b82f6]" />
                              <span>Filter Attendance by Date</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowAttDatePicker(false)}
                              className="text-[#8b949e] hover:text-white p-1 rounded-lg hover:bg-[#20252c] transition cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="mt-3">
                            <p className="text-[10px] text-[#8b949e] font-semibold uppercase tracking-wider mb-2">
                              Quick Presets
                            </p>
                            <div className="grid grid-cols-2 gap-1.5 text-xs">
                              <button
                                type="button"
                                onClick={() => handleSelectAttPreset("week")}
                                className="px-2.5 py-1.5 rounded-lg text-left transition font-medium text-[11px] bg-[#101216] border border-[#242930] text-[#c9d1d9] hover:bg-[#1a1f26] hover:text-white cursor-pointer"
                              >
                                Week (Aug 18 - 24)
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSelectAttPreset("today")}
                                className="px-2.5 py-1.5 rounded-lg text-left transition font-medium text-[11px] bg-[#101216] border border-[#242930] text-[#c9d1d9] hover:bg-[#1a1f26] hover:text-white cursor-pointer"
                              >
                                Today (Aug 24)
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSelectAttPreset("all")}
                                className="col-span-2 px-2.5 py-1.5 rounded-lg text-left transition font-medium text-[11px] bg-[#101216] border border-[#242930] text-[#c9d1d9] hover:bg-[#1a1f26] hover:text-white cursor-pointer"
                              >
                                All August 2026
                              </button>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-[#222832] space-y-2.5">
                            <p className="text-[10px] text-[#8b949e] font-semibold uppercase tracking-wider">
                              Custom Date Range
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <label className="text-[10px] text-[#8b949e] block mb-1">From Date</label>
                                <input
                                  type="date"
                                  value={customAttStart}
                                  onChange={(e) => setCustomAttStart(e.target.value)}
                                  className="w-full bg-[#101216] border border-[#242930] rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-[#3b82f6]"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-[#8b949e] block mb-1">To Date</label>
                                <input
                                  type="date"
                                  value={customAttEnd}
                                  onChange={(e) => setCustomAttEnd(e.target.value)}
                                  className="w-full bg-[#101216] border border-[#242930] rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-[#3b82f6]"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#222832]">
                            <button
                              type="button"
                              onClick={() => handleSelectAttPreset("week")}
                              className="text-xs text-[#8b949e] hover:text-white transition cursor-pointer font-medium"
                            >
                              Reset
                            </button>
                            <button
                              type="button"
                              onClick={handleApplyCustomAttRange}
                              className="px-3.5 py-1.5 bg-[#0070f3] hover:bg-[#0060df] text-white rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer"
                            >
                              Apply Range
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Department */}
                  <div className="relative">
                    <select
                      value={attDeptFilter}
                      onChange={(e) => setAttDeptFilter(e.target.value)}
                      className="bg-[#121518] border border-[#242930] rounded-xl px-3.5 py-2 pr-8 text-xs text-[#c9d1d9] outline-none appearance-none cursor-pointer"
                    >
                      <option>All Departments</option>
                      <option>Marketing</option>
                      <option>Design</option>
                      <option>Sales</option>
                      <option>Warehouse</option>
                      <option>Finance</option>
                      <option>IT Support</option>
                      <option>Network</option>
                      <option>Cybersecurity</option>
                      <option>Software Development</option>
                      <option>Human Resources</option>
                      <option>Operations</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#8b949e] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Status */}
                  <div className="relative">
                    <select
                      value={attStatusFilter}
                      onChange={(e) => setAttStatusFilter(e.target.value)}
                      className="bg-[#121518] border border-[#242930] rounded-xl px-3.5 py-2 pr-8 text-xs text-[#c9d1d9] outline-none appearance-none cursor-pointer"
                    >
                      <option>All Status</option>
                      <option>Present</option>
                      <option>Late</option>
                      <option>Absent</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#8b949e] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#1f242b] text-[#8b949e]">
                        <th className="py-2.5 px-4 rounded-l-lg font-medium">Employee ID</th>
                        <th className="py-2.5 px-4 font-medium">Employee Name</th>
                        <th className="py-2.5 px-4 font-medium">Date</th>
                        <th className="py-2.5 px-4 font-medium">Check In</th>
                        <th className="py-2.5 px-4 font-medium">Check Out</th>
                        <th className="py-2.5 px-4 font-medium">Work Hours</th>
                        <th className="py-2.5 px-4 rounded-r-lg font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#20252c]">
                      {filteredAttendance.length > 0 ? (
                        paginatedAttendance.map((rec) => (
                          <tr key={rec.id} className="hover:bg-[#1a1e24] transition">
                            <td className="py-3 px-4 font-mono text-[#8b949e]">{rec.employeeId}</td>
                            <td className="py-3 px-4 font-semibold text-white">{rec.name}</td>
                            <td className="py-3 px-4 text-[#8b949e]">{rec.date}</td>
                            <td className="py-3 px-4 font-mono text-[#c9d1d9]">{rec.checkIn}</td>
                            <td className="py-3 px-4 font-mono text-[#c9d1d9]">{rec.checkOut}</td>
                            <td className="py-3 px-4 text-[#8b949e]">{rec.workHours}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`font-semibold ${
                                  rec.status === "Present"
                                    ? "text-[#22c55e]"
                                    : rec.status === "Late"
                                    ? "text-[#f59e0b]"
                                    : "text-[#ef4444]"
                                }`}
                              >
                                {rec.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-[#8b949e]">
                            No attendance records match the selected status &quot;{attStatusFilter}&quot;.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <PaginationBar
                  currentPage={attPage}
                  totalPages={attTotalPages}
                  totalItems={filteredAttendance.length}
                  itemsPerPage={attPerPage}
                  itemLabel="employees"
                  onPageChange={setAttPage}
                />
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: TASKS (Matches Mockup 4)                          */}
          {/* ======================================================== */}
          {activeTab === "tasks" && (
            <div className="space-y-6 animate-fadeIn relative">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Tasks
                </h2>
                <p className="text-xs text-[#8b949e] mt-1">
                  Create, assign and track tasks across your department.
                </p>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#171b20] border border-[#23272e] rounded-xl p-4 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-lg bg-[#20252c] flex items-center justify-center text-[#8b949e]">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#8b949e] font-medium leading-none">Total Tasks</p>
                    <p className="text-xl font-bold text-white mt-1.5 leading-none">24</p>
                    <p className="text-[10px] text-[#555d68] mt-1">All tasks created</p>
                  </div>
                </div>

                <div className="bg-[#171b20] border border-[#23272e] rounded-xl p-4 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-lg bg-[#0070f3] text-white flex items-center justify-center">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#8b949e] font-medium leading-none">In Progress</p>
                    <p className="text-xl font-bold text-white mt-1.5 leading-none">9</p>
                    <p className="text-[10px] text-[#555d68] mt-1">Task currently in progress</p>
                  </div>
                </div>

                <div className="bg-[#171b20] border border-[#23272e] rounded-xl p-4 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-lg bg-[#f59e0b] text-white flex items-center justify-center">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#8b949e] font-medium leading-none">To Do</p>
                    <p className="text-xl font-bold text-white mt-1.5 leading-none">11</p>
                    <p className="text-[10px] text-[#555d68] mt-1">Task not yet get started</p>
                  </div>
                </div>

                <div className="bg-[#171b20] border border-[#23272e] rounded-xl p-4 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-lg bg-[#22c55e] text-white flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#8b949e] font-medium leading-none">Completed</p>
                    <p className="text-xl font-bold text-white mt-1.5 leading-none">4</p>
                    <p className="text-[10px] text-[#555d68] mt-1">Task Completed</p>
                  </div>
                </div>
              </div>

              {/* Main Tasks Table with Side Drawers */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Table Left Container */}
                <div className={`${showCreateTaskDrawer || showUpdateTaskDrawer ? "xl:col-span-8" : "xl:col-span-12"} bg-[#171b20] border border-[#23272e] rounded-2xl p-6 transition-all`}>
                  {/* Tabs & Search & Create */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 border-b border-[#20252c] pb-4">
                    {/* Tabs */}
                    <div className="flex items-center gap-5 text-xs font-semibold">
                      {(["All Tasks", "To Do", "In Progress", "Completed"] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setTaskFilterTab(tab)}
                          className={`pb-2.5 transition relative cursor-pointer ${
                            taskFilterTab === tab
                              ? "text-white"
                              : "text-[#8b949e] hover:text-[#c9d1d9]"
                          }`}
                        >
                          {tab}
                          {taskFilterTab === tab && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Search & Button */}
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-[#8b949e] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={taskSearchQuery}
                          onChange={(e) => setTaskSearchQuery(e.target.value)}
                          placeholder="Search Task..."
                          className="bg-[#121518] border border-[#242930] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-[#555d68] outline-none"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateTaskDrawer(true);
                          setShowUpdateTaskDrawer(false);
                        }}
                        className="bg-[#242a32] hover:bg-[#2d343f] text-white text-xs font-medium px-3.5 py-1.5 rounded-xl border border-[#333b47] transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create Task</span>
                      </button>
                    </div>
                  </div>

                  {/* Tasks Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#1f242b] text-[#8b949e]">
                          <th className="py-2.5 px-3 rounded-l-lg font-medium">Task Title</th>
                          <th className="py-2.5 px-3 font-medium">Assigned To</th>
                          <th className="py-2.5 px-3 font-medium">Priority</th>
                          <th className="py-2.5 px-3 font-medium">Due Date</th>
                          <th className="py-2.5 px-3 font-medium">Status</th>
                          <th className="py-2.5 px-3 font-medium">Progress</th>
                          <th className="py-2.5 px-2 rounded-r-lg"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#20252c]">
                        {paginatedTasks.map((t) => (
                          <tr
                            key={t.id}
                            onClick={() => {
                              setSelectedTaskForUpdate(t);
                              setUpdateTaskProgress(t.progress);
                              setUpdateTaskStatus(t.status);
                              setShowUpdateTaskDrawer(true);
                              setShowCreateTaskDrawer(false);
                            }}
                            className="hover:bg-[#1a1e24] transition cursor-pointer"
                          >
                            <td className="py-3 px-3 font-medium text-white">{t.title}</td>
                            <td className="py-3 px-3 text-[#c9d1d9]">{t.assignedTo}</td>
                            <td className="py-3 px-3">
                              <span
                                className={`text-[11px] font-medium ${
                                  t.priority === "High"
                                    ? "text-red-400"
                                    : t.priority === "Medium"
                                    ? "text-amber-400"
                                    : "text-blue-400"
                                }`}
                              >
                                {t.priority}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-[#8b949e]">{t.dueDate}</td>
                            <td className="py-3 px-3 text-[#c9d1d9] font-medium">{t.status}</td>
                            <td className="py-3 px-3 min-w-[130px]">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-[#252b33] rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      t.progress === 100
                                        ? "bg-[#22c55e]"
                                        : t.progress > 0
                                        ? "bg-[#0070f3]"
                                        : "bg-transparent"
                                    }`}
                                    style={{ width: `${t.progress}%` }}
                                  />
                                </div>
                                <span className="text-[10px] text-[#8b949e] font-mono">{t.progress}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-right">
                              <MoreVertical className="w-3.5 h-3.5 text-[#555d68]" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <PaginationBar
                    currentPage={taskPage}
                    totalPages={taskTotalPages}
                    totalItems={filteredTasks.length}
                    itemsPerPage={taskPerPage}
                    itemLabel="tasks"
                    onPageChange={setTaskPage}
                  />
                </div>

                {/* Right Panel: CREATE & ASSIGN TASK (Mockup 4 Top Drawer) */}
                {showCreateTaskDrawer && (
                  <div className="xl:col-span-4 bg-[#171b20] border border-[#23272e] rounded-2xl p-5 animate-fadeIn">
                    <div className="flex items-center justify-between mb-4 border-b border-[#20252c] pb-3">
                      <h3 className="text-sm font-bold text-white">Create &amp; Assign Task</h3>
                      <button
                        onClick={() => setShowCreateTaskDrawer(false)}
                        className="text-[#8b949e] hover:text-white p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
                      <div>
                        <label className="block text-[#8b949e] mb-1">Task Title</label>
                        <input
                          type="text"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          placeholder="Enter task title"
                          className="w-full bg-[#121518] border border-[#242930] rounded-xl px-3 py-2 text-white outline-none focus:border-[#3b82f6]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[#8b949e] mb-1">Task Description</label>
                        <textarea
                          rows={2}
                          value={newTaskDesc}
                          onChange={(e) => setNewTaskDesc(e.target.value)}
                          placeholder="Enter task description"
                          className="w-full bg-[#121518] border border-[#242930] rounded-xl p-3 text-white outline-none focus:border-[#3b82f6]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[#8b949e] mb-1">Priority</label>
                          <select
                            value={newTaskPriority}
                            onChange={(e) => setNewTaskPriority(e.target.value as any)}
                            className="w-full bg-[#121518] border border-[#242930] rounded-xl px-3 py-2 text-white outline-none"
                          >
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[#8b949e] mb-1">Due Date</label>
                          <input
                            type="date"
                            value={newTaskDueDate}
                            onChange={(e) => setNewTaskDueDate(e.target.value)}
                            className="w-full bg-[#121518] border border-[#242930] rounded-xl px-3 py-2 text-white outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[#8b949e] mb-1">Assign To</label>
                        <div className="bg-[#121518] border border-[#242930] rounded-xl p-2 max-h-36 overflow-y-auto space-y-1.5">
                          {employees.map((emp) => (
                            <label
                              key={emp.id}
                              className="flex items-center gap-2.5 p-1.5 hover:bg-[#191d23] rounded-lg cursor-pointer text-white"
                            >
                              <input
                                type="radio"
                                name="assignee"
                                checked={newTaskAssignedTo === emp.name}
                                onChange={() => setNewTaskAssignedTo(emp.name)}
                                className="accent-[#0070f3]"
                              />
                              <div className="w-5 h-5 rounded-full bg-neutral-700 flex items-center justify-center text-[10px]">
                                {emp.name[0]}
                              </div>
                              <span className="text-[11px] font-medium">{emp.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3">
                        <button
                          type="button"
                          onClick={() => setShowCreateTaskDrawer(false)}
                          className="px-3 py-1.5 rounded-lg border border-[#242930] text-[#8b949e] hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg bg-[#252b33] hover:bg-[#303742] text-white font-medium border border-[#373f4c]"
                        >
                          Create Task
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Right Panel: UPDATE TASK PROGRESS (Mockup 4 Bottom Drawer) */}
                {showUpdateTaskDrawer && selectedTaskForUpdate && (
                  <div className="xl:col-span-4 bg-[#171b20] border border-[#23272e] rounded-2xl p-5 animate-fadeIn">
                    <div className="flex items-center justify-between mb-4 border-b border-[#20252c] pb-3">
                      <h3 className="text-sm font-bold text-white">Update Task Progress</h3>
                      <button
                        onClick={() => setShowUpdateTaskDrawer(false)}
                        className="text-[#8b949e] hover:text-white p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Task summary */}
                    <div className="bg-[#121518] border border-[#242930] rounded-xl p-3.5 mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-900/40 text-purple-400 flex items-center justify-center">
                          <ClipboardList className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{selectedTaskForUpdate.title}</p>
                          <p className="text-[10px] text-[#8b949e]">
                            Assigned to: {selectedTaskForUpdate.assignedTo}
                          </p>
                          <p className="text-[9px] text-[#555d68]">Due: {selectedTaskForUpdate.dueDate}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#0070f3] text-white">
                        {updateTaskStatus}
                      </span>
                    </div>

                    <form onSubmit={handleSaveTaskProgress} className="space-y-4 text-xs">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[#8b949e]">Progress</label>
                          <span className="font-mono text-white font-bold">{updateTaskProgress}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={updateTaskProgress}
                          onChange={(e) => setUpdateTaskProgress(Number(e.target.value))}
                          className="w-full accent-[#0070f3] cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-[#8b949e] mb-1">Status</label>
                        <select
                          value={updateTaskStatus}
                          onChange={(e) => setUpdateTaskStatus(e.target.value as any)}
                          className="w-full bg-[#121518] border border-[#242930] rounded-xl px-3 py-2 text-white outline-none"
                        >
                          <option>To Do</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#8b949e] mb-1">Update / Remarks</label>
                        <textarea
                          rows={3}
                          value={updateTaskRemarks}
                          onChange={(e) => setUpdateTaskRemarks(e.target.value)}
                          placeholder="Updated the banner design based on the latest feedback."
                          className="w-full bg-[#121518] border border-[#242930] rounded-xl p-3 text-white outline-none focus:border-[#3b82f6]"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowUpdateTaskDrawer(false)}
                          className="px-3 py-1.5 rounded-lg border border-[#242930] text-[#8b949e] hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg bg-[#252b33] hover:bg-[#303742] text-white font-medium border border-[#373f4c]"
                        >
                          Update Progress
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: LEAVE REQUESTS (Matches Mockup 5)                  */}
          {/* ======================================================== */}
          {activeTab === "leave-requests" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Leave Request
                </h2>
                <p className="text-xs text-[#8b949e] mt-1">
                  Review and approve or reject leave requests from employees.
                </p>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#171b20] border border-[#23272e] rounded-xl p-4 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-lg bg-[#20252c] flex items-center justify-center text-[#8b949e]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#8b949e] font-medium leading-none">Total Requests</p>
                    <p className="text-xl font-bold text-white mt-1.5 leading-none">17</p>
                    <p className="text-[10px] text-[#555d68] mt-1">This Month</p>
                  </div>
                </div>

                <div className="bg-[#171b20] border border-[#23272e] rounded-xl p-4 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-lg bg-[#f59e0b] text-white flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#8b949e] font-medium leading-none">Pending</p>
                    <p className="text-xl font-bold text-white mt-1.5 leading-none">5</p>
                    <p className="text-[10px] text-[#555d68] mt-1">28% of total</p>
                  </div>
                </div>

                <div className="bg-[#171b20] border border-[#23272e] rounded-xl p-4 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-lg bg-[#22c55e] text-white flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#8b949e] font-medium leading-none">Approved</p>
                    <p className="text-xl font-bold text-white mt-1.5 leading-none">9</p>
                    <p className="text-[10px] text-[#555d68] mt-1">53% of total</p>
                  </div>
                </div>

                <div className="bg-[#171b20] border border-[#23272e] rounded-xl p-4 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-lg bg-[#ef4444] text-white flex items-center justify-center">
                    <X className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#8b949e] font-medium leading-none">Rejected</p>
                    <p className="text-xl font-bold text-white mt-1.5 leading-none">3</p>
                    <p className="text-[10px] text-[#555d68] mt-1">18% of total</p>
                  </div>
                </div>
              </div>

              {/* Table & Request Details Side Panel Layout */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Table Left Side */}
                <div className="xl:col-span-8 bg-[#171b20] border border-[#23272e] rounded-2xl p-6">
                  {/* Filters Row */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="w-3.5 h-3.5 text-[#8b949e] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={leaveSearch}
                        onChange={(e) => setLeaveSearch(e.target.value)}
                        placeholder="Search employee of request"
                        className="w-full bg-[#121518] border border-[#242930] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-[#555d68] outline-none"
                      />
                    </div>

                    <div className="relative">
                      <select
                        value={leaveStatusFilter}
                        onChange={(e) => setLeaveStatusFilter(e.target.value)}
                        className="bg-[#121518] border border-[#242930] rounded-xl px-3 py-2 pr-8 text-xs text-[#c9d1d9] outline-none appearance-none cursor-pointer"
                      >
                        <option>All Status</option>
                        <option>Pending</option>
                        <option>Approved</option>
                        <option>Rejected</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#8b949e] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <div className="relative">
                      <select
                        value={leaveDeptFilter}
                        onChange={(e) => setLeaveDeptFilter(e.target.value)}
                        className="bg-[#121518] border border-[#242930] rounded-xl px-3 py-2 pr-8 text-xs text-[#c9d1d9] outline-none appearance-none cursor-pointer"
                      >
                        <option>All Department</option>
                        <option>Marketing</option>
                        <option>Design</option>
                        <option>Sales</option>
                        <option>Warehouse</option>
                        <option>Finance</option>
                        <option>IT Support</option>
                        <option>Network</option>
                        <option>Cybersecurity</option>
                        <option>Software Development</option>
                        <option>Human Resources</option>
                        <option>Operations</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#8b949e] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowLeaveDatePicker((prev) => !prev)}
                        className={`bg-[#121518] border rounded-xl px-3 py-2 text-xs text-[#c9d1d9] flex items-center gap-2 cursor-pointer transition select-none ${
                          showLeaveDatePicker || leaveDatePreset !== "all"
                            ? "border-[#3b82f6] text-white ring-1 ring-[#3b82f6]/40 bg-[#161d27]"
                            : "border-[#242930] hover:border-[#38414e] hover:text-white"
                        }`}
                        title="Click to filter leave requests by date range"
                      >
                        <CalendarIcon className="w-3.5 h-3.5 text-[#3b82f6]" />
                        <span>{leaveDateLabel}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-[#8b949e] transition-transform duration-200 ${
                            showLeaveDatePicker ? "rotate-180 text-white" : ""
                          }`}
                        />
                      </button>

                      {showLeaveDatePicker && (
                        <>
                          {/* Backdrop to close on click outside */}
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowLeaveDatePicker(false)}
                          />

                          {/* Date Range Popover */}
                          <div className="absolute right-0 top-full mt-2 w-80 bg-[#161a20] border border-[#2a303c] rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn backdrop-blur-md">
                            {/* Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-[#222832]">
                              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                                <CalendarIcon className="w-3.5 h-3.5 text-[#3b82f6]" />
                                <span>Filter Leave Requests by Date</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setShowLeaveDatePicker(false)}
                                className="text-[#8b949e] hover:text-white p-1 rounded-lg hover:bg-[#20252c] transition cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Month Presets */}
                            <div className="mt-3">
                              <p className="text-[10px] text-[#8b949e] font-semibold uppercase tracking-wider mb-2">
                                Quick Month Presets
                              </p>
                              <div className="grid grid-cols-2 gap-1.5 text-xs">
                                <button
                                  type="button"
                                  onClick={() => handleSelectLeavePreset("all")}
                                  className={`px-2.5 py-1.5 rounded-lg text-left transition font-medium text-[11px] cursor-pointer ${
                                    leaveDatePreset === "all"
                                      ? "bg-[#0070f3] text-white shadow-sm font-semibold"
                                      : "bg-[#101216] border border-[#242930] text-[#c9d1d9] hover:bg-[#1a1f26] hover:text-white"
                                  }`}
                                >
                                  All (Aug - Nov 2026)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSelectLeavePreset("aug")}
                                  className={`px-2.5 py-1.5 rounded-lg text-left transition font-medium text-[11px] cursor-pointer ${
                                    leaveDatePreset === "aug"
                                      ? "bg-[#0070f3] text-white shadow-sm font-semibold"
                                      : "bg-[#101216] border border-[#242930] text-[#c9d1d9] hover:bg-[#1a1f26] hover:text-white"
                                  }`}
                                >
                                  August 2026 (3)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSelectLeavePreset("sep")}
                                  className={`px-2.5 py-1.5 rounded-lg text-left transition font-medium text-[11px] cursor-pointer ${
                                    leaveDatePreset === "sep"
                                      ? "bg-[#0070f3] text-white shadow-sm font-semibold"
                                      : "bg-[#101216] border border-[#242930] text-[#c9d1d9] hover:bg-[#1a1f26] hover:text-white"
                                  }`}
                                >
                                  September 2026 (7)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSelectLeavePreset("oct")}
                                  className={`px-2.5 py-1.5 rounded-lg text-left transition font-medium text-[11px] cursor-pointer ${
                                    leaveDatePreset === "oct"
                                      ? "bg-[#0070f3] text-white shadow-sm font-semibold"
                                      : "bg-[#101216] border border-[#242930] text-[#c9d1d9] hover:bg-[#1a1f26] hover:text-white"
                                  }`}
                                >
                                  October 2026 (7)
                                </button>
                              </div>
                            </div>

                            {/* Custom Date Range */}
                            <div className="mt-3 pt-3 border-t border-[#222832] space-y-2.5">
                              <p className="text-[10px] text-[#8b949e] font-semibold uppercase tracking-wider">
                                Custom Date Range
                              </p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <label className="text-[10px] text-[#8b949e] block mb-1">From Date</label>
                                  <input
                                    type="date"
                                    value={customLeaveStart}
                                    onChange={(e) => setCustomLeaveStart(e.target.value)}
                                    className="w-full bg-[#101216] border border-[#242930] rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-[#3b82f6]"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-[#8b949e] block mb-1">To Date</label>
                                  <input
                                    type="date"
                                    value={customLeaveEnd}
                                    onChange={(e) => setCustomLeaveEnd(e.target.value)}
                                    className="w-full bg-[#101216] border border-[#242930] rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-[#3b82f6]"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#222832]">
                              <button
                                type="button"
                                onClick={handleResetLeaveDate}
                                className="text-xs text-[#8b949e] hover:text-white transition cursor-pointer font-medium"
                              >
                                Reset All
                              </button>
                              <button
                                type="button"
                                onClick={handleApplyCustomLeaveRange}
                                className="px-3.5 py-1.5 bg-[#0070f3] hover:bg-[#0060df] text-white rounded-lg text-xs font-semibold shadow-sm transition cursor-pointer"
                              >
                                Apply Range
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#1f242b] text-[#8b949e]">
                          <th className="py-2.5 px-3 rounded-l-lg font-medium">Employee</th>
                          <th className="py-2.5 px-3 font-medium">Department</th>
                          <th className="py-2.5 px-3 font-medium">Leave Period</th>
                          <th className="py-2.5 px-3 font-medium">Leave Type</th>
                          <th className="py-2.5 px-3 font-medium">Reason</th>
                          <th className="py-2.5 px-3 rounded-r-lg font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#20252c]">
                        {paginatedLeaves.map((l) => (
                          <tr
                            key={l.id}
                            onClick={() => setSelectedLeave(l)}
                            className={`cursor-pointer transition ${
                              selectedLeave?.id === l.id
                                ? "bg-[#1f252d]"
                                : "hover:bg-[#1a1e24]"
                            }`}
                          >
                            <td className="py-3 px-3 font-semibold text-white">{l.name}</td>
                            <td className="py-3 px-3 text-[#c9d1d9]">{l.department}</td>
                            <td className="py-3 px-3 text-[#8b949e]">{l.leavePeriod}</td>
                            <td className="py-3 px-3 text-[#c9d1d9]">{l.leaveType}</td>
                            <td className="py-3 px-3 text-[#8b949e] max-w-[130px] truncate">{l.reason}</td>
                            <td className="py-3 px-3">
                              <span
                                className={`font-semibold ${
                                  l.status === "Approved"
                                    ? "text-[#22c55e]"
                                    : l.status === "Pending"
                                    ? "text-[#f59e0b]"
                                    : "text-[#ef4444]"
                                }`}
                              >
                                {l.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <PaginationBar
                    currentPage={leavePage}
                    totalPages={leaveTotalPages}
                    totalItems={filteredLeaves.length}
                    itemsPerPage={leavePerPage}
                    itemLabel="requests"
                    onPageChange={setLeavePage}
                  />
                </div>

                {/* Right Side Panel: REQUEST DETAILS (Matches Mockup 5 Right Panel) */}
                <div className="xl:col-span-4 bg-[#171b20] border border-[#23272e] rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-5 border-b border-[#20252c] pb-3">
                      <h3 className="text-sm font-bold text-white">Request Details</h3>
                      <span className="text-xs text-[#8b949e]">#</span>
                    </div>

                    {/* Employee Profile Preview */}
                    <div className="flex items-center gap-3.5 mb-6">
                      <div className="w-12 h-12 rounded-full bg-[#2a3038] flex items-center justify-center text-white font-bold text-sm">
                        {selectedLeave?.name[0] || "R"}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{selectedLeave?.name}</h4>
                        <p className="text-[11px] text-[#8b949e]">
                          {selectedLeave?.employeeId} {selectedLeave?.department}
                        </p>
                        <p className="text-[10px] text-[#555d68]">{selectedLeave?.position}</p>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-3.5 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-[#20252c]">
                        <span className="text-[#8b949e]">Leave Type</span>
                        <span className="text-white font-medium">{selectedLeave?.leaveType}</span>
                      </div>

                      <div className="flex justify-between py-1.5 border-b border-[#20252c]">
                        <span className="text-[#8b949e]">Leave Period</span>
                        <span className="text-white font-medium">{selectedLeave?.leavePeriod}</span>
                      </div>

                      <div className="flex justify-between py-1.5 border-b border-[#20252c]">
                        <span className="text-[#8b949e]">Date Requested</span>
                        <span className="text-white font-medium">{selectedLeave?.dateRequested}</span>
                      </div>

                      <div className="flex justify-between py-1.5 border-b border-[#20252c]">
                        <span className="text-[#8b949e]">Reason</span>
                        <span className="text-white font-medium">{selectedLeave?.reason}</span>
                      </div>

                      <div>
                        <span className="text-[#8b949e] block mb-1">Attachments</span>
                        <div className="bg-[#121518] border border-[#242930] rounded-xl p-3 text-center text-[#555d68]">
                          {selectedLeave?.attachments} file attached
                        </div>
                      </div>

                      <div>
                        <span className="text-[#8b949e] block mb-1">Manager Notes</span>
                        <textarea
                          rows={2}
                          value={leaveManagerNote}
                          onChange={(e) => setLeaveManagerNote(e.target.value)}
                          placeholder="Add a note..."
                          className="w-full bg-[#121518] border border-[#242930] rounded-xl p-2.5 text-white outline-none focus:border-[#3b82f6]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Big Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-6 mt-4 border-t border-[#20252c]">
                    <button
                      type="button"
                      onClick={handleApproveLeave}
                      className="w-full py-2.5 rounded-xl bg-[#22c55e] hover:bg-[#1ea750] text-black font-extrabold text-xs tracking-wider uppercase transition shadow-md cursor-pointer active:scale-[0.98]"
                    >
                      APPROVE
                    </button>
                    <button
                      type="button"
                      onClick={handleRejectLeave}
                      className="w-full py-2.5 rounded-xl bg-[#ef4444] hover:bg-[#dc2626] text-white font-extrabold text-xs tracking-wider uppercase transition shadow-md cursor-pointer active:scale-[0.98]"
                    >
                      REJECT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: ANNOUNCEMENTS (Matches User's Mockup)             */}
          {/* ======================================================== */}
          {activeTab === "announcements" && (
            <div className="space-y-6 animate-fadeIn">
              {isPostingAnnouncement ? (
                /* POST DEPARTMENT ANNOUNCEMENT SCREEN (Exact Mockup Layout) */
                <div className="space-y-6">
                  {/* Page Title & Subtitle + Toggle Button */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Post Department Announcement
                      </h2>
                      <p className="text-xs text-[#8b949e] mt-1">
                        Create and publish announcements for your department.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsPostingAnnouncement(false)}
                      className="self-start sm:self-auto bg-[#171b21] hover:bg-[#20252d] text-[#c9d1d9] hover:text-white text-xs font-medium px-3.5 py-2 rounded-xl border border-[#2b313a] transition flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Megaphone className="w-3.5 h-3.5 text-[#00dfc4]" />
                      <span>View All Announcements</span>
                      <span className="w-4 h-4 rounded-full bg-[#272e38] text-[10px] font-mono text-white flex items-center justify-center">
                        {announcements.length}
                      </span>
                    </button>
                  </div>

                  {/* 2-Column Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Post Announcement Form */}
                    <div className="lg:col-span-7 xl:col-span-8 bg-[#171c23] border border-[#232830] rounded-2xl p-6 sm:p-7 shadow-sm">
                      <form onSubmit={handlePublishAnnouncement} className="space-y-5 text-xs">
                        {/* Title */}
                        <div>
                          <label className="block text-[#8b949e] font-medium mb-1.5">
                            Announcement Title
                          </label>
                          <input
                            type="text"
                            value={annTitle}
                            onChange={(e) => setAnnTitle(e.target.value)}
                            placeholder="System Maintenance Notice"
                            className="w-full bg-[#121519] border border-[#23272e] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-[#555d68] outline-none focus:border-[#3b82f6] transition"
                            required
                          />
                        </div>

                        {/* Message */}
                        <div>
                          <label className="block text-[#8b949e] font-medium mb-1.5">
                            Announcement Mesage
                          </label>
                          <textarea
                            rows={10}
                            value={annMessage}
                            onChange={(e) => setAnnMessage(e.target.value)}
                            placeholder="Dear Team, ..."
                            className="w-full bg-[#121519] border border-[#23272e] rounded-xl p-4 text-xs text-white placeholder:text-[#555d68] outline-none focus:border-[#3b82f6] leading-relaxed transition font-sans resize-y"
                            required
                          />
                        </div>

                        {/* Target Departments */}
                        <div>
                          <label className="block text-[#8b949e] font-medium mb-1.5">
                            Target Departments
                          </label>
                          <div className="relative">
                            <select
                              value={annTargetDept}
                              onChange={(e) => setAnnTargetDept(e.target.value)}
                              className="w-full bg-[#121519] border border-[#23272e] rounded-xl px-4 py-2.5 pr-10 text-xs text-white outline-none appearance-none cursor-pointer focus:border-[#3b82f6] transition"
                            >
                              <option>All Departments</option>
                              <option>Marketing</option>
                              <option>Design</option>
                              <option>Sales</option>
                              <option>Warehouse</option>
                              <option>Finance</option>
                              <option>IT Support</option>
                              <option>Network</option>
                              <option>Cybersecurity</option>
                              <option>Software Development</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#8b949e] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        {/* Priority & Publish Date Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Priority */}
                          <div>
                            <label className="block text-[#8b949e] font-medium mb-1.5">
                              Priority
                            </label>
                            <div className="relative">
                              <select
                                value={annPriority}
                                onChange={(e) => setAnnPriority(e.target.value as any)}
                                className="w-full bg-[#121519] border border-[#23272e] rounded-xl px-4 py-2.5 pr-10 text-xs text-white outline-none appearance-none cursor-pointer focus:border-[#3b82f6] transition"
                              >
                                <option>Normal</option>
                                <option>High</option>
                                <option>Urgent</option>
                                <option>Low</option>
                              </select>
                              <ChevronDown className="w-4 h-4 text-[#8b949e] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                          </div>

                          {/* Publish Date */}
                          <div>
                            <label className="block text-[#8b949e] font-medium mb-1.5">
                              Publish Date
                            </label>
                            <div className="relative flex items-center">
                              <input
                                type="text"
                                value={annPublishDate}
                                onChange={(e) => setAnnPublishDate(e.target.value)}
                                placeholder="September 07, 2026 11:00 AM"
                                className="w-full bg-[#121519] border border-[#23272e] rounded-xl px-4 py-2.5 pr-10 text-xs text-white placeholder:text-[#555d68] outline-none focus:border-[#3b82f6] transition"
                              />
                              <CalendarIcon className="w-4 h-4 text-[#8b949e] absolute right-3.5 pointer-events-none" />
                            </div>
                          </div>
                        </div>

                        {/* Bottom Actions Right Aligned */}
                        <div className="flex items-center justify-end gap-3 pt-4">
                          <button
                            type="button"
                            onClick={handleSaveDraft}
                            className="px-5 py-2.5 rounded-xl bg-[#20252c] hover:bg-[#282f38] text-[#c9d1d9] hover:text-white border border-[#2d3440] font-medium transition cursor-pointer active:scale-[0.99]"
                          >
                            Save as Draft
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl bg-[#252b34] hover:bg-[#303743] text-white border border-[#333b47] font-semibold transition cursor-pointer shadow-sm active:scale-[0.99]"
                          >
                            Publish Announcement
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Right Column: Live Announcement Preview */}
                    <div className="lg:col-span-5 xl:col-span-4 bg-[#171c23] border border-[#232830] rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col">
                      <h3 className="text-sm font-bold text-white mb-4">
                        Announcement Preview
                      </h3>

                      {/* Preview Box */}
                      <div className="bg-[#121519] border border-[#23272e] rounded-xl p-5 text-xs flex flex-col justify-start">
                        {/* Header Box */}
                        <div className="flex items-start gap-3.5 pb-4 border-b border-[#20242b]">
                          <div className="w-12 h-12 rounded-2xl bg-[#00dfc4] flex items-center justify-center text-black shrink-0 shadow-sm mt-0.5">
                            <Megaphone className="w-6 h-6 stroke-[2]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-bold text-white leading-snug">
                              {annTitle || "System Maintenance Notice"}
                            </h4>
                            <p className="text-[11px] text-[#8b949e] mt-1">
                              {annTargetDept} - October 12, 2026 10:00 AM
                            </p>
                          </div>
                        </div>

                        {/* Message Content */}
                        <div className="pt-4 text-[#c9d1d9] whitespace-pre-line leading-relaxed text-[11.5px]">
                          {annMessage}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* FEED VIEW WITH POST BUTTON */
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight">
                        Announcements
                      </h2>
                      <p className="text-xs text-[#8b949e] mt-1">
                        Broadcast communications and operational alerts to your department.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsPostingAnnouncement(true)}
                      className="bg-[#242a32] hover:bg-[#2d343f] text-white text-xs font-semibold px-4 py-2 rounded-xl border border-[#333b47] flex items-center gap-2 cursor-pointer shadow-sm transition"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Announcement</span>
                    </button>
                  </div>

                  {/* List of Announcements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {announcements.map((ann) => (
                      <div
                        key={ann.id}
                        className="bg-[#171b20] border border-[#23272e] rounded-2xl p-6 flex items-start gap-4 hover:border-[#2f3540] transition"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-[#00dfc4] flex items-center justify-center text-black shrink-0 shadow-sm">
                          <Megaphone className="w-7 h-7 stroke-[2]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
                              {ann.targetDepartment}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                ann.priority === "Urgent"
                                  ? "bg-red-950/60 text-red-400"
                                  : ann.priority === "High"
                                  ? "bg-amber-950/60 text-amber-400"
                                  : "bg-blue-950/60 text-blue-400"
                              }`}
                            >
                              {ann.priority}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-white mt-1.5 truncate">
                            {ann.title}
                          </h3>
                          <p className="text-xs text-[#8b949e] mt-1 leading-relaxed whitespace-pre-line line-clamp-3">
                            {ann.message}
                          </p>
                          <p className="text-[10px] text-[#555d68] mt-3">
                            {ann.publishDate} • By {ann.author}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: SETTINGS                                          */}
          {/* ======================================================== */}
          {activeTab === "settings" && (
            <div className="max-w-2xl bg-[#171b20] border border-[#23272e] rounded-2xl p-6 space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-lg font-bold text-white">Department Manager Settings</h2>
                <p className="text-xs text-[#8b949e] mt-0.5">Manage executive credentials and notification rules.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#8b949e] mb-1">Manager Display Name</label>
                  <input
                    type="text"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="w-full bg-[#121518] border border-[#242930] rounded-xl px-3.5 py-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#8b949e] mb-1">Executive Role</label>
                  <input
                    type="text"
                    value={managerRole}
                    onChange={(e) => setManagerRole(e.target.value)}
                    className="w-full bg-[#121518] border border-[#242930] rounded-xl px-3.5 py-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#8b949e] mb-1">Assigned Manager ID</label>
                  <input
                    type="text"
                    value={managerId}
                    readOnly
                    className="w-full bg-[#121518] border border-[#242930] rounded-xl px-3.5 py-2 font-mono text-[#8b949e] cursor-not-allowed"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        localStorage.setItem("currentUserName", managerName);
                        localStorage.setItem("currentUserRole", managerRole);
                      }
                      showToast("Manager settings updated successfully.");
                    }}
                    className="px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ManagerDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#111316] flex items-center justify-center text-white">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      }
    >
      <ManagerDashboardContent />
    </Suspense>
  );
}
