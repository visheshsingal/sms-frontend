import React, { useEffect, useState } from 'react'
import API from '../../utils/api'
import { MapPin, Loader2 } from 'lucide-react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'

export default function StudentTransport(){
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [routeInfo, setRouteInfo] = useState(null)
  const [live, setLive] = useState(null)

  const formatTime = (t) => {
    if (!t) return ''
    if (/[ap]m/i.test(t)) return t
    const m = String(t).match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/)
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

  useEffect(()=>{
    const load = async ()=>{
      try{
        const res = await API.get('/student/me')
        setData(res.data)
      }catch(err){ console.error('Failed to load student/me', err) }
      setLoading(false)
    }
    load()
  }, [])

  useEffect(()=>{
    const find = async () => {
      if (!data || !data.student) return
      try{
        const rres = await API.get('/admin/routes')
        const routes = rres.data || []
        const sid = String(data.student._id)
        for (const r of routes){
          if (!r.stops) continue
          for (const s of r.stops){
            const studs = (s.students||[]).map(x => String(x._id || x))
            if (studs.includes(sid)) {
              console.log('Found student route match', { route: r, stop: s })
              setRouteInfo({ route: r, stop: s })
              return
            }
          }
        }
        setRouteInfo(null)
      }catch(e){ console.warn('Failed to load routes for student transport', e?.message || e) }
    }
    find()
  }, [data])

  // poll live location for the assigned bus (if any)
  useEffect(() => {
    let poll = null
    const start = async (busId) => {
      try {
        const r = await API.get(`/admin/buses/${busId}/live`)
        setLive(r.data?.live || null)
      } catch (e) { console.warn('Failed to fetch live bus', e) }
      poll = setInterval(async () => {
        try { const r = await API.get(`/admin/buses/${busId}/live`); setLive(r.data?.live || null) } catch (e) {}
      }, 8000)
    }
    if (routeInfo && routeInfo.route && routeInfo.route.bus) {
      const busId = (routeInfo.route.bus._id || routeInfo.route.bus)
      if (busId) start(busId)
    }
    return () => { if (poll) clearInterval(poll) }
  }, [routeInfo])

  if (loading) return <div className="p-6"><Loader2 className="w-6 h-6 animate-spin text-indigo-600"/> Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2"><MapPin className="w-5 h-5 text-indigo-600"/> My Transport</h2>
          {!routeInfo ? (
            <div className="mt-4 text-sm text-gray-600">No bus/route assigned to you.</div>
          ) : (
            <div className="mt-4">
              <div className="font-semibold text-lg">{routeInfo.route.name}</div>
              <div className="text-sm text-gray-600">Start time: {formatTime(routeInfo.route.startTime)} {routeInfo.route.startLocation ? `— ${routeInfo.route.startLocation}` : ''}</div>
              <div className="mt-3 p-3 bg-gray-50 rounded border">
                <div className="font-medium">Your stop</div>
                <div className="text-sm text-gray-700">{routeInfo.stop.address}</div>
                {routeInfo.stop.time ? (
                  <div className="text-sm text-gray-600 mt-1">Stop time: {formatTime(routeInfo.stop.time)}</div>
                ) : routeInfo.stop.estimatedMinutes != null ? (
                  <div className="text-sm text-gray-600 mt-1">Stop time: {addMinutesToTime(routeInfo.route.startTime, routeInfo.stop.estimatedMinutes)}</div>
                ) : null}
              </div>
              <div className="mt-4 text-sm text-gray-700">
                <div className="font-medium">Bus</div>
                <div>{routeInfo.route.bus ? (routeInfo.route.bus.number || routeInfo.route.bus) : '—'}</div>
                {live ? (
                  <div className="mt-2 text-sm">
                    <div className="font-medium">Live status: {live.active ? <span className="text-green-600">Active</span> : <span className="text-gray-600">Inactive</span>}</div>
                        {live.lastLocation && Number.isFinite(Number(live.lastLocation.lat)) && Number.isFinite(Number(live.lastLocation.lng)) ? (
                          <div>
                            <div className="text-xs text-gray-600">Last: {Number(live.lastLocation.lat).toFixed(5)}, {Number(live.lastLocation.lng).toFixed(5)} • Updated: {live.updatedAt ? new Date(live.updatedAt).toLocaleTimeString() : '—'}</div>
                            <div className="mt-2 border rounded overflow-hidden">
                              <MapContainer center={[Number(live.lastLocation.lat), Number(live.lastLocation.lng)]} zoom={15} style={{ height: 200, width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <CircleMarker center={[Number(live.lastLocation.lat), Number(live.lastLocation.lng)]} radius={7} pathOptions={{ color: '#059669', fillColor: '#059669' }}>
                                  <Popup>Bus last seen here • {live.updatedAt ? new Date(live.updatedAt).toLocaleTimeString() : ''}</Popup>
                                </CircleMarker>
                              </MapContainer>
                            </div>
                          </div>
                        ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
