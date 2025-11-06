import React, { useEffect, useState } from 'react'
import { Calendar, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import API from '../../utils/api'

export default function StudentAttendanceReport() {
  const [report, setReport] = useState({
    entries: [],
    totalDays: 0,
    presentDays: 0,
    percentage: 0,
  })
  const [range, setRange] = useState({ start: '', end: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const loadReport = async (e) => {
    e && e.preventDefault()
    setLoading(true)
    try {
      const q = `?startDate=${range.start}&endDate=${range.end}`
      const res = await API.get(`/student/me/attendance/report${q}`)
      setReport(res.data)
    } catch (err) {
      console.error(err)
      if (err?.response?.status === 401) navigate('/student')
      else alert('Failed to load')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-lg transition-all duration-300">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
            <Calendar className="w-6 h-6 text-indigo-600" />
            Attendance Report
          </h3>

          {/* Date Filters */}
          <form
            onSubmit={loadReport}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
          >
            <div>
              <label className="text-sm text-gray-600">From</label>
              <input
                type="date"
                value={range.start}
                onChange={(e) =>
                  setRange((r) => ({ ...r, start: e.target.value }))
                }
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">To</label>
              <input
                type="date"
                value={range.end}
                onChange={(e) =>
                  setRange((r) => ({ ...r, end: e.target.value }))
                }
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800 transition-all"
              >
                Load Report
              </button>
            </div>
          </form>

          {/* Summary */}
          {loading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              Loading attendance data...
            </div>
          ) : (
            <>
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-indigo-700">
                    Present:
                  </span>{' '}
                  {report.presentDays} / {report.totalDays} days —{' '}
                  <span className="font-semibold text-indigo-700">
                    {report.percentage
                      ? report.percentage.toFixed(2)
                      : '0.00'}
                    %
                  </span>
                </p>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {report.entries.length === 0 ? (
                      <tr>
                        <td
                          className="px-6 py-4 text-sm text-gray-500"
                          colSpan={2}
                        >
                          No attendance records for selected range
                        </td>
                      </tr>
                    ) : (
                      report.entries.map((e) => (
                        <tr key={e.date} className="hover:bg-gray-50">
                          <td className="px-6 py-3 text-sm text-gray-900">
                            {new Date(e.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-3">
                            {e.status === 'present' ? (
                              <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                <CheckCircle className="w-4 h-4" /> Present
                              </span>
                            ) : e.status === 'absent' ? (
                              <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
                                <XCircle className="w-4 h-4" /> Absent
                              </span>
                            ) : (
                              <span className="text-gray-500 text-sm">
                                Not marked
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
