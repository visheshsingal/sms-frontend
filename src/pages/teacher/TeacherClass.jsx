import React, { useEffect, useState } from 'react'
import API from '../../utils/api'
import { Users, ClipboardList, Loader2 } from 'lucide-react'

export default function TeacherClass() {
  const [cls, setCls] = useState(null)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

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

  if (!cls || !cls._id) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-md border border-gray-100">
        <div className="w-20 h-20 mx-auto bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
          <ClipboardList className="w-10 h-10" />
        </div>
        <p className="text-gray-600 text-sm">No class assigned yet.</p>
      </div>
    )
  }

  const filteredStudents = (cls.students || []).filter((s) => {
    const search = query.toLowerCase().trim()
    if (!search) return true

    const name = `${s.firstName} ${s.lastName}`.toLowerCase()
    const roll = (s.rollNumber || '').toLowerCase()
    const email = (s.email || '').toLowerCase()
    const adm = (s.admissionNumber || '').toLowerCase()
    const father = (s.fatherName || '').toLowerCase()

    return name.includes(search) || roll.includes(search) || email.includes(search) || adm.includes(search) || father.includes(search)
  })

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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Students</h4>
              <p className="text-sm text-gray-500 mt-1">
                Showing {filteredStudents.length} of {cls.students?.length || 0} students
              </p>
            </div>
            <div className="w-full sm:w-72">
              <input
                type="text"
                placeholder="Search name, roll, admission no..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
            </div>
          </div>

          {filteredStudents.length > 0 ? (
            <>
              {/* Desktop / Tablet: table view */}
              <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full table-auto text-sm text-left text-gray-700">
                  <thead className="bg-indigo-600 text-white text-sm uppercase">
                    <tr>
                      <th className="px-4 py-3">Profile</th>
                      <th className="px-4 py-3">Roll No</th>
                      <th className="px-4 py-3">Adm No</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Father's Name</th>
                      <th className="px-4 py-3">Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {filteredStudents.map((s, i) => (
                      <tr
                        key={s._id || i}
                        className="hover:bg-indigo-50 transition-colors duration-150"
                      >
                        <td className="px-4 py-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 overflow-hidden flex items-center justify-center text-indigo-600 font-bold text-xs">
                            {s.profileImage ? (
                              <img src={s.profileImage} alt={s.firstName} className="w-full h-full object-cover" />
                            ) : (
                              (s.firstName?.[0] || '') + (s.lastName?.[0] || '')
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700 whitespace-nowrap sm:whitespace-normal break-words">
                          {s.rollNumber || '—'}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {s.admissionNumber || '—'}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap sm:whitespace-normal break-words">
                          {s.firstName} {s.lastName}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {s.fatherName || '—'}
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap sm:whitespace-normal break-words">
                          {s.email || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile: compact list view */}
              <div className="block sm:hidden space-y-3">
                {filteredStudents.map((s, i) => (
                  <div key={s._id || i} className="bg-white border rounded-lg p-3 flex gap-3 items-start">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 overflow-hidden flex-shrink-0 flex items-center justify-center text-indigo-600 font-bold">
                      {s.profileImage ? (
                        <img src={s.profileImage} alt={s.firstName} className="w-full h-full object-cover" />
                      ) : (
                        (s.firstName?.[0] || '') + (s.lastName?.[0] || '')
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-900">{s.firstName} {s.lastName}</div>
                        <div className="text-sm text-gray-500">Roll: {s.rollNumber || '—'}</div>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Adm: {s.admissionNumber || '-'} • Father: {s.fatherName || '-'}</div>
                      <div className="text-xs text-gray-500 mt-1">{s.email || '—'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-indigo-500" />
              </div>
              <p className="text-gray-600 text-sm">
                No students found matching "{query}"
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
