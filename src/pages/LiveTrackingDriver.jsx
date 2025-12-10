import React, { useEffect, useRef, useState } from 'react'
import API from '../utils/api'
import { Play, Pause } from 'lucide-react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'

export default function LiveTrackingDriver(){
  const [data, setData] = useState({ driver: null, bus: null })
  const [isSharing, setIsSharing] = useState(false)
  const [live, setLive] = useState(null)
    const [selectedBus, setSelectedBus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const watchRef = useRef(null)
  const pollRef = useRef(null)

  useEffect(()=>{
    const load = async ()=>{
      try{
        const res = await API.get('/driver/me')
        const payload = res.data || {}
        setData(payload)
          // auto-select when driver has exactly one bus
          if (Array.isArray(payload.buses) && payload.buses.length === 1) setSelectedBus(payload.buses[0])
      }catch(e){ console.warn(e) }
    }
    load()
  }, [])

  const sendLocation = async (lat, lng) => {
    try { await API.post('/driver/ride/location', { lat, lng }) } catch (e) { console.warn('sendLocation failed', e) }
  }

  const start = async () => {
    if (!navigator.geolocation) return setError('Geolocation not supported')
    if (!data.bus) return setError('No bus assigned')
      const bus = selectedBus || data.bus || (Array.isArray(data.buses) && data.buses[0])
      if (!bus) return setError('No bus assigned')
      const busId = bus._id || bus.id || bus
    setError(null)
    setLoading(true)
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try{
        const { latitude: lat, longitude: lng } = pos.coords
        const r = await API.post('/driver/ride/start', { lat, lng, busId })
        setLive(r.data?.live || { lastLocation: { lat, lng }, active: true })
        setIsSharing(true)

        // Primary: use watchPosition for continuous updates
        watchRef.current = navigator.geolocation.watchPosition((p)=>{
          const { latitude, longitude } = p.coords
          sendLocation(latitude, longitude)
          setLive(prev=>({...prev, lastLocation: { lat: latitude, lng: longitude }, updatedAt: new Date(), active: true }))
        }, (e)=> setError(e?.message || 'watch error'), { enableHighAccuracy:true })

        // Secondary: start a 5s polling fallback to ensure updates even when watch callbacks may be throttled
        if (pollRef.current == null) {
          pollRef.current = setInterval(() => {
            navigator.geolocation.getCurrentPosition((p) => {
              const { latitude, longitude } = p.coords
              sendLocation(latitude, longitude)
              setLive(prev=>({...prev, lastLocation: { lat: latitude, lng: longitude }, updatedAt: new Date(), active: true }))
            }, (e) => { /* ignore individual failures */ }, { enableHighAccuracy: true })
          }, 5000)
        }
      }catch(e){ setError(e?.response?.data?.error || e.message || String(e)) }
      finally{ setLoading(false) }
    }, (e)=>{ setError(e?.message || 'Unable to get location'); setLoading(false) }, { enableHighAccuracy: true })
  }

  const stop = async () => {
    try{
      const bus = selectedBus || data.bus || (Array.isArray(data.buses) && data.buses[0])
      const busId = bus? (bus._id || bus.id || bus) : undefined
      await API.post('/driver/ride/stop', busId ? { busId } : {})
      setIsSharing(false)
      if (watchRef.current != null) { navigator.geolocation.clearWatch(watchRef.current); watchRef.current = null }
      if (pollRef.current != null) { clearInterval(pollRef.current); pollRef.current = null }
      if (data.bus && (data.bus._id || data.bus.id)) {
        const id = data.bus._id || data.bus.id
        const r = await API.get(`/admin/buses/${id}/live`)
        setLive(r.data?.live || null)
      }
    }catch(e){ setError(e?.response?.data?.error || e.message || String(e)) }
  }

  // Try to maintain polling/updates when visibility changes (best-effort).
  useEffect(() => {
    const onVis = () => {
      if (!isSharing) return
      // when tab becomes visible, re-establish a getCurrentPosition (forces an immediate update)
      if (!document.hidden) {
        navigator.geolocation.getCurrentPosition((p)=>{
          const { latitude, longitude } = p.coords
          sendLocation(latitude, longitude)
          setLive(prev=>({...prev, lastLocation: { lat: latitude, lng: longitude }, updatedAt: new Date(), active: true }))
        }, ()=>{}, { enableHighAccuracy: true })
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [isSharing])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Live Tracking (Driver)</h2>
      <div className="space-y-4">
        <div>
          Bus: {(!Array.isArray(data.buses) || data.buses.length <= 1) ? (
            data.bus ? (data.bus.number || data.bus) : (Array.isArray(data.buses) && data.buses[0] ? (data.buses[0].number || data.buses[0]) : 'No bus assigned')
          ) : (
            <select value={selectedBus?._id || (selectedBus?.id) || selectedBus || ''} onChange={(e)=>{
              const id = e.target.value
              const found = data.buses.find(b => (b._id || b.id || b) === id)
              setSelectedBus(found || id)
            }} className="border rounded p-1">
              <option value="">Select bus</option>
              {data.buses.map(b => (
                <option key={b._id || b.id || b} value={b._id || b.id || b}>{b.number || (b._id || b.id || b)}</option>
              ))}
            </select>
          )}
        </div>
        <div className="flex items-center gap-3">
          {!isSharing ? (
            <button onClick={start} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded inline-flex items-center gap-2"> <Play/> {loading ? 'Starting...' : 'Start Ride'}</button>
          ) : (
            <button onClick={stop} className="px-4 py-2 bg-red-600 text-white rounded inline-flex items-center gap-2"> <Pause/> Stop Ride</button>
          )}
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
        </div>
        {live && live.lastLocation && isFinite(Number(live.lastLocation.lat)) && isFinite(Number(live.lastLocation.lng)) ? (
          <div className="relative z-0 mt-4 overflow-hidden rounded border">
            <div className="p-3 text-xs text-gray-600">Last updated: {live.updatedAt ? new Date(live.updatedAt).toLocaleString() : ''}</div>
            <MapContainer className="z-0" center={[Number(live.lastLocation.lat), Number(live.lastLocation.lng)]} zoom={15} style={{ height: 360, width: '100%', zIndex: 0 }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <CircleMarker center={[Number(live.lastLocation.lat), Number(live.lastLocation.lng)]} radius={8}>
                <Popup>Last seen • {live.updatedAt ? new Date(live.updatedAt).toLocaleTimeString() : ''}</Popup>
              </CircleMarker>
            </MapContainer>
          </div>
        ) : <div className="text-sm text-gray-600">No live location available yet.</div>}
      </div>
    </div>
  )
}
