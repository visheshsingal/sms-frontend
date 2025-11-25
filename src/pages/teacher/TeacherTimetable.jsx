import React, { useEffect, useState } from 'react'
import API from '../../utils/api'
import { toast } from 'react-toastify'
import { CalendarDays, Upload, Loader2, Clock } from 'lucide-react'

export default function TeacherTimetable() {
  const [timetables, setTimetables] = useState([])
  const [form, setForm] = useState({ classId: '', content: '' })
  const [assignedClass, setAssignedClass] = useState(null)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      if (!form.classId) {
        // nothing to load until we know the class id assigned
        setTimetables([])
        setLoading(false)
        return
      }
      const res = await API.get('/teacher/timetable/' + form.classId)
      setTimetables(res.data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load timetables')
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
  }, [form.classId])

  const submit = async (e) => {
    e.preventDefault()
    try {
      if (!form.classId) {
        toast.error('Please select or enter a class')
        return
      }
      await API.post('/teacher/timetable', form)
      setForm({ ...form, content: '' })
      load()
      toast.success('Timetable uploaded successfully')
    } catch (err) {
      console.error(err)
      toast.error('Upload failed')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <CalendarDays className="w-6 h-6 text-indigo-600" />
            <h3 className="text-2xl font-semibold text-gray-900">
              Class Timetable
            </h3>
          </div>
          <p className="text-gray-600 text-sm">
            Upload and manage your class timetable easily. Provide either text
            content or a timetable URL.
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-5 h-5 text-indigo-600" />
            <h4 className="text-lg font-semibold text-gray-900">
              Upload New Timetable
            </h4>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="text-sm text-gray-600">
              Class:{' '}
              <span className="font-medium text-indigo-700">
                {assignedClass
                  ? assignedClass.name
                  : form.classId || 'Not selected'}
              </span>
            </div>

            <input
              value={form.classId}
              onChange={(e) =>
                setForm((f) => ({ ...f, classId: e.target.value }))
              }
              placeholder="Enter Class ID"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <textarea
              value={form.content}
              onChange={(e) =>
                setForm((f) => ({ ...f, content: e.target.value }))
              }
              placeholder="Enter timetable text or URL (e.g. Google Drive link)"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              required
              rows={3}
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Upload Timetable
              </button>
            </div>
          </form>
        </div>

        {/* Timetable List */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h4 className="text-lg font-semibold text-gray-900">
              Uploaded Timetables
            </h4>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              Loading timetables...
            </div>
          ) : timetables.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="w-10 h-10 text-indigo-500" />
              </div>
              <p className="text-gray-600 text-sm">No timetables uploaded yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {timetables.map((t) => (
                <div
                  key={t._id}
                  className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div className="flex-1">
                      {t.content.startsWith('http') ? (
                        <a
                          href={t.content}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 font-medium hover:underline"
                        >
                          Open Timetable
                        </a>
                      ) : (
                        <div className="font-medium text-gray-900">
                          {t.content}
                        </div>
                      )}
                      {t.uploadedBy && (
                        <div className="text-sm text-gray-600 mt-1">
                          Uploaded by:{' '}
                          {t.uploadedBy.firstName} {t.uploadedBy.lastName}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(t.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
