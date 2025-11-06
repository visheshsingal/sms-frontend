import React, { useEffect, useState } from 'react'
import API from '../../utils/api'
import { toast } from 'react-toastify'
import { Filter, CalendarDays, CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export default function TeacherLeaves() {
  const [leaves, setLeaves] = useState([])
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const q = filter ? `?status=${filter}` : ''
      const res = await API.get('/leaves' + q)
      setLeaves(res.data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load leaves')
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [filter])

  const review = async (id, status) => {
    try {
      await API.put(`/leaves/${id}`, { status })
      toast.success(`Leave ${status}`)
      load()
    } catch (err) {
      console.error(err)
      toast.error('Failed to update')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-700 border border-red-200'
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <CalendarDays className="w-6 h-6 text-indigo-600" />
            <h3 className="text-2xl font-semibold text-gray-900">Leave Applications</h3>
          </div>

          {/* Filter Section */}
          <div className="flex items-center gap-3 text-sm">
            <Filter className="w-4 h-4 text-gray-500" />
            <label className="text-gray-600 font-medium">Filter</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Leaves List */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              Loading leaves...
            </div>
          ) : leaves.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="w-10 h-10 text-indigo-500" />
              </div>
              <p className="text-gray-600 text-sm">No leave applications found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leaves.map((l) => (
                <div
                  key={l._id}
                  className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {l.studentId
                          ? `${l.studentId.firstName} ${l.studentId.lastName}`
                          : 'Student'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {new Date(l.from).toLocaleDateString()} -{' '}
                        {new Date(l.to).toLocaleDateString()}
                      </div>
                    </div>

                    <div
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        l.status
                      )}`}
                    >
                      {l.status.charAt(0).toUpperCase() + l.status.slice(1)}
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-gray-700 leading-relaxed border-t border-gray-100 pt-2">
                    {l.reason}
                  </div>

                  {l.contact && (
                    <div className="mt-2 text-xs text-gray-500">
                      Contact: {l.contact}
                    </div>
                  )}

                  {l.status === 'pending' && (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => review(l._id, 'approved')}
                        className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve
                      </button>
                      <button
                        onClick={() => review(l._id, 'rejected')}
                        className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
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
