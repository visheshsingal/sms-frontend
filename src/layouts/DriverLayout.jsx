import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import DriverSidebar from '../components/DriverSidebar'
import API from '../utils/api'
import { Menu } from 'lucide-react'

export default function DriverLayout(){
  const [data, setData] = useState({ driver: null, bus: null })
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(()=>{
    const load = async ()=>{
      try{
        const res = await API.get('/driver/me')
        const payload = res.data || {}
        // if server didn't populate route but bus has a route id, fetch it
        if (!payload.route && payload.bus && payload.bus.route) {
          try {
            const routeId = typeof payload.bus.route === 'string' ? payload.bus.route : (payload.bus.route._id || payload.bus.route)
            if (routeId) {
              const r = await API.get(`/admin/routes/${routeId}`)
              payload.route = r.data
              payload.bus = { ...payload.bus, route: r.data }
            }
          } catch (e) {
            console.warn('Failed to fetch route for driver layout:', e?.message || e)
          }
        }
        setData(payload)
      }catch(err){
        console.error(err)
        if (err?.response?.status === 401) navigate('/driver')
      }
    }
    load()
  }, [])

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="relative min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-gray-900/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative ml-0 flex h-full w-full max-w-xs">
            <DriverSidebar
              driver={data.driver}
              bus={data.bus}
              className="h-full w-64 rounded-r-2xl shadow-2xl lg:hidden"
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex">
        <DriverSidebar driver={data.driver} bus={data.bus} className="hidden lg:flex" />
        <div className="flex min-h-screen flex-1 flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm lg:hidden">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Driver Portal</h1>
              <p className="text-sm text-gray-500">Routes & attendance</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-700 shadow-sm hover:bg-gray-50"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open driver menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
