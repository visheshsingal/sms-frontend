import React, { useEffect, useState } from 'react'
import API from '../utils/api'
import { Users, GraduationCap, Trash2, Edit3, PlusCircle } from 'lucide-react'

// Small searchable multi-select for teachers.
function TeacherMultiSelect({ teachers = [], value = [], onChange }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')

  const filtered = teachers.filter((t) =>
    `${t.firstName} ${t.lastName}`.toLowerCase().includes(q.toLowerCase())
  )

  const toggle = (id) => {
    const setIds = new Set(value || [])
    if (setIds.has(id)) setIds.delete(id)
    else setIds.add(id)
    onChange(Array.from(setIds))
  }

  const selectedNames = teachers
    .filter((t) => (value || []).includes(t._id))
    .map((t) => `${t.firstName} ${t.lastName}`)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full text-left px-3 py-2 border border-gray-300 rounded bg-white flex items-center justify-between"
      >
        <span className="truncate text-sm text-gray-700">
          {selectedNames.length ? selectedNames.join(', ') : 'Assign teachers...'}
        </span>
        <span className="text-gray-400 ml-2">▾</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded shadow-lg p-2 max-h-56 overflow-auto">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search teachers..."
            className="w-full px-3 py-2 border border-gray-200 rounded mb-2 text-sm outline-none"
          />
          <div className="space-y-1">
            {filtered.map((t) => (
              <label key={t._id} className="flex items-center gap-2 p-1 rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(value || []).includes(t._id)}
                  onChange={() => toggle(t._id)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-800">{t.firstName} {t.lastName}</span>
              </label>
            ))}
            {filtered.length === 0 && <div className="text-sm text-gray-500 p-2">No teachers found</div>}
          </div>
          <div className="mt-2 flex justify-end">
            <button onClick={() => setOpen(false)} className="px-3 py-1 text-sm text-gray-600">Done</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Classes() {
  const [classes, setClasses] = useState([])
  const [name, setName] = useState('')
  const [newSubjects, setNewSubjects] = useState([])
  const [teachers, setTeachers] = useState([])
  const [students, setStudents] = useState([])
  const [editing, setEditing] = useState(null)
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
      await API.post('/admin/classes', { name, subjects: newSubjects })
      setName('')
      setNewSubjects([])
      load()
    } catch (err) {
      alert(err?.response?.data?.message || err.message)
    }
  }

  const edit = (c) => {
    setEditing(c)
    setSelectedStudents(c.students ? c.students.map((s) => s._id) : [])
    // load subjects into editable form
    setEditingSubjects(
      c.subjects && c.subjects.length
        ? c.subjects.map((s) => ({ name: s.name, teacherIds: s.teachers ? s.teachers.map((t) => t._id) : [] }))
        : []
    )
  }

  const [editingSubjects, setEditingSubjects] = useState([])

  const saveAssignments = async () => {
    try {
      await API.put(`/admin/classes/${editing._id}`, {
        studentIds: selectedStudents,
        subjects: editingSubjects,
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
            <div className="flex items-center gap-3">
              <button className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-200 shadow-sm hover:shadow">
                Create Class
              </button>
            </div>
          </form>

          {/* New Subjects for creation */}
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Add Subjects (optional)</label>
            {newSubjects.map((s, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-start">
                <input
                  value={s.name}
                  onChange={(e) => {
                    const copy = [...newSubjects]
                    copy[idx].name = e.target.value
                    setNewSubjects(copy)
                  }}
                  placeholder="Subject name"
                  className="px-3 py-2 border border-gray-300 rounded w-full sm:w-1/3"
                />
                <div className="flex-1">
                  <TeacherMultiSelect
                    teachers={teachers}
                    value={s.teacherIds || []}
                    onChange={(ids) => {
                      const copy = [...newSubjects]
                      copy[idx].teacherIds = ids
                      setNewSubjects(copy)
                    }}
                  />
                </div>
                <button type="button" onClick={() => setNewSubjects(prev => prev.filter((_, i) => i !== idx))} className="px-3 py-2 bg-red-100 rounded">Remove</button>
              </div>
            ))}
            <div>
              <button onClick={() => setNewSubjects(prev => [...prev, { name: '', teacherIds: [] }])} className="px-3 py-2 bg-indigo-50 border border-indigo-200 rounded text-indigo-600">+ Add subject</button>
            </div>
          </div>
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
                            {/* class-level homeroom teacher removed; subjects contain teacher assignments now */}
                          <div className="flex items-start gap-2 text-sm text-gray-600 mt-2">
                            <span className="font-medium whitespace-nowrap">Subjects:</span>
                            <span className="text-gray-800">
                              {c.subjects && c.subjects.length > 0 ? (
                                c.subjects.map((s) => {
                                  const names = s.teachers && s.teachers.length ? s.teachers.map(t => `${t.firstName} ${t.lastName}`).join(', ') : 'No teacher'
                                  return `${s.name} (${names})`
                                }).join('; ')
                              ) : (
                                <span className="text-gray-400 italic">No subjects</span>
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
                <h4 className="text-xl font-bold text-gray-900">Assign Students & Subjects</h4>
                <p className="text-sm text-gray-600 mt-1">Class: {editing.name}</p>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* class-level homeroom teacher UI removed; use per-subject teacher assignments */}

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

                {/* Subjects Selection / Edit */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Subjects & Teachers</label>
                  {editingSubjects.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No subjects defined for this class</p>
                  ) : (
                    <div className="space-y-3">
                      {editingSubjects.map((s, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            value={s.name}
                            onChange={(e) => {
                              const copy = [...editingSubjects]
                              copy[idx].name = e.target.value
                              setEditingSubjects(copy)
                            }}
                            placeholder="Subject name"
                            className="px-3 py-2 border border-gray-300 rounded w-full sm:w-1/3"
                          />
                          <div className="flex-1">
                            <TeacherMultiSelect
                              teachers={teachers}
                              value={s.teacherIds || []}
                              onChange={(ids) => {
                                const copy = [...editingSubjects]
                                copy[idx].teacherIds = ids
                                setEditingSubjects(copy)
                              }}
                            />
                          </div>
                          <button onClick={() => setEditingSubjects(prev => prev.filter((_, i) => i !== idx))} className="px-3 py-2 bg-red-100 rounded">Remove</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-2">
                    <button onClick={() => setEditingSubjects(prev => [...prev, { name: '', teacherIds: [] }])} className="px-3 py-2 bg-indigo-50 border border-indigo-200 rounded text-indigo-600">+ Add subject</button>
                  </div>
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
