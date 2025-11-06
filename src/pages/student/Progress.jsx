import React, { useEffect, useState } from 'react'
import { BarChart3, BookOpen, Loader2, User } from 'lucide-react'
import API from '../../utils/api'
import { useNavigate } from 'react-router-dom'

export default function StudentProgress() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const me = await API.get('/student/me')
        const studentId = me.data.student._id
        const res = await API.get(`/teacher/progress/${studentId}`)
        setRecords(res.data)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-lg transition-all duration-300">
          <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-2 mb-6">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            Marks & Progress
          </h3>

          {loading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              Loading progress records...
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-indigo-500" />
              </div>
              <p className="text-gray-600 text-sm">No progress records yet</p>
            </div>
          ) : (
            <div className="space-y-5">
              {records.map((r) => (
                <div
                  key={r._id}
                  className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {r.examName ||
                          (r.subject
                            ? `${r.subject} - ${new Date(
                                r.date
                              ).toLocaleDateString()}`
                            : 'Progress Record')}
                      </h4>
                      {r.subject && (
                        <div className="text-sm text-gray-600 mt-1">
                          Subject: {r.subject}
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      {r.marks !== undefined && r.outOf !== undefined ? (
                        <div className="text-lg font-semibold text-indigo-600">
                          {r.marks}/{r.outOf}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No marks</div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(r.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {r.metrics && (
                    <div className="mt-2 text-sm text-gray-700">
                      <strong>Notes:</strong> {r.metrics}
                    </div>
                  )}
                  {r.remarks && (
                    <div className="mt-1 text-sm text-gray-600 flex items-center gap-1">
                      <User className="w-4 h-4 text-indigo-500" />
                      Teacher: {r.remarks}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
