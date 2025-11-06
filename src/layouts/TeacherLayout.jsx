import React from 'react'
import TeacherSidebar from '../components/TeacherSidebar'
import { Outlet } from 'react-router-dom'

export default function TeacherLayout(){
  return (
    <div className="min-h-screen flex bg-gray-50">
      <TeacherSidebar />
      <div className="flex-1">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
