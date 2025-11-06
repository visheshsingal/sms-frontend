import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import API from '../utils/api'
import {
  User,
  FileText,
  BarChart3,
  ClipboardList,
  Calendar,
  NotebookPen,
  Bell,
} from 'lucide-react'

export default function StudentSidebar() {
  const [assignedClass, setAssignedClass] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get('/student/me')
        setAssignedClass(res.data.class || null)
      } catch (err) {
        setAssignedClass(null)
      }
    }
    load()
  }, [])

  const items = [
    { to: '/student/profile', label: 'Profile', icon: User },
    {
      to: '/student/attendance-report',
      label: `Attendance${assignedClass?.name ? ` (${assignedClass.name})` : ''}`,
      icon: FileText,
    },
    { to: '/student/progress', label: 'Marks & Progress', icon: BarChart3 },
    { to: '/student/assignments', label: 'Assignments', icon: NotebookPen },
    { to: '/student/timetable', label: 'Timetable', icon: Calendar },
    { to: '/student/leaves', label: 'Leaves', icon: ClipboardList },
    { to: '/student/notices', label: 'Notices', icon: Bell },
  ]

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-indigo-700 to-indigo-800 text-indigo-50 px-5 py-6 shadow-xl">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-full bg-white text-indigo-700 font-bold flex items-center justify-center shadow">
          S
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Student Panel</h1>
          <p className="text-xs text-indigo-200">{assignedClass ? `Class: ${assignedClass.name}` : 'No class assigned'}</p>
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
