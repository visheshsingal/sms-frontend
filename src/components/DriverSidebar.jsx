import React from 'react'
import { NavLink } from 'react-router-dom'
import { Bus, User, MapPin, ClipboardList, X } from 'lucide-react'

export default function DriverSidebar({ driver, bus, className = '', onClose }){
  const items = [
    { to: '/driver/profile', label: 'Profile', icon: User },
    { to: '/driver/dashboard', label: 'Assigned Bus', icon: Bus },
    { to: '/driver/route', label: 'Route', icon: MapPin },
    { to: '/driver/notices', label: 'Notices', icon: ClipboardList }
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
      <div className="mb-8 mt-2 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white text-indigo-700 font-bold flex items-center justify-center shadow">D</div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Driver Panel</h1>
          <p className="text-xs text-indigo-200">{driver ? `${driver.firstName} ${driver.lastName}` : 'No profile'}</p>
        </div>
      </div>

      <div className="mb-6 text-sm text-indigo-100">
        <div className="font-medium">Assigned Bus</div>
        <div className="text-xs text-indigo-200">{bus ? `${bus.number}${bus.route && bus.route.name ? ` — ${bus.route.name}` : ''}` : 'No bus assigned'}</div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {items.map(i => {
          const Icon = i.icon
          return (
            <NavLink key={i.to} to={i.to} className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-indigo-100 hover:bg-indigo-600/40 hover:text-white'
              }`
            }>
              <Icon className="w-4 h-4" />
              {i.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
