import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import API from '../utils/api'
import { Play, Pause, MapPin } from 'lucide-react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'

function DriverDashboardInner(){
  const { selectedBus, driver } = useOutletContext() || {}
  const [data, setData] = useState({ driver: null, bus: null })
  const [isSharing, setIsSharing] = useState(false)
  const [live, setLive] = useState(null)
  const [startLoading, setStartLoading] = useState(false)
  const [startError, setStartError] = useState(null)
  const watchRef = React.useRef(null)
  const pollRef = React.useRef(null)

  useEffect(()=>{
      if(selectedBus) {
          setData({ driver, bus: selectedBus })
      }
  }, [selectedBus, driver])

  // fetch live info for this bus (and poll when available)
  useEffect(() => {
    let poll = null
    const startPoll = async (busId) => {
      try {
        const r = await API.get(`/admin/buses/${busId}/live`)
        setLive(r.data?.live || null)
      } catch (e) { console.warn('Failed to fetch bus live state', e) }
      poll = setInterval(async () => {
        try { const r = await API.get(`/admin/buses/${busId}/live`); setLive(r.data?.live || null) } catch (e) {}
      }, 8000)
    }
    if (data.bus && (data.bus._id || data.bus.id)) {
      const id = data.bus._id || data.bus.id
      startPoll(id)
    }
    return () => { if (poll) clearInterval(poll); if (watchRef.current != null) navigator.geolocation.clearWatch(watchRef.current) }
  }, [data.bus])

  const sendLocation = async (lat, lng) => {
    try {
      // optimistic update so UI moves immediately
      setLive(prev => ({ ...(prev||{}), lastLocation: { lat: Number(lat), lng: Number(lng) }, updatedAt: new Date(), active: true }))
      setLive(prev => ({ ...(prev||{}), lastLocation: { lat: Number(lat), lng: Number(lng) }, updatedAt: new Date(), active: true }))
      await API.post('/driver/ride/location', { lat, lng, busId: data.bus?._id })
    } catch (e) {
      console.warn('Failed to send location', e)
    }
  }

  const startRide = async () => {
    if (!navigator.geolocation) {
      setStartError('Geolocation is not available in this browser')
      return
    }
    setStartError(null)
    setStartLoading(true)
    try {
        // ensure driver has a bus assigned before asking for location
        if (!data || !data.bus) {
          setStartLoading(false)
          setStartError('No bus assigned to your profile. Ask admin to assign a bus first.')
          return
        }

      // check permission state when available to give clearer feedback
      try {
        if (navigator.permissions && navigator.permissions.query) {
          const p = await navigator.permissions.query({ name: 'geolocation' })
          if (p.state === 'denied') {
            setStartLoading(false)
            setStartError('Location permission denied. Enable location for this site in your browser settings.')
            return
          }
        }
      } catch (permErr) {
        // ignore permission API errors and continue to prompt
      }

      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude: lat, longitude: lng } = pos.coords
          console.log('Starting ride with position', lat, lng)
          console.log('Starting ride with position', lat, lng)
          await API.post('/driver/ride/start', { lat, lng, busId: data.bus?._id })
          setIsSharing(true)
          setLive(prev => ({ ...(prev||{}), lastLocation: { lat: Number(lat), lng: Number(lng) }, updatedAt: new Date(), active: true }))
          // start watch
          if (navigator.geolocation.watchPosition) {
            watchRef.current = navigator.geolocation.watchPosition((p) => {
              const { latitude, longitude } = p.coords
              console.log('watchPosition update', latitude, longitude)
              sendLocation(latitude, longitude)
            }, (err) => {
              console.warn('watchPosition error', err)
              setStartError(err?.message || 'watchPosition error')
            }, { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 })
          } else {
            // fallback: poll getCurrentPosition every 8s
            pollRef.current = setInterval(() => {
              navigator.geolocation.getCurrentPosition((p2) => {
                const { latitude, longitude } = p2.coords
                sendLocation(latitude, longitude)
                setLive(prev => ({ ...(prev||{}), lastLocation: { lat: Number(latitude), lng: Number(longitude) }, updatedAt: new Date(), active: true }))
              }, (e2) => { console.warn('poll getCurrentPosition error', e2) }, { enableHighAccuracy: true })
            }, 8000)
          }
        } catch (e) {
          console.error('Failed to start ride', e)
          // prefer explicit error field from server then message
          setStartError(e?.response?.data?.error || e?.response?.data?.message || e.message || String(e))
        } finally {
          setStartLoading(false)
        }
      }, (err) => {
        console.error('Geolocation error', err)
        setStartLoading(false)
        setStartError(err?.message || 'Unable to access location. Allow location permissions and try again.')
      }, { enableHighAccuracy: true })
    } catch (err) {
      console.error('startRide error', err)
      setStartLoading(false)
      setStartError(err?.message || String(err))
    }
  }

  const refreshLive = async () => {
    try {
      // ensure we have fresh driver->bus info
      let busId = data?.bus?._id || data?.bus?.id
      if (!busId) {
           return
      }
      if (!busId) {
        setStartError('No bus assigned to refresh live location')
        return
      }
      const r = await API.get(`/admin/buses/${busId}/live`)
      setLive(r.data?.live || null)
    } catch (e) { console.warn('refreshLive failed', e); setStartError('Failed to refresh live location') }
  }

  const stopRide = async () => {
    try {
      await API.post('/driver/ride/stop', { busId: data.bus?._id })
      setIsSharing(false)
      if (watchRef.current != null) { navigator.geolocation.clearWatch(watchRef.current); watchRef.current = null }
      if (pollRef.current != null) { clearInterval(pollRef.current); pollRef.current = null }
      // refresh live state
      if (data.bus && (data.bus._id || data.bus.id)) {
        const id = data.bus._id || data.bus.id
        const r = await API.get(`/admin/buses/${id}/live`)
        setLive(r.data?.live || null)
      }
    } catch (e) { console.warn('stopRide failed', e) }
  }

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchRef.current != null && navigator.geolocation && navigator.geolocation.clearWatch) navigator.geolocation.clearWatch(watchRef.current)
      if (pollRef.current != null) clearInterval(pollRef.current)
    }
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Driver Dashboard <span className="text-xs text-gray-400">v1.1</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-white shadow">
          <h3 className="font-semibold">Profile</h3>
          {data.driver ? (
            <div className="mt-2 text-sm text-gray-700">
              <div><strong>Name:</strong> {data.driver.firstName} {data.driver.lastName}</div>
              <div><strong>Phone:</strong> {data.driver.phone || '—'}</div>
              <div><strong>License:</strong> {data.driver.licenseNumber || '—'}</div>
            </div>
          ) : <div className="text-sm text-gray-500">No profile loaded</div>}
        </div>

        <div className="p-4 rounded-lg bg-white shadow">
          <h3 className="font-semibold">Assigned Bus</h3>
          {data.bus ? (
            <div className="mt-2 text-sm text-gray-700">
              <div><strong>Number:</strong> {data.bus.number}</div>
              {data.bus.morningRoute && (<div><strong>Morning Route:</strong> {data.bus.morningRoute.name}</div>)}
              {data.bus.eveningRoute && (<div><strong>Evening Route:</strong> {data.bus.eveningRoute.name}</div>)}
              <div><strong>Capacity:</strong> {data.bus.capacity}</div>
              <div className="mt-3">
                {live && live.active ? (
                  <div className="text-sm text-green-600">Ride active • Last: {live.lastLocation ? `${live.lastLocation.lat.toFixed(5)}, ${live.lastLocation.lng.toFixed(5)}` : 'no location yet'}</div>
                ) : (
                  <div className="text-sm text-gray-600">Ride inactive</div>
                )}
              </div>
              {live && live.updatedAt ? (
                <div className="text-xs text-gray-500 mt-1">Last updated: {new Date(live.updatedAt).toLocaleString()}</div>
              ) : null}
              {live && live.lastLocation && Number.isFinite(Number(live.lastLocation.lat)) && Number.isFinite(Number(live.lastLocation.lng)) ? (
                (() => {
                  const lat = Number(live.lastLocation.lat)
                  const lng = Number(live.lastLocation.lng)
                  return (
                    <div className="mt-3 border rounded overflow-hidden">
                      <MapContainer center={[lat, lng]} zoom={15} style={{ height: 220, width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <CircleMarker center={[lat, lng]} radius={8} pathOptions={{ color: '#2563EB', fillColor: '#2563EB' }}>
                          <Popup>Driver last seen here • {new Date(live.updatedAt || Date.now()).toLocaleTimeString()}</Popup>
                        </CircleMarker>
                      </MapContainer>
                    </div>
                  )
                })()
              ) : null}
              <div className="mt-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  {!isSharing ? (
                    <button onClick={startRide} disabled={startLoading} className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded"> <Play className="w-4 h-4"/> {startLoading ? 'Starting...' : 'Start Ride'}</button>
                  ) : (
                    <button onClick={stopRide} className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded"> <Pause className="w-4 h-4"/> Stop Ride</button>
                  )}
                  <button onClick={refreshLive} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-200 text-gray-800 rounded">Refresh</button>
                  <div className="text-xs text-gray-500">Driver location will be shared with students & admin</div>
                </div>
                {startError ? <div className="text-sm text-red-600">{startError}</div> : null}
              </div>
            </div>
          ) : <div className="text-sm text-gray-500">No bus assigned</div>}
        </div>
      </div>
    </div>
  )
}

// Simple ErrorBoundary to catch render errors and show helpful info instead of blank white
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 text-red-800 rounded">
          <h3 className="font-semibold">Something went wrong rendering this page</h3>
          <div className="mt-2 text-sm">{String(this.state.error)}</div>
        </div>
      )
    }
    return this.props.children
  }
}

export default function DriverDashboard(){
  return (
    <ErrorBoundary>
      <DriverDashboardInner />
    </ErrorBoundary>
  )
}
