import React, { useEffect, useState } from 'react'
import API from '../../utils/api'
import { toast } from 'react-toastify'
import { NotebookPen, CalendarDays, Loader2, ClipboardList } from 'lucide-react'

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState([])
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' })
  const [assignedClass, setAssignedClass] = useState(null)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await API.get('/teacher/assignments')
      setAssignments(res.data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load assignments')
    }
    setLoading(false)
  }

  useEffect(() => {
    const loadClass = async () => {
      try {
        const res = await API.get('/teacher/assigned-class')
        setAssignedClass(res.data || null)
        if (res.data && res.data._id)
          setForm((f) => ({ ...f, classId: res.data._id }))
      } catch (err) {
        console.error(err)
      }
    }
    loadClass()
  }, [])

  useEffect(() => {
    load()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    try {
      if (!form.classId) {
        toast.error('Class ID required')
        return
      }
      await API.post('/teacher/assignments', form)
      setForm({ title: '', description: '', dueDate: '' })
      load()
      toast.success('Assignment created successfully')
    } catch (err) {
      toast.error('Failed to create assignment')
      console.error(err)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <NotebookPen className="w-6 h-6 text-indigo-600" />
            <h3 className="text-2xl font-semibold text-gray-900">Assignments</h3>
          </div>

          {/* Create Assignment Form */}
          <form
            onSubmit={submit}
            className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 mb-8"
          >
            <div className="text-sm text-gray-700 mb-3">
              <span className="font-medium text-gray-900">Class:</span>{' '}
              {assignedClass ? (
                <span className="text-indigo-700 font-semibold">
                  {assignedClass.name}
                </span>
              ) : (
                <span className="text-gray-500">Not assigned</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
              <input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Assignment Title"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                required
              />
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dueDate: e.target.value }))
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Description (optional)"
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all mb-3"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors duration-200"
              >
                Create Assignment
              </button>
            </div>
          </form>

          {/* Assignment List */}
          <div>
            {loading ? (
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                Loading assignments...
              </div>
            ) : assignments.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="w-10 h-10 text-indigo-500" />
                </div>
                <p className="text-gray-600 text-sm">
                  No assignments created yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {assignments.map((a) => {
                  const dueDate = a.dueDate ? new Date(a.dueDate) : null
                  const overdue = dueDate && dueDate < new Date()

                  return (
                    <div
                      key={a._id}
                      className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-lg text-gray-900 mb-1">
                            {a.title}
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            {a.description || 'No description'}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <CalendarDays className="w-4 h-4 text-indigo-500" />
                            Due:{' '}
                            {a.dueDate
                              ? dueDate.toLocaleDateString()
                              : '—'}
                          </div>
                        </div>

                        <div
                          className={`text-xs font-medium px-3 py-1 rounded-lg ${
                            overdue
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {overdue ? 'Overdue' : 'Active'}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
