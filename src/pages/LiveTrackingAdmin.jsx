import React, { useEffect, useState } from 'react'
import API from '../utils/api'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'

export default function LiveTrackingAdmin(){
  const [buses, setBuses] = useState([])
  const [selected, setSelected] = useState(null)
  const [live, setLive] = useState(null)

  useEffect(()=>{ const load = async ()=>{ try{ const r = await API.get('/admin/buses'); setBuses(r.data || []) }catch(e){ setBuses([]) } }; load() }, [])

  useEffect(()=>{
    let poll = null
    const start = async (busId)=>{
      try{ const r = await API.get(`/admin/buses/${busId}/live`); setLive(r.data?.live || null) }catch(e){}
      poll = setInterval(async ()=>{ try{ const r = await API.get(`/admin/buses/${busId}/live`); setLive(r.data?.live || null) }catch(e){} }, 5000)
    }
    if (selected) start(selected)
    return ()=>{ if (poll) clearInterval(poll) }
  }, [selected])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Live Tracking (Admin)</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Select Bus</label>
        <select value={selected||''} onChange={e=>setSelected(e.target.value)} className="px-3 py-2 border rounded">
          <option value="">-- choose bus --</option>
          {buses.map(b=> <option key={b._id} value={b._id}>{b.number} {b.route && b.route.name ? `— ${b.route.name}` : ''}</option>)}
        </select>
      </div>
      {live && live.lastLocation ? (
        <div className="relative z-0 overflow-hidden rounded border">
          <div className="p-3 text-xs text-gray-600">Last updated: {live.updatedAt ? new Date(live.updatedAt).toLocaleString() : ''}</div>
          <MapContainer className="z-0" center={[Number(live.lastLocation.lat), Number(live.lastLocation.lng)]} zoom={14} style={{ height: 420, width: '100%', zIndex: 0 }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <CircleMarker center={[Number(live.lastLocation.lat), Number(live.lastLocation.lng)]} radius={8}>
              <Popup>Last seen • {live.updatedAt ? new Date(live.updatedAt).toLocaleTimeString() : ''}</Popup>
            </CircleMarker>
          </MapContainer>
        </div>
      ) : (
        <div className="text-sm text-gray-600">Select a bus to view live location</div>
      )}
    </div>
  )
}
