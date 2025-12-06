import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../utils/api'
import {
  User,
  ClipboardList,
  Calendar,
  FileText,
  Plane,
  CheckCircle,
  XCircle,
} from 'lucide-react'

export default function StudentDashboard() {
  const [data, setData] = useState({ student: null, class: null })
  const [attendanceSummary, setAttendanceSummary] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [timetables, setTimetables] = useState([])
  const [leaves, setLeaves] = useState([])
  const [form, setForm] = useState({ from: '', to: '', reason: '' })
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, asRes, ttRes, attRes, leavesRes] = await Promise.all([
          API.get('/student/me'),
          API.get('/student/me/assignments'),
          API.get('/student/me/timetable'),
          API.get('/student/me/attendance'),
          API.get('/leaves/me'),
        ])
        setData(meRes.data)
        setAssignments(asRes.data)
        setTimetables(ttRes.data)
        setAttendanceSummary(attRes.data)
        setLeaves(leavesRes.data)
      } catch (err) {
        console.error(err)
        if (err?.response?.status === 401) navigate('/student')
      }
    }
    load()
  }, [navigate])

  const submitLeave = async (e) => {
    e.preventDefault()
    try {
      await API.post('/leaves', form)
      setForm({ from: '', to: '', reason: '' })
      const res = await API.get('/leaves/me')
      setLeaves(res.data)
      alert('Leave applied successfully!')
    } catch (err) {
      alert(err?.response?.data?.message || err.message)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <User className="w-7 h-7 text-indigo-600" />
            Student Dashboard
          </h1>
          <Link
            to="/student/profile"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View Full Profile →
          </Link>
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:col-span-1">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-indigo-600" /> My Profile
            </h4>
            {data.student ? (
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-indigo-50 border-2 border-indigo-100 overflow-hidden mb-4 flex items-center justify-center text-indigo-600 font-bold text-2xl">
                  {data.student.profileImage ? (
                    <img src={data.student.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    (data.student.firstName?.[0] || '') + (data.student.lastName?.[0] || '')
                  )}
                </div>
                <div className="font-bold text-xl text-gray-900 mb-1">
                  {data.student.firstName} {data.student.lastName}
                </div>
                <div className="text-sm text-indigo-600 font-medium bg-indigo-50 px-3 py-1 rounded-full mb-4">
                  Class {data.class ? data.class.name : '—'}
                </div>

                <div className="w-full space-y-3 text-left bg-gray-50 rounded-xl p-4 text-sm border border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Roll No:</span>
                    <span className="font-semibold text-gray-800">{data.student.rollNumber || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Adm No:</span>
                    <span className="font-semibold text-gray-800">{data.student.admissionNumber || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Adm Date:</span>
                    <span className="font-semibold text-gray-800">{data.student.admissionDate ? new Date(data.student.admissionDate).toLocaleDateString() : '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Father:</span>
                    <span className="font-semibold text-gray-800">{data.student.fatherName || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Aadhar:</span>
                    <span className="font-semibold text-gray-800 break-all ml-2 text-right">{data.student.aadharCard || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-semibold text-gray-800 break-all ml-2 text-right">{data.student.email || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Teacher:</span>
                    <span className="font-semibold text-gray-800"> {data.class?.teacher
                      ? `${data.class.teacher.firstName} ${data.class.teacher.lastName}`
                      : '—'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-10">Loading profile...</div>
            )}
          </div>

          {/* Overview */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:col-span-2">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-indigo-600" /> Overview
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">Attendance</div>
                <div className="text-2xl font-bold text-indigo-700">
                  {attendanceSummary
                    ? `${attendanceSummary.percentage.toFixed(2)}%`
                    : '—'}
                </div>
                {attendanceSummary && (
                  <div className="text-xs text-gray-500">
                    {attendanceSummary.presentDays}/
                    {attendanceSummary.totalDays} days present
                  </div>
                )}
              </div>
              <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">Assignments</div>
                <div className="text-2xl font-bold text-green-700">
                  {assignments.length}
                </div>
                <div className="text-xs text-gray-500">
                  Recent: {assignments[0]?.title || '-'}
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-white border border-yellow-100 rounded-xl p-4">
                <div className="text-sm text-gray-600 mb-1">Timetables</div>
                <div className="text-2xl font-bold text-yellow-700">
                  {timetables.length}
                </div>
                <div className="text-xs text-gray-500">
                  Latest: {timetables[0]?.content || '-'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assignments & Timetable */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" /> Assignments
            </h4>
            {assignments.length === 0 ? (
              <div className="text-sm text-gray-500">No assignments found.</div>
            ) : (
              <div className="space-y-3">
                {assignments.map((a) => (
                  <div
                    key={a._id}
                    className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="font-medium text-gray-900">{a.title}</div>
                    <div className="text-sm text-gray-500">
                      Due: {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : '-'}
                    </div>
                    <div className="text-sm text-gray-700 mt-1">
                      {a.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" /> Timetable
            </h4>
            {timetables.length === 0 ? (
              <div className="text-sm text-gray-500">No timetables available.</div>
            ) : (
              <div className="space-y-2 text-sm">
                {timetables.map((t) => (
                  <div
                    key={t._id}
                    className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div>{t.content}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(t.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Leave Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Plane className="w-5 h-5 text-indigo-600" /> Apply for Leave
            </h4>
            <form onSubmit={submitLeave} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="date"
                  value={form.from}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, from: e.target.value }))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none flex-1"
                  required
                />
                <input
                  type="date"
                  value={form.to}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, to: e.target.value }))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none flex-1"
                  required
                />
              </div>
              <textarea
                value={form.reason}
                onChange={(e) =>
                  setForm((f) => ({ ...f, reason: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-sm"
                placeholder="Reason for leave..."
                required
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Apply Leave
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-indigo-600" /> Leave Status
            </h4>
            {leaves.length === 0 ? (
              <div className="text-sm text-gray-500">No leave applications yet.</div>
            ) : (
              <div className="space-y-2 text-sm">
                {leaves.map((l) => (
                  <div
                    key={l._id}
                    className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="font-medium text-gray-900">
                      {new Date(l.from).toLocaleDateString()} -{' '}
                      {new Date(l.to).toLocaleDateString()}
                    </div>
                    <div
                      className={`text-sm font-medium mt-1 ${l.status === 'approved'
                          ? 'text-green-600'
                          : l.status === 'rejected'
                            ? 'text-red-600'
                            : 'text-yellow-600'
                        }`}
                    >
                      Status: {l.status}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{l.reason}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
