import React, { useEffect, useState } from 'react'
import API from '../utils/api'
import { MapPin, PlusCircle, Trash2, Edit3 } from 'lucide-react'

export default function Routes() {
  const [routes, setRoutes] = useState([])
  const [buses, setBuses] = useState([])
  const [students, setStudents] = useState([])
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', startTime: '08:00', endTime: '', startLocation: '', bus: '', stops: [] })

  const load = async () => {
    const [rRes, bRes, sRes] = await Promise.all([
      API.get('/admin/routes'),
      API.get('/admin/buses'),
      API.get('/admin/students')
    ])
    setRoutes(rRes.data)
    setBuses(bRes.data)
    setStudents(sRes.data)
  }

  useEffect(() => { load() }, [])

  const addStop = () => setForm(f => ({ ...f, stops: [...(f.stops||[]), { address: '', time: '', students: [] }] }))

  const toggleStudentInStop = (stopIdx, studentId) => {
    setForm(f => {
      const copy = { ...f };
      copy.stops = copy.stops ? [...copy.stops] : [];
      const stop = { ...copy.stops[stopIdx] };
      const list = Array.isArray(stop.students) ? [...stop.students] : [];
      const sid = String(studentId);
      if (list.map(x=>String(x)).includes(sid)) {
        stop.students = list.filter(x => String(x) !== sid);
      } else {
        stop.students = [...list, sid];
      }
      copy.stops[stopIdx] = stop;
      return copy;
    })
  }

  const save = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await API.put(`/admin/routes/${editing._id}`, form)
      } else {
        await API.post('/admin/routes', form)
      }
      setForm({ name: '', startTime: '08:00', endTime: '', startLocation: '', bus: '', stops: [] })
      setCreating(false)
      setEditing(null)
      load()
    } catch (err) { alert(err?.response?.data?.message || err.message) }
  }

  const del = async (id) => {
    if (!confirm('Delete this route?')) return
    await API.delete(`/admin/routes/${id}`)
    load()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold flex items-center gap-2"><MapPin className="w-6 h-6 text-indigo-600"/> Routes</h2>
          <button onClick={() => { setEditing(null); setForm({ name: '', startTime: '08:00', startLocation: '', bus: '', stops: [] }); setCreating(true) }} className="px-4 py-2 bg-indigo-600 text-white rounded">New Route</button>
        </div>

        {creating && (
          <div className="bg-white p-6 rounded-lg border mb-6">
            <form onSubmit={save} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input value={form.name} onChange={e => setForm(f=>({...f, name: e.target.value}))} placeholder="Route name" className="px-3 py-2 border rounded" required/>
                <input type="time" value={form.startTime} onChange={e => setForm(f=>({...f, startTime: e.target.value}))} placeholder="Start time (HH:MM)" className="px-3 py-2 border rounded" required/>
                <input type="time" value={form.endTime||''} onChange={e => setForm(f=>({...f, endTime: e.target.value}))} placeholder="End time (HH:MM)" className="px-3 py-2 border rounded" />
                <select value={form.bus||''} onChange={e=>setForm(f=>({...f, bus: e.target.value}))} className="px-3 py-2 border rounded">
                  <option value="">-- No bus assigned --</option>
                  {buses.map(b=> <option key={b._id} value={b._id}>{b.number}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Stops</label>
                {(form.stops||[]).map((s, idx) => (
                  <div key={idx} className="flex gap-2 mb-2 items-start">
                    <input value={s.address} onChange={e=>{ const copy = [...form.stops]; copy[idx].address = e.target.value; setForm(f=>({...f, stops: copy})) }} placeholder="Address" className="px-3 py-2 border rounded w-full sm:w-1/3" />
                    <input type="time" value={s.time||''} onChange={e=>{ const copy=[...form.stops]; copy[idx].time = e.target.value; setForm(f=>({...f, stops: copy})) }} className="px-3 py-2 border rounded w-full sm:w-40" />
                    <div className="flex-1 px-3 py-2 border rounded max-h-40 overflow-auto">
                      {students.map(st=> (
                        <label key={st._id} className="flex items-center gap-2 py-1">
                          <input
                            type="checkbox"
                            checked={Array.isArray(s.students) ? s.students.map(x=>String(x)).includes(String(st._id)) : false}
                            onChange={() => toggleStudentInStop(idx, st._id)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">{st.firstName} {st.lastName}</span>
                        </label>
                      ))}
                    </div>
                    <button type="button" onClick={()=>{ setForm(f=>({...f, stops: f.stops.filter((_,i)=>i!==idx)})) }} className="px-3 py-1 bg-red-100 rounded">Remove</button>
                  </div>
                ))}
                <div><button type="button" onClick={addStop} className="px-3 py-2 bg-indigo-50 border rounded text-indigo-600">+ Add stop</button></div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={()=>{ setCreating(false); setEditing(null); setForm({ name: '', startTime: '08:00', startLocation: '', bus: '', stops: [] }) }} className="px-4 py-2 border rounded">Cancel</button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded">{editing ? 'Save Changes' : 'Save Route'}</button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {routes.map(r=> (
            <div key={r._id} className="bg-white p-4 rounded border flex justify-between items-center">
              <div>
                <div className="font-semibold">{r.name} <span className="text-sm text-gray-500">({r.startTime}{r.endTime ? ` - ${r.endTime}` : ''})</span></div>
                <div className="text-sm text-gray-600">Bus: {r.bus ? r.bus.number : 'No bus'}</div>
                <div className="text-sm text-gray-700 mt-2">
                  {r.stops && r.stops.length ? r.stops.map(s => {
                    const timePart = s.time ? ` [${s.time}]` : ''
                    const studentsPart = (s.students||[]).map(st=>st.firstName+' '+st.lastName).join(', ') || 'no students'
                    return `${s.address}${timePart} (${studentsPart})`
                  }).join(' · ') : 'No stops'}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>{
                  setEditing(r)
                  setForm({
                    name: r.name || '',
                    startTime: r.startTime || '08:00',
                    endTime: r.endTime || '',
                    startLocation: r.startLocation || '',
                    bus: r.bus && r.bus._id ? r.bus._id : (r.bus || ''),
                    stops: (r.stops||[]).map(s=>({ address: s.address||'', time: s.time||'', estimatedMinutes: s.estimatedMinutes||0, students: (s.students||[]).map(st => (st._id || st)) }))
                  })
                  setCreating(true)
                }} className="px-3 py-1 border rounded"><Edit3 className="w-4 h-4"/></button>
                <button onClick={()=>del(r._id)} className="px-3 py-1 bg-red-600 text-white rounded"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
