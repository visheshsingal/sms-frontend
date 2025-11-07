import React, { useEffect, useState } from 'react'
import API from '../utils/api'
import { Users, UserPlus, Edit2, Trash2, Save, X } from 'lucide-react'

function DriverRow({ d, onEdit, onDelete }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-indigo-500 text-lg font-semibold text-white shadow-md">
            {d.firstName?.[0]}
            {d.lastName?.[0]}
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {d.firstName} {d.lastName}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <div className="break-all">{d.email || '—'}</div>
              <div className="text-xs text-gray-500">
                License: {d.licenseNumber || '—'}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={() => onEdit(d)}
            className="flex items-center justify-center gap-1 rounded-lg border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors duration-200 hover:bg-indigo-50"
          >
            <Edit2 className="inline h-4 w-4" /> Edit
          </button>
          <button
            onClick={() => onDelete(d._id)}
            className="flex items-center justify-center gap-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-600"
          >
            <Trash2 className="inline h-4 w-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Drivers() {
  const [drivers, setDrivers] = useState([])
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', licenseNumber: '', username: '', password: '' })
  const [editing, setEditing] = useState(null)

  const load = async () => { const res = await API.get('/admin/drivers'); setDrivers(res.data) }

  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await API.put(`/admin/drivers/${editing._id}`, form)
        setEditing(null)
      } else {
        if (!form.username || !form.password) { alert('Please provide username and password for driver'); return }
        await API.post('/admin/drivers', form)
      }
      setForm({ firstName: '', lastName: '', email: '', phone: '', licenseNumber: '', username: '', password: '' })
      load()
    } catch (err) { alert(err?.response?.data?.message || err.message) }
  }

  const onEdit = (d) => { setEditing(d); setForm({ firstName: d.firstName, lastName: d.lastName, email: d.email, phone: d.phone, licenseNumber: d.licenseNumber, username: '', password: '' }) }
  const onDelete = async (id) => { if (!confirm('Delete driver?')) return; await API.delete(`/admin/drivers/${id}`); load() }
  const cancelEdit = () => { setEditing(null); setForm({ firstName: '', lastName: '', email: '', phone: '', licenseNumber: '', username: '', password: '' }) }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"> <Users className="w-8 h-8 text-indigo-600"/> Drivers</h1>
            <p className="text-gray-600 mt-1">Manage drivers and their credentials.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg sm:p-8">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold">{editing ? 'Edit Driver' : 'Add New Driver'}</h2>
            {editing && <button onClick={cancelEdit} className="flex items-center gap-1 rounded bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"> <X className="h-4 w-4"/> Cancel</button>}
          </div>
          <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <input placeholder="First Name" value={form.firstName} onChange={(e)=>setForm(f=>({...f, firstName:e.target.value}))} required className="rounded border px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200" />
            <input placeholder="Last Name" value={form.lastName} onChange={(e)=>setForm(f=>({...f, lastName:e.target.value}))} required className="rounded border px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200" />
            <input placeholder="Email" value={form.email} onChange={(e)=>setForm(f=>({...f, email:e.target.value}))} className="rounded border px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200" />
            <input placeholder="Phone" value={form.phone} onChange={(e)=>setForm(f=>({...f, phone:e.target.value}))} className="rounded border px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200" />
            <input placeholder="License Number" value={form.licenseNumber} onChange={(e)=>setForm(f=>({...f, licenseNumber:e.target.value}))} className="rounded border px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200" />

            {!editing && (
              <>
                <input placeholder="Username" value={form.username} onChange={(e)=>setForm(f=>({...f, username:e.target.value}))} required className="rounded border px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200" />
                <input type="password" placeholder="Password" value={form.password} onChange={(e)=>setForm(f=>({...f, password:e.target.value}))} required className="rounded border px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200" />
              </>
            )}

            <div className="md:col-span-3 flex justify-end">
              <button type="submit" className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-white shadow-sm transition hover:bg-indigo-700">
                <Save className="inline h-4 w-4"/> {editing? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg sm:p-8">
          <h3 className="text-xl font-semibold mb-4">All Drivers</h3>
          {drivers.length === 0 ? <div className="text-gray-500">No drivers yet.</div> : <div className="space-y-3">{drivers.map(d=> <DriverRow key={d._id} d={d} onEdit={onEdit} onDelete={onDelete} />)}</div>}
        </div>
      </div>
    </div>
  )
}
