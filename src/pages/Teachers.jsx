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
    <div className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 mb-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
            {t.firstName?.[0]}
            {t.lastName?.[0]}
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-lg">
              {t.firstName} {t.lastName}
            </div>
            <div className="flex items-center flex-wrap gap-3 text-sm text-gray-600 mt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4 text-indigo-600" />
                {t.email}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                {t.department || 'No department'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(t)}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors duration-200"
          >
            <Edit2 className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={() => onDelete(t._id)}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Teachers() {
  const [teachers, setTeachers] = useState([])
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
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

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editing) {
        await API.put(`/admin/teachers/${editing._id}`, form)
        setEditing(null)
      } else {
        if (!form.username || !form.password) {
          alert('Please provide username and password for the teacher')
          setLoading(false)
          return
        }
        await API.post('/admin/teachers', form)
      }
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        department: '',
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
      username: '',
      password: '',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-indigo-600" />
              Teachers Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your teaching staff efficiently.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm px-6 py-3 border border-gray-100 text-center">
            <div className="text-sm text-gray-600">Total Teachers</div>
            <div className="text-3xl font-bold text-indigo-600">
              {teachers.length}
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-indigo-600" />
              {editing ? 'Edit Teacher' : 'Add New Teacher'}
            </h2>
            {editing && (
              <button
                onClick={cancelEdit}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            )}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {!editing && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="username"
                      value={form.username}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, username: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, password: e.target.value }))
                      }
                      required
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 disabled:opacity-50"
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
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-lg transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">
            All Teachers
          </h2>
          {teachers.length === 0 ? (
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
            teachers.map((t) => (
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
