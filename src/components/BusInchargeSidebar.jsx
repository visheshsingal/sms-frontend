import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Bus, Map, ClipboardList, MapPin, QrCode, X, LogOut } from 'lucide-react'

export default function BusInchargeSidebar({ className = '', onClose }) {
    const items = [
        { to: '/bus-incharge/dashboard', label: 'Dashboard', icon: Home },
        { to: '/bus-incharge/buses', label: 'Buses', icon: Bus },
        { to: '/bus-incharge/routes', label: 'Routes', icon: Map },
        { to: '/bus-incharge/attendance/morning', label: 'Morning Attendance', icon: ClipboardList },
        { to: '/bus-incharge/attendance/evening', label: 'Evening Attendance', icon: ClipboardList },
        { to: '/bus-incharge/scan/morning', label: 'Morning Scan', icon: QrCode },
        { to: '/bus-incharge/scan/evening', label: 'Evening Scan', icon: QrCode },
        { to: '/bus-incharge/live', label: 'Live Tracking', icon: MapPin },
    ]

    const logout = () => {
        localStorage.clear()
        window.location.href = '/'
    }

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

            <div className="mb-8 mt-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white text-indigo-700 font-bold flex items-center justify-center shadow">BI</div>
                <div>
                    <h1 className="text-lg font-semibold tracking-tight">Incharge Portal</h1>
                    <p className="text-xs text-indigo-200">Bus Management</p>
                </div>
            </div>

            <nav className="flex flex-1 flex-col gap-1">
                {items.map((i) => {
                    const Icon = i.icon
                    return (
                        <NavLink
                            key={i.to}
                            to={i.to}
                            onClick={onClose} // Auto-close on mobile when clicked
                            end={i.to === '/bus-incharge/dashboard'} // Exact match for dashboard
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${isActive
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

            <div className="mt-auto border-t border-indigo-600 pt-4">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-indigo-100 hover:bg-red-600/20 hover:text-white transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </aside>
    )
}
