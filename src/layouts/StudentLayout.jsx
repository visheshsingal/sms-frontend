import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import StudentSidebar from '../components/StudentSidebar'
import NotificationBell from '../components/NotificationBell'
import API from '../utils/api'
import { Menu } from 'lucide-react'

export default function StudentLayout() {
  const [cls, setCls] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get('/student/me')
        setCls(res.data.class)
      } catch (err) {
        console.error(err)
        if (err?.response?.status === 401) navigate('/student')
      }
    }
    load()
  }, [])

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="relative min-h-screen bg-gray-50">

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-gray-900/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative ml-0 flex h-full w-full max-w-xs">
            <StudentSidebar
              studentClass={cls}
              className="h-full w-64 rounded-r-2xl shadow-2xl lg:hidden"
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex">
        <StudentSidebar studentClass={cls} className="hidden lg:flex" />

        <div className="flex min-h-screen flex-1 flex-col">

          {/* 🔥 MOBILE HEADER — Hamburger + Text LEFT */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm lg:hidden">

            <div className="flex items-center gap-3">
              {/* Hamburger */}
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-700 shadow-sm hover:bg-gray-50"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open student menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Text */}
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Student Portal</h1>
                <p className="text-sm text-gray-500">Access your dashboard</p>
              </div>
              </div>

            <NotificationBell />
          </div>

          {/* 🔥 DESKTOP HEADER */}
          <header className="hidden lg:flex items-center justify-end px-8 py-4 bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 font-medium">Welcome, Student</span>
              <div className="h-6 w-px bg-gray-200"></div>
              <NotificationBell />
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
