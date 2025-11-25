import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Bus,
  MapPin,
  GraduationCap,
  DollarSign,
  ClipboardList,
  FileText,
  Bell,
  X,
} from 'lucide-react'

const items = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/teachers', label: 'Teachers', icon: UserCheck },
  { to: '/admin/drivers', label: 'Drivers', icon: UserCheck },
  { to: '/admin/classes', label: 'Classes', icon: GraduationCap },
  { to: '/admin/buses', label: 'Buses', icon: Bus },
  { to: '/admin/live', label: 'Live Tracking', icon: MapPin },
  { to: '/admin/routes', label: 'Routes', icon: MapPin },
  // Finance temporarily removed from sidebar. Uncomment if needed later:
  // { to: '/admin/finance', label: 'Finance', icon: DollarSign },
  { to: '/admin/attendance', label: 'Mark Attendance', icon: ClipboardList },
  { to: '/admin/bus-attendance', label: 'Bus Attendance', icon: Bus },
  { to: '/admin/attendance-report', label: 'Attendance Report', icon: FileText },
  { to: '/admin/notices', label: 'Notices', icon: Bell },
]

export default function Sidebar({ className = '', onClose }) {
  return (
    <aside
      className={`relative flex min-h-screen w-64 flex-col overflow-y-auto bg-gradient-to-b from-indigo-600 to-indigo-700 px-5 py-6 text-indigo-50 shadow-xl ${className}`}
    >
      {onClose && (
        <button
          type="button"
          className="absolute right-4 top-4 inline-flex items-center justify-center rounded-full bg-white/10 p-2 text-indigo-100 transition hover:bg-white/20 lg:hidden"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {/* Logo */}
      <div className="mb-10 mt-2 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white text-indigo-700 font-bold flex items-center justify-center shadow">
          SM
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Admin Panel</h1>
          <p className="text-xs text-indigo-200">School Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1">
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
