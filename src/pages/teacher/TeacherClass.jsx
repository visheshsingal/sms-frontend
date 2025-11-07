import React, { useEffect, useState } from 'react'
import API from '../../utils/api'
import { Users, ClipboardList, Loader2 } from 'lucide-react'

export default function TeacherClass() {
  const [cls, setCls] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get('/teacher/assigned-class')
        setCls(res.data || null)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-600 p-6">
        <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
        Loading class data...
      </div>
    )
  }

  if (!cls) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-md border border-gray-100">
        <div className="w-20 h-20 mx-auto bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
          <ClipboardList className="w-10 h-10" />
        </div>
        <p className="text-gray-600 text-sm">No class assigned yet.</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-lg transition-all duration-300 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-indigo-600" />
            <h3 className="text-2xl font-semibold text-gray-900">
              Class Overview
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
              <div className="text-sm text-gray-500">Class Name</div>
              <div className="text-lg font-semibold text-indigo-700">{cls.name}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="text-sm text-gray-500">Total Students</div>
              <div className="text-lg font-semibold text-gray-800">
                {cls.students?.length || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Students</h4>
            <div className="text-sm text-gray-500">
              Showing {cls.students?.length || 0} enrolled students
            </div>
          </div>

          {cls.students && cls.students.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-indigo-600 text-white text-sm uppercase">
                  <tr>
                    <th className="px-4 py-3">Roll No</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {cls.students.map((s, i) => (
                    <tr
                      key={s._id || i}
                      className="hover:bg-indigo-50 transition-colors duration-150"
                    >
                      <td className="px-4 py-3 text-gray-700">
                        {s.rollNumber || '—'}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {s.firstName} {s.lastName}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {s.email || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-indigo-500" />
              </div>
              <p className="text-gray-600 text-sm">
                No students found in this class.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
