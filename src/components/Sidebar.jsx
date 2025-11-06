import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  GraduationCap,
  DollarSign,
  ClipboardList,
  FileText,
  Bell,
} from 'lucide-react'

const items = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/teachers', label: 'Teachers', icon: UserCheck },
  { to: '/admin/classes', label: 'Classes', icon: GraduationCap },
  { to: '/admin/finance', label: 'Finance', icon: DollarSign },
  { to: '/admin/attendance', label: 'Mark Attendance', icon: ClipboardList },
  { to: '/admin/attendance-report', label: 'Attendance Report', icon: FileText },
  { to: '/admin/notices', label: 'Notices', icon: Bell },
]

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-indigo-600 to-indigo-700 text-indigo-50 px-5 py-6 shadow-xl">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-full bg-white text-indigo-700 font-bold flex items-center justify-center shadow">
          SM
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Admin Panel</h1>
          <p className="text-xs text-indigo-200">School Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {items.map((i) => {
          const Icon = i.icon
          return (
            <NavLink
              key={i.to}
              to={i.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'text-indigo-100 hover:bg-indigo-600/40 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {i.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
