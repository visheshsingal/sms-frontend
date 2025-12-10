import React, { useEffect, useState, useMemo } from 'react'
import API from '../utils/api'
import { MapPin, Trash2, Edit3, Search, AlertCircle } from 'lucide-react'

export default function Routes() {
  const [routes, setRoutes] = useState([])
  const [buses, setBuses] = useState([])
  const [students, setStudents] = useState([])
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(null)
  
  // validation form state
  const [form, setForm] = useState({ name: '', startTime: '08:00', endTime: '', startLocation: '', bus: '', stops: [] })

  const load = async () => {
    try {
      const [rRes, bRes, sRes] = await Promise.all([
        API.get('/admin/routes'),
        API.get('/admin/buses'),
        API.get('/admin/students')
      ])
      setRoutes(rRes.data)
      setBuses(bRes.data)
      setStudents(sRes.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { load() }, [])

  // Calculate which students are already assigned to OTHER routes to prevent double assignment
  const assignedMap = useMemo(() => {
    const map = {} // studentId -> routeName
    routes.forEach(r => {
      // Ignore the route currently being edited (so we don't count existing assignments in the same route as conflicts)
      if (editing && String(r._id) === String(editing._id)) return
      
      if (r.stops) {
        r.stops.forEach(s => {
          if (s.students) {
            s.students.forEach(st => {
              // st is populated object, so use st._id
              const sid = st._id ? String(st._id) : String(st)
              map[sid] = r.name
            })
          }
        })
      }
    })
    return map
  }, [routes, editing])

  const addStop = () => setForm(f => ({ ...f, stops: [...(f.stops||[]), { address: '', time: '', students: [], _search: '' }] }))

  const toggleStudentInStop = (stopIdx, studentId) => {
    setForm(f => {
      const copy = { ...f };
      copy.stops = copy.stops ? [...copy.stops] : [];
      const stop = { ...copy.stops[stopIdx] };
      // copy array to avoid mutation
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
    
    // Front-end Validation for Time Slot
    if (!form.startTime) return alert("Start time is required")
    if (!form.endTime) return alert("End time is required to define the time slot")

    const toMin = (t) => {
      if (!t) return null
      const [h, m] = t.split(':').map(Number)
      return h * 60 + m
    }

    const start = toMin(form.startTime)
    const end = toMin(form.endTime)

    if (start !== null && end !== null && end <= start) {
      return alert("End time must be after Start time")
    }

    // Validate stops time constraint
    if (form.stops && form.stops.length > 0) {
      for (let i = 0; i < form.stops.length; i++) {
        const s = form.stops[i]
        if (s.time) {
          const st = toMin(s.time)
          if (st !== null) {
            if (st < start || st > end) {
              return alert(`Stop '${s.address}' time (${s.time}) is outside the route time slot (${form.startTime} - ${form.endTime})`)
            }
          }
        }
      }
    }

    try {
      // Remove transient _search fields before sending
      const cleanForm = {
        ...form,
        stops: form.stops.map(s => {
          const { _search, ...rest } = s
          return rest
        })
      }

      if (editing) {
        await API.put(`/admin/routes/${editing._id}`, cleanForm)
      } else {
        await API.post('/admin/routes', cleanForm)
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
          <button onClick={() => { setEditing(null); setForm({ name: '', startTime: '08:00', endTime: '', startLocation: '', bus: '', stops: [] }); setCreating(true) }} className="px-4 py-2 bg-indigo-600 text-white rounded">New Route</button>
        </div>

        {creating && (
          <div className="bg-white p-6 rounded-lg border mb-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{editing ? 'Edit Route' : 'Create New Route'}</h3>
            <form onSubmit={save} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Route Name</label>
                    <input value={form.name} onChange={e => setForm(f=>({...f, name: e.target.value}))} placeholder="e.g. Morning Route A" className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" required/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input type="time" value={form.startTime} onChange={e => setForm(f=>({...f, startTime: e.target.value}))} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" required/>
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                     <input type="time" value={form.endTime||''} onChange={e => setForm(f=>({...f, endTime: e.target.value}))} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assign Bus</label>
                    <select value={form.bus||''} onChange={e=>setForm(f=>({...f, bus: e.target.value}))} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option value="">-- No bus assigned --</option>
                      {buses.map(b=> <option key={b._id} value={b._id}>{b.number}</option>)}
                    </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stops & Students</label>
                {(form.stops||[]).map((s, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                    <div className="flex flex-wrap md:flex-nowrap gap-3 mb-3 items-end">
                       <div className="flex-grow">
                          <label className="text-xs text-gray-500">Stop Address/Name</label>
                          <input value={s.address} onChange={e=>{ const copy = [...form.stops]; copy[idx] = {...copy[idx], address: e.target.value}; setForm(f=>({...f, stops: copy})) }} placeholder="e.g. Central Market" className="w-full px-3 py-2 border rounded text-sm" required />
                       </div>
                       <div className="w-32">
                          <label className="text-xs text-gray-500">Time (Optional)</label>
                          <input type="time" value={s.time||''} onChange={e=>{ const copy=[...form.stops]; copy[idx] = {...copy[idx], time: e.target.value}; setForm(f=>({...f, stops: copy})) }} className="w-full px-3 py-2 border rounded text-sm" />
                       </div>
                       <button type="button" onClick={()=>{ setForm(f=>({...f, stops: f.stops.filter((_,i)=>i!==idx)})) }} className="px-3 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>

                    {/* Student Selection Section */}
                    <div className="bg-white border rounded-md p-3">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b">
                           <Search className="w-4 h-4 text-gray-400" />
                           <input 
                              type="text" 
                              placeholder="Search student by name or class..." 
                              value={s._search || ''}
                              onChange={e => {
                                 const copy = [...form.stops]
                                 copy[idx] = { ...copy[idx], _search: e.target.value }
                                 setForm(f => ({ ...f, stops: copy }))
                              }}
                              className="flex-1 outline-none text-sm"
                           />
                        </div>
                        <div className="max-h-48 overflow-y-auto space-y-1">
                          {(() => {
                             const query = (s._search || '').toLowerCase()
                             const filtered = students.filter(st => {
                                const name = `${st.firstName} ${st.lastName}`.toLowerCase()
                                const cls = (st.class?.name || '').toLowerCase()
                                return name.includes(query) || cls.includes(query)
                             })

                             if (filtered.length === 0) return <div className="text-xs text-gray-400 text-center py-2">No students found</div>

                             return filtered.map(st => {
                                const assignedRoute = assignedMap[String(st._id)]
                                const isAssignedOther = !!assignedRoute
                                const isChecked = Array.isArray(s.students) && s.students.map(x=>String(x)).includes(String(st._id))
                                
                                return (
                                   <label key={st._id} className={`flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer ${isAssignedOther && !isChecked ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => toggleStudentInStop(idx, st._id)}
                                        disabled={isAssignedOther && !isChecked}
                                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                                      />
                                      <div className="flex-1 flex justify-between items-center">
                                         <span className="text-sm font-medium text-gray-700">{st.firstName} {st.lastName} <span className="font-normal text-gray-500 text-xs">({st.class?.name || 'No Class'})</span></span>
                                         {isAssignedOther && !isChecked && (
                                            <span className="text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100 flex items-center gap-1">
                                               <AlertCircle className="w-3 h-3"/> In {assignedRoute}
                                            </span>
                                         )}
                                      </div>
                                   </label>
                                )
                             })
                          })()}
                        </div>
                    </div>
                  </div>
                ))}
                
                <button type="button" onClick={addStop} className="w-full py-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition-all font-medium">
                   + Add Another Stop
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={()=>{ setCreating(false); setEditing(null); setForm({ name: '', startTime: '08:00', endTime: '', startLocation: '', bus: '', stops: [] }) }} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-colors">{editing ? 'Save Changes' : 'Create Route'}</button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {routes.map(r=> (
            <div key={r._id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                   <h3 className="font-bold text-gray-900 text-lg">{r.name}</h3>
                   <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded text-sm font-medium border border-indigo-100 shadow-sm">
                      {r.startTime} - {r.endTime || '?'}
                   </span>
                </div>
                <div className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                   <span className="font-medium text-gray-800">Bus:</span> {r.bus ? r.bus.number : <span className="text-gray-400 italic">No bus assigned</span>}
                </div>
                <div className="space-y-2">
                  {r.stops && r.stops.length ? r.stops.map((s, i) => {
                    const timePart = s.time ? ` • ${s.time}` : ''
                    const studentCount = (s.students||[]).length
                    return (
                       <div key={i} className="text-sm border-l-2 border-gray-200 pl-3 py-0.5">
                          <span className="font-medium text-gray-800">{s.address}</span>
                          <span className="text-gray-500 text-xs">{timePart}</span>
                          <div className="text-xs text-gray-500 mt-0.5">
                             {studentCount > 0 ? (
                                <span className="text-indigo-600">
                                   {studentCount} student{studentCount!==1?'s':''}
                                   <span className="text-gray-400 mx-1">|</span>
                                   <span className="text-gray-500">{(s.students||[]).map(st => st.firstName).join(', ')}</span>
                                </span>
                             ) : 'No students'}
                          </div>
                       </div>
                    )
                  }) : <div className="text-sm text-gray-400 italic">No stops added</div>}
                </div>
              </div>
              <div className="flex gap-2 self-start">
                <button onClick={()=>{
                  setEditing(r)
                  setForm({
                    name: r.name || '',
                    startTime: r.startTime || '08:00',
                    endTime: r.endTime || '',
                    startLocation: r.startLocation || '',
                    bus: r.bus && r.bus._id ? r.bus._id : (r.bus || ''),
                    stops: (r.stops||[]).map(s=>({ 
                        address: s.address||'', 
                        time: s.time||'', 
                        estimatedMinutes: s.estimatedMinutes||0, 
                        students: (s.students||[]).map(st => (st._id || st)),
                        _search: '' // init search
                    }))
                  })
                  setCreating(true)
                }} className="p-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-indigo-600 transition-colors"><Edit3 className="w-4 h-4"/></button>
                <button onClick={()=>del(r._id)} className="p-2 bg-red-50 border border-red-100 text-red-600 rounded-lg hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
          ))}
          {routes.length === 0 && !creating && (
             <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed">
                No routes found. Create one to get started.
             </div>
          )}
        </div>
      </div>
    </div>
  )
}
