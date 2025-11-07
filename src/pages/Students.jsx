import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit2, Trash2, PlusCircle, Save, GraduationCap } from 'lucide-react'
import API from '../utils/api'

function StudentRow({ s, onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="rounded-xl border border-gray-100 bg-white/80 px-4 py-4 shadow-sm transition-all duration-200 hover:shadow-md sm:flex sm:items-center sm:justify-between"
    >
      <div className="space-y-1">
        <div className="text-lg font-semibold text-gray-900">
          {s.firstName} {s.lastName}
        </div>
        <div className="text-sm text-gray-500">
          {s.email}
        </div>
        <div className="text-sm font-medium text-indigo-600">
          Class:{' '}
          {typeof s.class === 'object' && s.class
            ? s.class.name
            : s.class || '—'}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 sm:mt-0 sm:flex-nowrap sm:items-center">
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
      </div>
    </motion.div>
  )
}

export default function Students() {
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    class: '',
    username: '',
    password: '',
  })
  const [editing, setEditing] = useState(null)

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

  const submit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await API.put(`/admin/students/${editing._id}`, form)
        setEditing(null)
      } else {
        await API.post('/admin/students', form)
      }
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        class: '',
        username: '',
        password: '',
      })
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
      firstName: s.firstName,
      lastName: s.lastName,
      email: s.email,
      class: s.class?._id || s.class || '',
    })
  }

  const onDelete = async (id) => {
    if (!confirm('Delete student?')) return
    await API.delete(`/admin/students/${id}`)
    load()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-8">
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
                firstName: '',
                lastName: '',
                email: '',
                class: '',
                username: '',
                password: '',
              })
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
          <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <input
              className="rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) =>
                setForm((f) => ({ ...f, firstName: e.target.value }))
              }
              required
            />
            <input
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-gray-900 transition-all"
              placeholder="Last Name"
              value={form.lastName}
              onChange={(e) =>
                setForm((f) => ({ ...f, lastName: e.target.value }))
              }
              required
            />
            <input
              type="email"
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-gray-900 transition-all"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              required
            />

            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-gray-900 transition-all"
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

            {!editing && (
              <>
                <input
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-gray-900 transition-all"
                  placeholder="Username (optional)"
                  value={form.username}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, username: e.target.value }))
                  }
                />
                <input
                  type="password"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-gray-900 transition-all"
                  placeholder="Password (optional)"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                />
              </>
            )}

            <div className="md:col-span-3 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-300 hover:bg-indigo-700 hover:shadow-md active:bg-indigo-800"
              >
                <Save size={16} />
                {editing ? 'Update Student' : 'Create Student'}
              </button>
            </div>
          </form>
        </div>

        {/* Students List */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg sm:p-8">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">
            All Students
          </h3>
          {students.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              No students found.
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {students.map((s) => (
                  <StudentRow
                    key={s._id}
                    s={s}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
