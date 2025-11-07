import React, { useEffect, useRef, useState } from 'react'
import API from '../utils/api'
import { Play, Pause } from 'lucide-react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'

export default function LiveTrackingDriver(){
  const [data, setData] = useState({ driver: null, bus: null })
  const [isSharing, setIsSharing] = useState(false)
  const [live, setLive] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const watchRef = useRef(null)

  useEffect(()=>{
    const load = async ()=>{
      try{
        const res = await API.get('/driver/me')
        setData(res.data || {})
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
    setError(null)
    setLoading(true)
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try{
        const { latitude: lat, longitude: lng } = pos.coords
        const r = await API.post('/driver/ride/start', { lat, lng })
        setLive(r.data?.live || { lastLocation: { lat, lng }, active: true })
        setIsSharing(true)
        watchRef.current = navigator.geolocation.watchPosition((p)=>{
          const { latitude, longitude } = p.coords
          sendLocation(latitude, longitude)
          setLive(prev=>({...prev, lastLocation: { lat: latitude, lng: longitude }, updatedAt: new Date(), active: true }))
        }, (e)=> setError(e?.message || 'watch error'), { enableHighAccuracy:true })
      }catch(e){ setError(e?.response?.data?.error || e.message || String(e)) }
      finally{ setLoading(false) }
    }, (e)=>{ setError(e?.message || 'Unable to get location'); setLoading(false) }, { enableHighAccuracy: true })
  }

  const stop = async () => {
    try{
      await API.post('/driver/ride/stop')
      setIsSharing(false)
      if (watchRef.current != null) { navigator.geolocation.clearWatch(watchRef.current); watchRef.current = null }
      if (data.bus && (data.bus._id || data.bus.id)) {
        const id = data.bus._id || data.bus.id
        const r = await API.get(`/admin/buses/${id}/live`)
        setLive(r.data?.live || null)
      }
    }catch(e){ setError(e?.response?.data?.error || e.message || String(e)) }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Live Tracking (Driver)</h2>
      <div className="space-y-4">
        <div>Bus: {data.bus ? (data.bus.number || data.bus) : 'No bus assigned'}</div>
        <div className="flex items-center gap-3">
          {!isSharing ? (
            <button onClick={start} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded inline-flex items-center gap-2"> <Play/> {loading ? 'Starting...' : 'Start Ride'}</button>
          ) : (
            <button onClick={stop} className="px-4 py-2 bg-red-600 text-white rounded inline-flex items-center gap-2"> <Pause/> Stop Ride</button>
          )}
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
        </div>
        {live && live.lastLocation ? (
          <div className="relative z-0 mt-4 overflow-hidden rounded border">
            <div className="p-3 text-xs text-gray-600">Last updated: {live.updatedAt ? new Date(live.updatedAt).toLocaleString() : ''}</div>
            <MapContainer className="z-0" center={[Number(live.lastLocation.lat), Number(live.lastLocation.lng)]} zoom={15} style={{ height: 360, width: '100%', zIndex: 0 }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <CircleMarker center={[Number(live.lastLocation.lat), Number(live.lastLocation.lng)]} radius={8}>
                <Popup>Last seen • {live.updatedAt ? new Date(live.updatedAt).toLocaleTimeString() : ''}</Popup>
              </CircleMarker>
            </MapContainer>
          </div>
        ) : null}
      </div>
    </div>
  )
}
