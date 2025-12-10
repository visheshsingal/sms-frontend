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
  MapPin,
  QrCode,
  X,
  Megaphone
} from 'lucide-react'

export default function StudentSidebar({ studentClass = null, className = '', onClose }) {
  const [assignedClass, setAssignedClass] = useState(studentClass)
  const [counts, setCounts] = useState({ school: 0, class: 0 })

  useEffect(() => {
    if (studentClass) {
      setAssignedClass(studentClass)
      // return // we continue to load counts
    } else {
      const load = async () => {
        try {
          const res = await API.get('/student/me')
          setAssignedClass(res.data.class || null)
        } catch (err) {
          setAssignedClass(null)
        }
      }
      load()
    }

    const loadCounts = async () => {
      try {
        const res = await API.get('/notices/unread')
        const notices = res.data.notices || []
        
        const schoolCount = notices.filter(n => !n.targetClass && !n.targetStudent).length
        const classCount = notices.filter(n => n.targetClass).length
        
        setCounts({ school: schoolCount, class: classCount })
      } catch (err) {
        console.error(err)
      }
    }
    loadCounts()
  }, [studentClass])

  const items = [
    { to: '/student/profile', label: 'Profile', icon: User },
    {
      to: '/student/attendance-report',
      label: `Attendance${assignedClass?.name ? ` (${assignedClass.name})` : ''}`,
      icon: FileText,
    },
    { to: '/student/qr', label: 'My QR', icon: QrCode },
    { to: '/student/progress', label: 'Marks & Progress', icon: BarChart3 },
    { to: '/student/assignments', label: 'Assignments', icon: NotebookPen },
    { to: '/student/timetable', label: 'Timetable', icon: Calendar },
    { to: '/student/leaves', label: 'Leaves', icon: ClipboardList },
    { to: '/student/transport', label: 'Transport', icon: MapPin },
    { to: '/student/live', label: 'Live Tracking', icon: MapPin },
    { to: '/student/notices/school', label: 'School Notices', icon: Bell, badge: counts.school },
    { to: '/student/notices/class', label: 'Class Notices', icon: Megaphone, badge: counts.class },
  ]

  return (
    <aside
      className={`relative flex min-h-screen w-64 flex-col overflow-y-auto bg-gradient-to-b from-indigo-700 to-indigo-800 px-5 py-6 text-indigo-50 shadow-xl ${className}`}
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
          S
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Student Panel</h1>
          <p className="text-xs text-indigo-200">{assignedClass ? `Class: ${assignedClass.name}` : 'No class assigned'}</p>
        </div>
      </div>

      {/* Links */}
      <nav className="flex flex-1 flex-col gap-1">
        {items.map((i) => {
          const Icon = i.icon
          return (
            <NavLink
              key={i.to}
              to={i.to}
              onClick={() => {
                  // User clicked, clear badge locally for UX
                  if (i.badge) {
                    setCounts(prev => ({ ...prev, [i.label === 'School Notices' ? 'school' : 'class']: 0 }))
                  }
                  if (onClose) onClose()
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-indigo-100 hover:bg-indigo-600/40 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span className="flex-1">{i.label}</span>
              {i.badge > 0 && (
                 <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center flex items-center justify-center font-bold shadow-sm">
                    {i.badge}
                 </span>
              )}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
