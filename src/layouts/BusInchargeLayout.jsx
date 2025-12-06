import React, { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import NotificationBell from '../components/NotificationBell'
import BusInchargeSidebar from '../components/BusInchargeSidebar'

export default function BusInchargeLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()

    useEffect(() => {
        setSidebarOpen(false)
    }, [location.pathname])

    return (
        <div className="relative min-h-screen bg-gray-50">
            {/* Mobile sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 flex lg:hidden" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 bg-gray-900/50" onClick={() => setSidebarOpen(false)} />
                    <div className="relative ml-0 flex h-full w-full max-w-xs">
                        <BusInchargeSidebar
                            className="h-full w-64 rounded-r-2xl shadow-2xl lg:hidden"
                            onClose={() => setSidebarOpen(false)}
                        />
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <div className="flex">
                <BusInchargeSidebar className="hidden lg:flex" />

                <div className="flex min-h-screen flex-1 flex-col">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm lg:hidden">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-700">
                                <Menu className="w-6 h-6" />
                            </button>
                            <span className="font-bold text-gray-800">Bus Incharge</span>
                        </div>
                        <NotificationBell />
                    </div>

                    {/* Desktop Header */}
                    <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 shadow-sm">
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-800">Bus Incharge</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 font-medium">Welcome, Incharge</span>
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
