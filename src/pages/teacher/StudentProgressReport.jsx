import React, { useEffect, useState } from 'react'
import API from '../../utils/api'
import { useParams } from 'react-router-dom'
import { BarChart3, Loader2, BookOpen, Award } from 'lucide-react'

export default function StudentProgressReport() {
  const { studentId } = useParams()
  const [records, setRecords] = useState([])
  const [summary, setSummary] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await API.get('/teacher/progress/' + studentId)
        setRecords(res.data)
        const scored = res.data.filter((r) => r.marks != null)
        if (scored.length) {
          const total = scored.reduce((a, b) => a + (b.marks || 0), 0)
          const outOf = scored.reduce((a, b) => a + (b.outOf || 0), 0)
          setSummary({
            average: (total / outOf) * 100 || 0,
            totalMarks: total,
            totalOutOf: outOf,
          })
        } else setSummary({})
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    if (studentId) load()
  }, [studentId])

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <h3 className="text-2xl font-semibold text-gray-900">Progress Report</h3>
          </div>

          {/* Summary Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-center">
              <div className="flex justify-center mb-2">
                <Award className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="text-sm text-gray-500">Average Score</div>
              <div className="text-2xl font-bold text-indigo-700">
                {summary.average ? summary.average.toFixed(2) + '%' : '—'}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-sm text-gray-500">Total Marks</div>
              <div className="text-xl font-semibold text-gray-800">
                {summary.totalMarks || '—'}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-sm text-gray-500">Out of</div>
              <div className="text-xl font-semibold text-gray-800">
                {summary.totalOutOf || '—'}
              </div>
            </div>
          </div>

          {/* Table Section */}
          {loading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              Loading student progress...
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-indigo-500" />
              </div>
              <p className="text-gray-600 text-sm">No progress records available</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-indigo-600 text-white text-sm uppercase tracking-wide">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Exam</th>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Marks</th>
                    <th className="px-4 py-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {records.map((r) => (
                    <tr
                      key={r._id}
                      className="hover:bg-indigo-50 transition-colors duration-150"
                    >
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(r.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">{r.examName || '-'}</td>
                      <td className="px-4 py-3">{r.subject || '-'}</td>
                      <td className="px-4 py-3 font-semibold text-indigo-700">
                        {r.marks != null
                          ? `${r.marks}/${r.outOf || ''}`
                          : r.metrics
                          ? JSON.stringify(r.metrics)
                          : '-'}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{r.remarks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
