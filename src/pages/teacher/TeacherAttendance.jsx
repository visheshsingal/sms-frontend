import React, { useEffect, useState } from 'react'
import API from '../../utils/api'
import { format } from 'date-fns'
import { CalendarDays, FileText, Users, Loader2, ClipboardCheck } from 'lucide-react'

export default function TeacherAttendance() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [assignedClass, setAssignedClass] = useState(null)
  const [students, setStudents] = useState([])
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [editingAttendanceId, setEditingAttendanceId] = useState(null)
  const [activeTab, setActiveTab] = useState('records')
  const [report, setReport] = useState([])

  const load = async () => {
    setLoading(true)
    try {
      const res = await API.get('/teacher/assigned-class/attendance', {
        params: { startDate, endDate },
      })
      setRecords(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const loadReport = async () => {
    if (!assignedClass) return
    try {
      const res = await API.get(`/attendance/report/${assignedClass._id}`, {
        params: { startDate, endDate },
      })
      setReport(res.data)
    } catch (err) {
      console.error('Error loading report', err)
    }
  }

  useEffect(() => {
    const loadClass = async () => {
      try {
        const res = await API.get('/teacher/assigned-class')
        setAssignedClass(res.data || null)
        if (res.data && res.data.students) {
          const mapped = res.data.students.map((s) => ({
            _id: s._id,
            name: `${s.firstName} ${s.lastName}`,
            rollNo: s.rollNumber,
          }))
          setStudents(mapped)
          setAttendanceRecords(
            mapped.map((s) => ({ studentId: s._id, status: 'present' }))
          )
        }
      } catch (err) {
        console.error(err)
      }
    }
    loadClass()
  }, [])

  const loadAttendanceForDate = async (date) => {
    if (!assignedClass) return
    try {
      const res = await API.get('/attendance/class/' + assignedClass._id, {
        params: { startDate: date, endDate: date },
      })
      if (res.data && res.data.length > 0) {
        const a = res.data[0]
        setEditingAttendanceId(a._id)
        const mapped = a.records.map((r) => ({
          studentId: r.studentId._id,
          status: r.status,
        }))
        setAttendanceRecords(mapped)
      } else {
        setEditingAttendanceId(null)
        setAttendanceRecords(
          students.map((s) => ({ studentId: s._id, status: 'present' }))
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    if (assignedClass) loadAttendanceForDate(selectedDate)
  }, [assignedClass, selectedDate])

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <ClipboardCheck className="w-6 h-6 text-indigo-600" />
            <h3 className="text-2xl font-semibold text-gray-900">
              Attendance Management
            </h3>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <label>Start</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-1.5 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <label>End</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2 py-1.5 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              onClick={load}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            >
              Load
            </button>

            <div className="flex items-center gap-2 ml-4">
              <label>Mark for</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-2 py-1.5 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                onClick={() => loadAttendanceForDate(selectedDate)}
                className="px-3 py-1.5 rounded-lg border border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition"
              >
                Fetch
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setActiveTab('records')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'records'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Records
            </button>
            <button
              onClick={() => {
                setActiveTab('report')
                loadReport()
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'report'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Report
            </button>
          </div>

          {/* Records Tab */}
          {activeTab === 'records' && (
            <div>
              {loading ? (
                <div className="flex items-center gap-2 text-gray-600">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                  Loading attendance...
                </div>
              ) : records.length === 0 ? (
                <div className="text-gray-500 text-sm">No records found</div>
              ) : (
                records.map((r) => (
                  <div
                    key={r._id}
                    className="border border-gray-200 rounded-xl p-4 mb-3 bg-white hover:shadow-sm transition"
                  >
                    <div className="text-sm font-semibold text-indigo-600">
                      {new Date(r.date).toLocaleDateString()}
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      {r.records.map((rec) => (
                        <div key={rec.studentId?._id}>
                          {rec.studentId
                            ? `${rec.studentId.firstName} ${rec.studentId.lastName}`
                            : ''}{' '}
                          —{' '}
                          <span
                            className={
                              rec.status === 'present'
                                ? 'text-green-600 font-medium'
                                : 'text-red-600 font-medium'
                            }
                          >
                            {rec.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Report Tab */}
          {activeTab === 'report' && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-3 text-gray-800">
                Attendance Report
              </h4>
              <div className="text-sm text-gray-500 mb-4">
                Summary for {assignedClass?.name || 'class'} between{' '}
                {startDate} and {endDate}
              </div>
              {report.length === 0 ? (
                <div className="text-sm text-gray-500">No report data</div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-indigo-600 text-white">
                      <tr>
                        <th className="px-4 py-3">Roll</th>
                        <th className="px-4 py-3">Student</th>
                        <th className="px-4 py-3 text-right">Total Days</th>
                        <th className="px-4 py-3 text-right">Present</th>
                        <th className="px-4 py-3 text-right">%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {report.map((r) => (
                        <tr
                          key={r.student._id}
                          className="hover:bg-indigo-50 transition"
                        >
                          <td className="px-4 py-3">{r.student.rollNo || '-'}</td>
                          <td className="px-4 py-3">{r.student.name}</td>
                          <td className="px-4 py-3 text-right">
                            {r.totalDays}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {r.presentDays}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-indigo-700">
                            {r.percentage
                              ? r.percentage.toFixed(2) + '%'
                              : '0.00%'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mark Attendance */}
        <div className="mt-6 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-indigo-600" />
            <h4 className="text-lg font-semibold text-gray-900">
              Mark / Edit Attendance for{' '}
              <span className="text-indigo-700">
                {assignedClass ? assignedClass.name : '—'}
              </span>
            </h4>
          </div>

          {!assignedClass ? (
            <div className="text-sm text-gray-500 mt-2">
              No class assigned.
            </div>
          ) : (
            <div>
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-indigo-600 text-white text-sm">
                  <tr>
                    <th className="px-4 py-2 text-left">Roll</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {students.map((s) => (
                    <tr key={s._id} className="hover:bg-indigo-50 transition">
                      <td className="px-4 py-2 text-sm">{s.rollNo || '-'}</td>
                      <td className="px-4 py-2 text-sm">{s.name}</td>
                      <td className="px-4 py-2 text-sm">
                        <select
                          value={
                            attendanceRecords.find(
                              (ar) => ar.studentId === s._id
                            )?.status || 'present'
                          }
                          onChange={(e) =>
                            setAttendanceRecords((prev) =>
                              prev.map((r) =>
                                r.studentId === s._id
                                  ? { ...r, status: e.target.value }
                                  : r
                              )
                            )
                          }
                          className="px-2 py-1 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={async () => {
                    try {
                      const payload = {
                        classId: assignedClass._id,
                        date: selectedDate,
                        records: attendanceRecords,
                      }
                      if (editingAttendanceId) {
                        await API.put(`/attendance/${editingAttendanceId}`, {
                          records: attendanceRecords,
                        })
                        alert('Attendance updated')
                      } else {
                        await API.post('/attendance', payload)
                        alert('Attendance saved')
                      }
                      load()
                    } catch (err) {
                      alert(err?.response?.data?.msg || err.message)
                    }
                  }}
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                >
                  {editingAttendanceId ? 'Update Attendance' : 'Save Attendance'}
                </button>

                <button
                  onClick={() => {
                    setAttendanceRecords(
                      students.map((s) => ({
                        studentId: s._id,
                        status: 'present',
                      }))
                    )
                    setEditingAttendanceId(null)
                  }}
                  className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
