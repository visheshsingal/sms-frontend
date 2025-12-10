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
  QrCode,
  X,
  Megaphone
} from 'lucide-react'

export default function TeacherSidebar({ className = '', onClose }) {
  const [assignedClass, setAssignedClass] = useState(null)
  const [counts, setCounts] = useState({ leaves: 0, notices: 0 })

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get('/teacher/assigned-class')
        setAssignedClass(res.data || null)
      } catch (err) {
        setAssignedClass(null)
      }
    }
    const loadCounts = async () => {
      try {
        const [leavesRes, noticesRes] = await Promise.all([
          API.get('/leaves?status=pending'),
          // The /api/notices/unread endpoint returns { count, notices: [...] }
          API.get('/notices/unread')
        ])
        
        const leavesCount = leavesRes.data ? leavesRes.data.length : 0
        
        // For teachers, school notices are those without a targetClass (audience: global/teacher)
        const notices = noticesRes.data.notices || []
        const noticesCount = notices.filter(n => !n.targetClass).length
        
        setCounts({ leaves: leavesCount, notices: noticesCount })
      } catch (err) {
        console.error(err)
      }
    }
    load()
    loadCounts()
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
    { to: '/teacher/leaves', label: 'Leaves', icon: FileText, badge: counts.leaves },
    { to: '/teacher/notices/school', label: 'School Notices', icon: Bell, badge: counts.notices },
    { to: '/teacher/notices/my', label: 'My Announcements', icon: Megaphone },
    { to: '/teacher/qr-scanner', label: 'QR Scanner', icon: QrCode },
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
      <nav className="flex flex-1 flex-col gap-1">
        {items.map((i) => {
          const Icon = i.icon
          return (
            <NavLink
              key={i.to}
              to={i.to}
              onClick={() => {
                // Clear badge locally
                if (i.badge) {
                  if (i.label === 'Leaves') setCounts(p => ({ ...p, leaves: 0 }))
                  if (i.label === 'School Notices') setCounts(p => ({ ...p, notices: 0 }))
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
