import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit2, Trash2, PlusCircle, Save, GraduationCap } from 'lucide-react'
import API from '../utils/api'

function StudentRow({ s, onEdit, onDelete, onViewQR }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="rounded-xl border border-gray-100 bg-white/80 px-4 py-4 shadow-sm transition-all duration-200 hover:shadow-md sm:flex sm:items-center sm:justify-between"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 font-semibold flex-shrink-0 overflow-hidden border border-gray-200">
            {s.profileImage ? (
              <img src={s.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg leading-none">{(s.firstName?.[0] || '') + (s.lastName?.[0] || '')}</span>
            )}
          </div>
          <div className="min-w-0">
            <div className="text-lg font-semibold text-gray-900 truncate">{s.firstName} {s.lastName}</div>
            <div className="text-xs text-gray-500 truncate flex gap-2">
              <span>{s.email || 'No Email'}</span>
              <span>•</span>
              <span>Adm No: {s.admissionNumber || '-'}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
          <div><span className="font-medium">Class:</span> {typeof s.class === 'object' && s.class ? s.class.name : s.class || '—'}</div>
          <div><span className="font-medium">Roll:</span> {s.rollNumber || '—'}</div>
          <div><span className="font-medium">Phone:</span> {s.phone || '—'}</div>
          <div><span className="font-medium">Father:</span> {s.fatherName || '—'}</div>
          <div className="col-span-2 truncate"><span className="font-medium">Address:</span> {s.address || '—'}</div>
          <div><span className="font-medium">Aadhar:</span> {s.aadharCard || '—'}</div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 sm:mt-0 sm:flex-nowrap sm:items-center sm:flex-col lg:flex-row">
        <button
          onClick={() => onEdit(s)}
          className="flex w-full items-center justify-center gap-1 rounded-lg border border-indigo-500 px-3 py-2 text-sm font-medium text-indigo-600 transition-all duration-200 hover:bg-indigo-50 sm:w-auto"
        >
          <Edit2 size={14} /> Edit
        </button>
        <button
          onClick={() => onDelete(s._id)}
          className="flex w-full items-center justify-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-red-700 sm:w-auto"
        >
          <Trash2 size={14} /> Delete
        </button>
        <button
          onClick={() => onViewQR(s)}
          className="flex w-full items-center justify-center gap-1 rounded-lg border border-indigo-300 px-3 py-2 text-sm font-medium text-indigo-600 transition-all duration-200 hover:bg-indigo-50 sm:w-auto"
        >
          <GraduationCap size={14} /> QR
        </button>
      </div>
    </motion.div>
  )
}

