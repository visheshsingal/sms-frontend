import React, { useEffect, useState } from 'react'
import API from '../utils/api'
import { MapPin, Loader2 } from 'lucide-react'

export default function DriverRoute(){
  const [data, setData] = useState({ driver: null, bus: null, route: null })
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const load = async ()=>{
      try{
        const res = await API.get('/driver/me')
        console.log('[/driver/me] response:', res.data)
        setData(res.data)
      }catch(err){ console.error(err) }
      setLoading(false)
    }
    load()
  }, [])

  // If route wasn't populated try multiple ways to resolve it:
  // 1) If bus.route contains an id, fetch /admin/routes/:id
  // 2) Otherwise fetch all routes and find one where r.bus === bus._id
  useEffect(() => {
    const fetchRouteIfNeeded = async () => {
      if (loading || !data || data.route) return
      const bus = data.bus
      if (!bus) return

      // Try route id stored on bus
      const tryById = async () => {
        const candidate = bus.route && (typeof bus.route === 'string' ? bus.route : (bus.route._id || bus.route))
        if (!candidate) return null
        try {
          const r = await API.get(`/admin/routes/${candidate}`)
          return r.data
        } catch (e) {
          console.warn('Failed to fetch route by id:', candidate, e?.message || e)
          return null
        }
      }

      // Try route where route.bus === bus._id
      const tryByBusRef = async () => {
        try {
          const rres = await API.get('/admin/routes')
          const routes = rres.data || []
          return routes.find(rt => {
            const bid = rt.bus && (rt.bus._id || rt.bus)
            return String(bid) === String(bus._id)
          }) || null
        } catch (e) {
          console.warn('Failed to fetch all routes to find by bus:', e?.message || e)
          return null
        }
      }

      let resolved = await tryById()
      if (!resolved) resolved = await tryByBusRef()
      if (resolved) {
        console.log('Resolved route for bus:', resolved)
        setData(d => ({ ...d, route: resolved, bus: { ...d.bus, route: resolved } }))
      }
    }
    fetchRouteIfNeeded()
  }, [loading, data])

  if (loading) return <div className="p-6"><Loader2 className="w-6 h-6 animate-spin text-indigo-600"/> Loading...</div>

  const { route, bus } = data
  if (!route) return <div className="p-6 bg-white rounded shadow">No route assigned to your bus.</div>

  const formatTime = (t) => {
    if (!t) return ''
    // already human-friendly?
    if (/[ap]m/i.test(t)) return t
    // expect HH:MM or HH:MM:SS
    const m = t.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/)
    if (!m) return t
    let hh = parseInt(m[1], 10)
    const mm = m[2]
    const ampm = hh >= 12 ? 'pm' : 'am'
    hh = hh % 12
    if (hh === 0) hh = 12
    return `${hh}:${mm} ${ampm}`
  }

  const addMinutesToTime = (start, mins) => {
    if (!start || mins == null) return ''
    const m = String(start).match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/)
    if (!m) return ''
    let hh = parseInt(m[1], 10)
    const mm = parseInt(m[2], 10)
    const total = hh * 60 + mm + Number(mins)
    const nh = Math.floor((total % (24*60)) / 60)
    const nm = total % 60
    const paddedM = String(nm).padStart(2, '0')
    const ampm = nh >= 12 ? 'pm' : 'am'
    const displayH = ((nh % 12) === 0) ? 12 : (nh % 12)
    return `${displayH}:${String(paddedM)} ${ampm}`
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded p-6 shadow mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2"><MapPin className="w-5 h-5 text-indigo-600"/> Route: {route.name}</h3>
          <div className="text-sm text-gray-600">Start time: {formatTime(route.startTime)} {route.startLocation ? `— ${route.startLocation}` : ''}</div>
          <div className="mt-4 space-y-2">
            {route.stops && route.stops.length ? route.stops.map((s, i)=> (
              <div key={i} className="p-3 border rounded bg-gray-50">
                <div className="font-medium">{s.address}</div>
                <div className="text-sm text-gray-600">
                  {s.time
                    ? `Time: ${formatTime(s.time)}`
                    : (s.estimatedMinutes != null && route.startTime
                        ? `Time: ${addMinutesToTime(route.startTime, s.estimatedMinutes)}`
                        : '')}
                </div>
                <div className="text-sm text-gray-700 mt-2">Students: {s.students && s.students.length ? s.students.map(st=> `${st.firstName} ${st.lastName}`).join(', ') : 'No students'}</div>
              </div>
            )) : <div className="text-sm text-gray-500">No stops</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
