import React, { useEffect, useState } from 'react'
import API from '../utils/api'
import { Users, GraduationCap, Trash2, Edit3, PlusCircle } from 'lucide-react'

export default function Classes() {
  const [classes, setClasses] = useState([])
  const [name, setName] = useState('')
  const [teachers, setTeachers] = useState([])
  const [students, setStudents] = useState([])
  const [editing, setEditing] = useState(null)
  const [teacherId, setTeacherId] = useState('')
  const [selectedStudents, setSelectedStudents] = useState([])

  const load = async () => {
    const [cRes, tRes, sRes] = await Promise.all([
      API.get('/admin/classes'),
      API.get('/admin/teachers'),
      API.get('/admin/students'),
    ])
    setClasses(cRes.data)
    setTeachers(tRes.data)
    setStudents(sRes.data)
  }

  useEffect(() => {
    load()
  }, [])

  const createClass = async (e) => {
    e.preventDefault()
    try {
      await API.post('/admin/classes', { name })
      setName('')
      load()
    } catch (err) {
      alert(err?.response?.data?.message || err.message)
    }
  }

  const edit = (c) => {
    setEditing(c)
    setTeacherId(c.teacher ? c.teacher._id : '')
    setSelectedStudents(c.students ? c.students.map((s) => s._id) : [])
  }

  const saveAssignments = async () => {
    try {
      await API.put(`/admin/classes/${editing._id}`, {
        teacherId: teacherId || undefined,
        studentIds: selectedStudents,
      })
      setEditing(null)
      load()
    } catch (err) {
      alert(err?.response?.data?.message || err.message)
    }
  }

  const del = async (id) => {
    if (!confirm('Delete this class?')) return
    await API.delete(`/admin/classes/${id}`)
    load()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-indigo-600" />
              Classes Management
            </h1>
            <p className="text-gray-600 mt-1">
              Create, edit, and manage all classes, teachers, and student assignments.
            </p>
          </div>
        </div>

        {/* Create Class Form */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-10 hover:shadow-lg transition-all duration-300">
          <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-600" /> Create New Class
          </h4>
          <form onSubmit={createClass} className="flex flex-col sm:flex-row gap-3">
            <input
              className="px-4 py-3 border border-gray-300 rounded-lg flex-1 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all text-gray-900 placeholder-gray-400"
              placeholder="Enter class name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <button className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-200 shadow-sm hover:shadow">
              Create Class
            </button>
          </form>
        </div>

        {/* Classes List */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" /> All Classes
            </h4>
          </div>
          <div className="p-6">
            {classes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-2">No classes created yet</p>
                <p className="text-gray-500 text-sm">
                  Use the form above to create your first class.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {classes.map((c) => (
                  <div
                    key={c._id}
                    className="border border-gray-200 rounded-xl p-6 hover:border-indigo-200 hover:shadow-sm transition-all duration-200 bg-white"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="font-semibold text-lg text-gray-900 mb-2">{c.name}</div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-medium">Teacher:</span>
                            <span className="text-gray-800">
                              {c.teacher ? (
                                `${c.teacher.firstName} ${c.teacher.lastName}`
                              ) : (
                                <span className="text-gray-400 italic">Not assigned</span>
                              )}
                            </span>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="font-medium whitespace-nowrap">Students:</span>
                            <span className="text-gray-800">
                              {c.students && c.students.length > 0 ? (
                                c.students.map((s) => `${s.firstName} ${s.lastName}`).join(', ')
                              ) : (
                                <span className="text-gray-400 italic">No students assigned</span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 lg:flex-col xl:flex-row">
                        <button
                          onClick={() => edit(c)}
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-50 active:bg-indigo-100 transition-colors duration-200"
                        >
                          <Edit3 className="w-4 h-4" /> Assign
                        </button>
                        <button
                          onClick={() => del(c._id)}
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 active:bg-red-800 transition-colors duration-200 shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Assignment Modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                <h4 className="text-xl font-bold text-gray-900">Assign Teacher & Students</h4>
                <p className="text-sm text-gray-600 mt-1">Class: {editing.name}</p>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Teacher Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assign Teacher
                  </label>
                  <select
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-gray-900 bg-white transition-all"
                  >
                    <option value="">-- No teacher assigned --</option>
                    {teachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.firstName} {t.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Students Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Assign Students
                  </label>
                  {students.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No students available</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-1">
                      {students.map((s) => (
                        <label
                          key={s._id}
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 cursor-pointer transition-all duration-150"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(s._id)}
                            onChange={(e) => {
                              if (e.target.checked)
                                setSelectedStudents((prev) => [...prev, s._id])
                              else
                                setSelectedStudents((prev) =>
                                  prev.filter((id) => id !== s._id)
                                )
                            }}
                            className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                          />
                          <span className="text-sm font-medium text-gray-800">
                            {s.firstName} {s.lastName}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={() => setEditing(null)}
                  className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 active:bg-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={saveAssignments}
                  className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-200 shadow-sm hover:shadow"
                >
                  Save Assignments
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
