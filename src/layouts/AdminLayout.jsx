import React from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

export default function AdminLayout(){
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