export default function Students() {
  const [students, setStudents] = useState([])
  const [query, setQuery] = useState('')
  const [classes, setClasses] = useState([])
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    class: '',
    password: '',
    phone: '',
    rollNumber: '',
    address: '',
    admissionNumber: '',
    admissionDate: '',
    aadharCard: '',
    fatherName: '',
    reference: ''
  })
  const [file, setFile] = useState(null)
  const [editing, setEditing] = useState(null)
  const [qrModal, setQrModal] = useState({ open: false, student: null, raw: null, loading: false, error: null })

  const load = async () => {
    const res = await API.get('/admin/students')
    setStudents(res.data)
  }

  const loadClasses = async () => {
    try {
      const res = await API.get('/admin/classes')
      setClasses(res.data)
    } catch (err) {
      console.error('Failed loading classes', err)
    }
  }

  useEffect(() => {
    load()
    loadClasses()
  }, [])

  const filteredStudents = students.filter((s) => {
    const q = (query || '').toLowerCase().trim()
    if (!q) return true
    const className = typeof s.class === 'object' && s.class ? s.class.name : s.class || ''
    const hay = `${s.firstName || ''} ${s.lastName || ''} ${s.email || ''} ${s.rollNumber || ''} ${s.phone || ''} ${s.address || ''} ${s.admissionNumber || ''} ${s.fatherName || ''} ${s.aadharCard || ''} ${className}`.toLowerCase()
    return hay.includes(q)
  })

  const submit = async (e) => {
    e.preventDefault()
    try {
      const fd = new FormData();
      Object.keys(form).forEach(key => {
        if (form[key]) fd.append(key, form[key]);
      });
      if (file) {
        fd.append('profileImage', file);
      }

      if (editing) {
        await API.put(`/admin/students/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        setEditing(null)
      } else {
        await API.post('/admin/students', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
      setForm({
        firstName: '', lastName: '', email: '', class: '', password: '', phone: '',
        rollNumber: '', address: '', admissionNumber: '', admissionDate: '',
        aadharCard: '', fatherName: '', reference: ''
      })
      setFile(null)
      // reset file input visually if possible or just rely on state
      document.getElementById('fileInput').value = '';

      load()
    } catch (err) {
      const body = err?.response?.data
      const msg = body?.message || body?.error || err.message
      alert(msg)
      console.error('Create student error:', body || err)
    }
  }

  const onEdit = (s) => {
    setEditing(s)
    setForm({
      firstName: s.firstName || '',
      lastName: s.lastName || '',
      email: s.email || '',
      class: s.class?._id || s.class || '',
      phone: s.phone || '',
      rollNumber: s.rollNumber || '',
      address: s.address || '',
      admissionNumber: s.admissionNumber || '',
      admissionDate: s.admissionDate ? s.admissionDate.substring(0, 10) : '',
      aadharCard: s.aadharCard || '',
      fatherName: s.fatherName || '',
      reference: s.reference || ''
    })
    setFile(null)
    if (document.getElementById('fileInput')) document.getElementById('fileInput').value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ... (onViewQR, onDelete, etc same as before) ...
  const onViewQR = async (s) => {
    // open modal and either construct raw payload or call generate endpoint if no token
    setQrModal({ open: true, student: s, raw: null, loading: true, error: null })
    try {
      if (s.qrToken) {
        const payload = { studentId: s._id, token: s.qrToken, rollNumber: s.rollNumber || null, className: s.class ? (s.class.name || s.class) : null }
        const raw = btoa(JSON.stringify(payload))
        setQrModal({ open: true, student: s, raw, loading: false, error: null })
      } else {
        // generate via admin endpoint
        const res = await API.post(`/qr/generate/${s._id}`)
        setQrModal({ open: true, student: s, raw: res.data.raw, loading: false, error: null })
        // reload students so UI shows token afterwards
        load()
      }
    } catch (err) {
      setQrModal({ open: true, student: s, raw: null, loading: false, error: err?.response?.data?.message || err.message || 'Failed to get QR' })
    }
  }

  const onDelete = async (id) => {
    if (!confirm('Delete student?')) return
    await API.delete(`/admin/students/${id}`)
    load()
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <GraduationCap className="w-7 h-7 text-indigo-600" />
              Student Management
            </h1>
            <p className="text-gray-600 mt-1">
              Add, edit, and manage all student records efficiently.
            </p>
          </div>

          <button
            onClick={() => {
              setEditing(null)
              setForm({
                firstName: '', lastName: '', email: '', class: '', password: '', phone: '',
                rollNumber: '', address: '', admissionNumber: '', admissionDate: '',
                aadharCard: '', fatherName: '', reference: ''
              })
              setFile(null)
              if (document.getElementById('fileInput')) document.getElementById('fileInput').value = '';
            }}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md active:bg-indigo-800"
          >
            <PlusCircle size={18} /> New Student
          </button>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg sm:p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            {editing ? 'Edit Student' : 'Add New Student'}
          </h3>
          <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-4">

            {/* Personal Details */}
            <div className="md:col-span-4 font-semibold text-sm text-gray-500 mt-2">Personal Details</div>

            <input
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-indigo-500 transition-all"
              placeholder="First Name *"
              value={form.firstName}
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              required
            />
            <input
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-indigo-500 transition-all"
              placeholder="Last Name *"
              value={form.lastName}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              required
            />
            <input
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-indigo-500 transition-all"
              placeholder="Father Name *"
              value={form.fatherName}
              onChange={(e) => setForm((f) => ({ ...f, fatherName: e.target.value }))}
              required
            />
            <input
              type="date"
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-indigo-500 transition-all"
              placeholder="Admission Date *"
              value={form.admissionDate}
              onChange={(e) => setForm((f) => ({ ...f, admissionDate: e.target.value }))}
              required
            />

            {/* Academic & ID Details */}
            <div className="md:col-span-4 font-semibold text-sm text-gray-500 mt-2">Academic & Identification</div>

            <input
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-indigo-500 transition-all"
              placeholder="Admission Number *"
              value={form.admissionNumber}
              onChange={(e) => setForm((f) => ({ ...f, admissionNumber: e.target.value }))}
              required
            />
            <input
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-indigo-500 transition-all"
              placeholder="Aadhar Card *"
              value={form.aadharCard}
              onChange={(e) => setForm((f) => ({ ...f, aadharCard: e.target.value }))}
              required
            />
            <input
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-indigo-500 transition-all"
              placeholder="Roll Number"
              value={form.rollNumber}
              onChange={(e) => setForm((f) => ({ ...f, rollNumber: e.target.value }))}
            />
            <select
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-indigo-500 transition-all"
              value={form.class || ''}
              onChange={(e) => setForm((f) => ({ ...f, class: e.target.value }))}
            >
              <option value="">Select Class</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Contact Details */}
            <div className="md:col-span-4 font-semibold text-sm text-gray-500 mt-2">Contact & Login</div>

            <input
              type="email"
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-indigo-500 transition-all"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
            <input
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-indigo-500 transition-all"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
            <input
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-indigo-500 transition-all md:col-span-2"
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            />

            <input
              type="password"
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-indigo-500 transition-all"
              placeholder={editing ? 'Password (leave blank to keep)' : 'Password'}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />

            <input
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-indigo-500 transition-all"
              placeholder="Reference (Optional)"
              value={form.reference}
              onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))}
            />

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-500 mb-1">Profile Image</label>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>


            <div className="md:col-span-4 flex justify-end mt-4">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white shadow-sm transition-all duration-300 hover:bg-indigo-700 hover:shadow-md active:bg-indigo-800"
              >
                <Save size={16} />
                {editing ? 'Update Student' : 'Create Student'}
              </button>
            </div>
          </form>
        </div>

        {/* Students List */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg sm:p-8">
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h3 className="text-xl font-semibold text-gray-800">All Students</h3>
            <div className="w-full sm:w-80">
              <input
                placeholder="Search (name, adm no, aadhar, father...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
              />
            </div>
          </div>
          {filteredStudents.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              No students found.
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filteredStudents.map((s) => (
                  <StudentRow
                    key={s._id}
                    s={s}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onViewQR={onViewQR}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
        {/* QR info modal remains same, handled by original code closing tag */}
        {/* QR Modal */}
        {qrModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">Student QR</h3>
                <button onClick={() => setQrModal({ open: false, student: null, raw: null, loading: false, error: null })} className="text-gray-500">Close</button>
              </div>
              <div className="mt-4">
                {qrModal.loading ? (
                  <div>Loading...</div>
                ) : qrModal.error ? (
                  <div className="text-red-600">{qrModal.error}</div>
                ) : qrModal.raw ? (
                  <div className="flex flex-col items-center gap-3">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrModal.raw)}&size=300x300`} alt="QR" className="w-48 h-48 bg-white p-2 rounded-md" />
                    <div className="text-sm text-gray-600">Roll: {qrModal.student.rollNumber || '—'}{qrModal.student.class ? ` • Class: ${typeof qrModal.student.class === 'object' ? qrModal.student.class.name : qrModal.student.class}` : ''}</div>
                  </div>
                ) : (
                  <div className="text-gray-600">No QR available</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
