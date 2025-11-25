import React, { useEffect, useState } from 'react'
import API from '../utils/api'
import {
  Users,
  Mail,
  Edit2,
  Trash2,
  UserPlus,
  X,
  Save,
  Briefcase,
} from 'lucide-react'

function TeacherRow({ t, onEdit, onDelete }) {
  return (
    <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-indigo-500 text-lg font-semibold text-white shadow-md">
            {t.firstName?.[0]}
            {t.lastName?.[0]}
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {t.firstName} {t.lastName}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1 break-all">
                <Mail className="h-4 w-4 text-indigo-600" />
                {t.email}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="h-4 w-4 text-indigo-600" />
                {t.department || 'No department'}
              </span>
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t.phone || '—'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={() => onEdit(t)}
            className="flex items-center justify-center gap-1 rounded-lg border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-700 transition-colors duration-200 hover:bg-indigo-50"
          >
            <Edit2 className="h-4 w-4" /> Edit
          </button>
          <button
            onClick={() => onDelete(t._id)}
            className="flex items-center justify-center gap-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-600"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Teachers() {
  const [teachers, setTeachers] = useState([])
  const [query, setQuery] = useState('')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    phone: '',
    username: '',
    password: '',
  })
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    const res = await API.get('/admin/teachers')
    setTeachers(res.data)
  }

  useEffect(() => {
    load()
  }, [])

  const filteredTeachers = teachers.filter((t) => {
    const q = (query || '').toLowerCase().trim()
    if (!q) return true
    const hay = `${t.firstName || ''} ${t.lastName || ''} ${t.email || ''} ${t.department || ''} ${t.phone || ''}`.toLowerCase()
    return hay.includes(q)
  })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editing) {
        await API.put(`/admin/teachers/${editing._id}`, form)
        setEditing(null)
      } else {
        // allow creating teacher without credentials (login can be created later)
        await API.post('/admin/teachers', form)
      }
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        phone: '',
        username: '',
        password: '',
      })
      load()
    } catch (err) {
      alert(err?.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  const onEdit = (t) => {
    setEditing(t)
    setForm({
      firstName: t.firstName,
      lastName: t.lastName,
      email: t.email,
      department: t.department,
      phone: t.phone || '',
      username: '',
      password: '',
    })
  }

  const onDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return
    await API.delete(`/admin/teachers/${id}`)
    load()
  }

  const cancelEdit = () => {
    setEditing(null)
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      phone: '',
      username: '',
      password: '',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-indigo-600" />
              Teachers Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your teaching staff efficiently.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-3 text-center shadow-sm">
            <div className="text-sm text-gray-600">Total Teachers</div>
            <div className="text-3xl font-bold text-indigo-600">
              {teachers.length}
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg sm:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-indigo-600" />
              {editing ? 'Edit Teacher' : 'Add New Teacher'}
            </h2>
            {editing && (
              <button
                onClick={cancelEdit}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            )}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {['firstName', 'lastName'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {field.replace('Name', ' Name')}
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder={`Enter ${field}`}
                    value={form[field]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [field]: e.target.value }))
                    }
                    required
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="teacher@school.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="e.g., Mathematics"
                  value={form.department}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, department: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>

              {/* Username/password always editable — when editing, leaving blank keeps existing credentials */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username <span className="text-sm text-gray-500">(optional — will be derived from email if omitted)</span>
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="username"
                  value={form.username}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, username: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {editing ? <span className="text-sm text-gray-500">(leave blank to keep)</span> : <span className="text-red-500">*</span>}
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder={editing ? '•••••••• (leave blank to keep)' : '•••••••• (optional)'}
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:from-indigo-700 hover:to-indigo-800 hover:shadow-lg disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {editing ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {editing ? 'Update Teacher' : 'Add Teacher'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Teachers List */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg sm:p-8">
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-gray-900">All Teachers</h2>
            <div className="w-full sm:w-64">
              <input
                placeholder="Search teachers (name, email, dept, phone...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
              />
            </div>
          </div>
          {filteredTeachers.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No teachers yet
              </h3>
              <p className="text-gray-600">
                Add your first teacher using the form above.
              </p>
            </div>
          ) : (
            filteredTeachers.map((t) => (
              <TeacherRow
                key={t._id}
                t={t}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
