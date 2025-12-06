import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Hash, GraduationCap, Users, Loader2 } from 'lucide-react'
import API from '../../utils/api'

export default function StudentProfile() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        setError(null)
        const res = await API.get('/student/me')
        setData(res.data)
      } catch (err) {
        console.error('Failed to load /student/me', err)
        // If auth error, send user to login
        if (err?.response?.status === 401) return navigate('/student')
        // otherwise surface an error message so UI doesn't spin forever
        setError(err?.response?.data?.message || err.message || 'Network error')
      }
    }
    load()
  }, [])


  if (!data)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-lg w-full text-center">
          {!error ? (
            <div className="flex items-center gap-3 justify-center text-gray-600">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              <span className="font-medium">Loading profile...</span>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load profile</h3>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <div className="text-sm text-gray-500 mb-4">
                Common causes: server not running, network error, or missing/expired login token.
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setError(null)
                    setData(null)
                      // retry: re-run effect by calling load directly
                      ; (async () => {
                        try {
                          const res = await API.get('/student/me')
                          setData(res.data)
                        } catch (err) {
                          setError(err?.response?.data?.message || err.message || 'Network error')
                        }
                      })()
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                >
                  Retry
                </button>
                <button
                  onClick={() => navigate('/student')}
                  className="px-4 py-2 border border-gray-200 rounded-md"
                >
                  Go to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )

  const { student, class: cls } = data

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 hover:shadow-lg transition-all duration-300">
          <div className="w-32 h-32 rounded-full bg-indigo-50 border-4 border-indigo-100 overflow-hidden flex items-center justify-center text-indigo-600 font-bold text-4xl shadow-md">
            {student.profileImage ? (
              <img src={student.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              (student.firstName?.[0] || '') + (student.lastName?.[0] || '')
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-gray-600 mt-1">
              {cls ? `Class ${cls.name}` : 'No class assigned'}
            </p>
            <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-3">
              <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
                <GraduationCap className="w-4 h-4" />
                Student Profile
              </div>
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                <Hash className="w-4 h-4" />
                Adm No: {student.admissionNumber || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="mt-8 bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-lg transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" /> Personal & Academic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            <div className="space-y-6">
              <div>
                <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">Basic Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Full Name</span>
                    <span className="font-medium text-gray-900">{student.firstName} {student.lastName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Father's Name</span>
                    <span className="font-medium text-gray-900">{student.fatherName || '—'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Date of Admission</span>
                    <span className="font-medium text-gray-900">{student.admissionDate ? new Date(student.admissionDate).toLocaleDateString() : '—'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Aadhar Card</span>
                    <span className="font-medium text-gray-900">{student.aadharCard || '—'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">Contact</h3>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium text-gray-900">{student.email || '—'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Phone</span>
                    <span className="font-medium text-gray-900">{student.phone || '—'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Address</span>
                    <span className="font-medium text-gray-900 text-right max-w-[60%]">{student.address || '—'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">Academic Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Class</span>
                    <span className="font-medium text-gray-900">{cls ? cls.name : '—'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Roll Number</span>
                    <span className="font-medium text-gray-900">{student.rollNumber || '—'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Reference</span>
                    <span className="font-medium text-gray-900">{student.reference || '—'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">Class Details</h3>
                <div className="space-y-3">
                  {cls && cls.teacher && (
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500">Class Teacher</span>
                      <span className="font-medium text-gray-900">{cls.teacher.firstName} {cls.teacher.lastName}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500">Classmates Count</span>
                    <span className="font-medium text-gray-900">{cls && cls.students ? cls.students.length : 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </main>
  )
}
