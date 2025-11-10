import React, { useEffect, useState } from 'react'
import API from '../utils/api'
import { Bus, User, Save, Edit2, Trash2, PlusCircle } from 'lucide-react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'

function BusRow({ b, onEdit, onDelete }){
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-white/80 px-4 py-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
  <div className="text-lg font-semibold text-gray-900">Bus {b.number} — {b.route && b.route.name ? b.route.name : (b.route || 'No route')}</div>
        <div className="text-sm text-gray-500">
          Capacity: {b.capacity} • Driver: {b.driver ? `${b.driver.firstName} ${b.driver.lastName}` : 'Unassigned'}
        </div>
        {b.live && b.live.lastLocation && Number.isFinite(Number(b.live.lastLocation.lat)) && Number.isFinite(Number(b.live.lastLocation.lng)) ? (
            <div className="h-32 w-full max-w-xs overflow-hidden rounded border sm:h-28">
              <div className="p-1 text-xs text-gray-500">Last updated: {b.live.updatedAt ? new Date(b.live.updatedAt).toLocaleTimeString() : '—'}</div>
              <MapContainer center={[Number(b.live.lastLocation.lat), Number(b.live.lastLocation.lng)]} zoom={13} style={{ height: 'calc(100% - 24px)', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <CircleMarker center={[Number(b.live.lastLocation.lat), Number(b.live.lastLocation.lng)]} radius={6} pathOptions={{ color: '#ef4444', fillColor: '#ef4444' }}>
                  <Popup>Last: {b.live.updatedAt ? new Date(b.live.updatedAt).toLocaleTimeString() : '—'}</Popup>
                </CircleMarker>
              </MapContainer>
            </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <button onClick={()=>onEdit(b)} className="flex items-center justify-center gap-1 rounded-lg border border-indigo-500 px-3 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"> <Edit2 size={14}/> Edit</button>
        <button onClick={()=>onDelete(b._id)} className="flex items-center justify-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"> <Trash2 size={14}/> Delete</button>
      </div>
    </div>
  )
}

export default function Buses(){
  const [buses, setBuses] = useState([])
  const [drivers, setDrivers] = useState([])
  const [form, setForm] = useState({ number: '', capacity: 20, driver: '' })
  const [editing, setEditing] = useState(null)

  const load = async ()=>{ const res = await API.get('/admin/buses'); setBuses(res.data) }
  const loadDrivers = async ()=>{ try{ const r = await API.get('/admin/drivers'); setDrivers(r.data) }catch(e){ setDrivers([]) } }

  useEffect(()=>{ load(); loadDrivers() }, [])

  const submit = async (e)=>{
    e.preventDefault()
    try{
      // prepare payload: send null for unassigned driver, remove empty route
      const payload = { ...form }
      if (payload.driver === '') payload.driver = null
      if (payload.capacity !== undefined) payload.capacity = Number(payload.capacity)

      if (editing){ await API.put(`/admin/buses/${editing._id}`, payload); setEditing(null) }
      else await API.post('/admin/buses', payload)
      setForm({ number: '', route: '', capacity: 20, driver: '' })
      load()
    }catch(err){
      const body = err?.response?.data
      const msg = body?.error || body?.message || JSON.stringify(body) || err.message
      alert(msg)
    }
  }

  const onEdit = (b)=>{ setEditing(b); setForm({ number: b.number, capacity: b.capacity||20, driver: b.driver?._id || '' }) }
  const onDelete = async (id)=>{ if(!confirm('Delete bus?')) return; await API.delete(`/admin/buses/${id}`); load() }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"> <Bus className="w-8 h-8 text-indigo-600"/> Buses</h1>
            <p className="text-gray-600 mt-1">Manage buses and assign drivers.</p>
          </div>
          <button onClick={()=>{ setEditing(null); setForm({ number:'', route:'', capacity:20, driver:'' })}} className="flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 text-white shadow-sm transition hover:bg-indigo-700"> <PlusCircle/> New Bus</button>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg sm:p-8">
          <h3 className="mb-4 text-xl font-semibold">{editing? 'Edit Bus' : 'Add New Bus'}</h3>
          <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <input placeholder="Number (e.g., 23A)" value={form.number} onChange={e=>setForm(f=>({...f, number:e.target.value}))} required className="rounded border px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200" />
            <input type="number" placeholder="Capacity" value={form.capacity} onChange={e=>setForm(f=>({...f, capacity: Number(e.target.value)}))} className="rounded border px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200" />
            <select value={form.driver||''} onChange={e=>setForm(f=>({...f, driver:e.target.value}))} className="rounded border px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200">
              <option value="">Assign Driver (optional)</option>
              {drivers.map(d=> <option key={d._id} value={d._id}>{d.firstName} {d.lastName} — {d.licenseNumber || d.phone || ''}</option>)}
            </select>

            <div className="md:col-span-4 flex justify-end">
              <button type="submit" className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-white shadow-sm transition hover:bg-indigo-700"> <Save className="inline w-4 h-4"/> {editing? 'Update' : 'Create'}</button>
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg sm:p-8">
          <h3 className="text-xl font-semibold mb-4">All Buses</h3>
          {buses.length === 0 ? <div className="text-gray-500">No buses yet.</div> : <div className="space-y-3">{buses.map(b=> <BusRow key={b._id} b={b} onEdit={onEdit} onDelete={onDelete} />)}</div>}
        </div>
      </div>
    </div>
  )
}
