import React, { useEffect, useState } from 'react'
import API from '../utils/api'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'

export default function LiveTrackingStudent(){
  const [loading, setLoading] = useState(true)
  const [routeInfo, setRouteInfo] = useState(null)
  const [live, setLive] = useState(null)

  useEffect(()=>{
    const load = async ()=>{
      try{
        const res = await API.get('/student/me')
        const data = res.data || {}
        const rres = await API.get('/admin/routes')
        const routes = rres.data || []
        const sid = String(data.student?._id)
        for (const r of routes){
          if (!r.stops) continue
          for (const s of r.stops){
            const studs = (s.students||[]).map(x => String(x._id || x))
            if (studs.includes(sid)) { setRouteInfo({ route: r, stop: s }); break }
          }
          if (routeInfo) break
        }
      }catch(e){ console.warn(e) }
      setLoading(false)
    }
    load()
  }, [])

  useEffect(()=>{
    let poll = null
    const start = async (busId)=>{
      try{ const r = await API.get(`/admin/buses/${busId}/live`); setLive(r.data?.live || null) }catch(e){}
      poll = setInterval(async ()=>{ try{ const r = await API.get(`/admin/buses/${busId}/live`); setLive(r.data?.live || null) }catch(e){} }, 8000)
    }
    if (routeInfo && routeInfo.route && routeInfo.route.bus) {
      const busId = routeInfo.route.bus._id || routeInfo.route.bus
      start(busId)
    }
    return ()=>{ if (poll) clearInterval(poll) }
  }, [routeInfo])

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Live Tracking (Student)</h2>
      {!routeInfo ? <div className="text-sm text-gray-600">No bus/route assigned to you.</div> : (
        <div>
          <div className="font-semibold">{routeInfo.route.name}</div>
          {live && live.lastLocation ? (
            <div className="relative z-0 mt-4 overflow-hidden rounded border">
              <div className="p-3 text-xs text-gray-600">Last updated: {live.updatedAt ? new Date(live.updatedAt).toLocaleString() : ''}</div>
              <MapContainer className="z-0" center={[Number(live.lastLocation.lat), Number(live.lastLocation.lng)]} zoom={15} style={{ height: 360, width: '100%', zIndex: 0 }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <CircleMarker center={[Number(live.lastLocation.lat), Number(live.lastLocation.lng)]} radius={7}>
                  <Popup>Last seen • {live.updatedAt ? new Date(live.updatedAt).toLocaleTimeString() : ''}</Popup>
                </CircleMarker>
              </MapContainer>
            </div>
          ) : <div className="text-sm text-gray-600 mt-4">No live location yet.</div>}
        </div>
      )}
    </div>
  )
}
