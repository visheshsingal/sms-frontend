import React, { useEffect, useState } from 'react'
import { FileText, Clock, Paperclip, AlertTriangle } from 'lucide-react'
import API from '../../utils/api'

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([])
  const [month, setMonth] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const q = month ? `?month=${month}` : ''
        const res = await API.get(`/student/me/assignments${q}`)
        setAssignments(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [month])

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-lg transition-all duration-300">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
            <FileText className="w-6 h-6 text-indigo-600" />
            Assignments
          </h3>

          {/* Month filter */}
          <div className="mb-4 flex items-center gap-3">
            <label className="text-sm text-gray-700">Filter by month:</label>
            <input type="month" value={month} onChange={(e)=> setMonth(e.target.value)} className="px-3 py-2 border rounded-md" />
            {month && <button onClick={()=> setMonth('')} className="text-sm text-indigo-600 hover:underline">Clear</button>}
          </div>

          {assignments.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-10 h-10 text-indigo-500" />
              </div>
              <p className="text-gray-600 text-sm">No assignments available</p>
            </div>
          ) : (
            <div className="space-y-5">
              {assignments.map((a) => {
                const due = a.dueDate ? new Date(a.dueDate) : null
                const isOverdue = due ? due < new Date() : false
                return (
                  <div
                    key={a._id}
                    className="border border-gray-200 bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg text-gray-900">
                          {a.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          By:{' '}
                          {a.createdBy
                            ? `${a.createdBy.firstName} ${a.createdBy.lastName}`
                            : 'Teacher'}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isOverdue
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        <Clock className="inline w-4 h-4 mr-1" />
                        {due ? due.toLocaleDateString() : 'No due date'}
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mt-3 leading-relaxed">
                      {a.description || 'No description provided.'}
                    </p>

                    {a.attachments?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {a.attachments.map((at, i) => (
                          <a
                            key={i}
                            href={at}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg shadow-sm transition-all"
                          >
                            <Paperclip className="w-4 h-4" />
                            Attachment {i + 1}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
