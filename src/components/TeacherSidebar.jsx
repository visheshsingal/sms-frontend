import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import API from '../utils/api'
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  NotebookPen,
  Calendar,
  BarChart3,
  FileText,
  Bell,
} from 'lucide-react'

export default function TeacherSidebar() {
  const [assignedClass, setAssignedClass] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get('/teacher/assigned-class')
        setAssignedClass(res.data || null)
      } catch (err) {
        setAssignedClass(null)
      }
    }
    load()
  }, [])

  const items = [
    { to: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      to: '/teacher/class',
      label: `Class${assignedClass?.name ? ` (${assignedClass.name})` : ''}`,
      icon: Users,
    },
    { to: '/teacher/attendance', label: 'Attendance', icon: ClipboardCheck },
    { to: '/teacher/assignments', label: 'Assignments', icon: NotebookPen },
    { to: '/teacher/timetable', label: 'Timetable', icon: Calendar },
    { to: '/teacher/progress', label: 'Student Progress', icon: BarChart3 },
    { to: '/teacher/leaves', label: 'Leaves', icon: FileText },
    { to: '/notices', label: 'Notices', icon: Bell },
  ]

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-indigo-700 to-indigo-800 text-indigo-50 px-5 py-6 shadow-xl">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-full bg-white text-indigo-700 font-bold flex items-center justify-center shadow">
          T
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Teacher Panel</h1>
          <p className="text-xs text-indigo-200">
            {assignedClass ? `Class: ${assignedClass.name}` : 'No class assigned'}
          </p>
        </div>
      </div>

      {/* Links */}
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
                    ? 'bg-indigo-600 text-white shadow-md'
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
