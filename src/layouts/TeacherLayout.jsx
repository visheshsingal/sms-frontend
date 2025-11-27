import React, { useEffect, useState } from 'react'
import TeacherSidebar from '../components/TeacherSidebar'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'

export default function TeacherLayout(){
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

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
            <TeacherSidebar
              className="h-full w-64 rounded-r-2xl shadow-2xl lg:hidden"
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex">
        <TeacherSidebar className="hidden lg:flex" />

        <div className="flex min-h-screen flex-1 flex-col">

          {/* 🔥 MOBILE HEADER — Hamburger + Text LEFT */}
          <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm lg:hidden">

            <div className="flex items-center gap-3">
              
              {/* Hamburger */}
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-700 shadow-sm hover:bg-gray-50"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open teacher menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Text */}
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Teacher Portal</h1>
                <p className="text-sm text-gray-500">Classroom & reports</p>
              </div>

            </div>
          </div>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

