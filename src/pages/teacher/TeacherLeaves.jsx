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

  const [reviewModal, setReviewModal] = useState({ open: false, id: null, status: '', message: '' })

  const openReview = (id, status) => {
    // If approving, we can just do it without message (or optional). If rejecting, we definitely need a message.
    if (status === 'approved') {
      if (confirm('Approve this leave?')) review(id, status, 'Approved');
    } else {
      setReviewModal({ open: true, id, status, message: '' })
    }
  }

  const review = async (id, status, message) => {
    try {
      await API.put(`/leaves/${id}`, { status, message })
      toast.success(`Leave ${status}`)
      setReviewModal({ open: false, id: null, status: '', message: '' })
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
        {/* ... Header and Filter ... */}

        {/* Review Modal */}
        {reviewModal.open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-lg text-gray-800">
                  {reviewModal.status === 'rejected' ? 'Reject Leave' : 'Review Leave'}
                </h3>
                <button onClick={() => setReviewModal({ ...reviewModal, open: false })} className="text-gray-500 hover:text-gray-700">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <p className="text-sm text-gray-600">
                  Please provide a reason for {reviewModal.status === 'rejected' ? 'rejection' : 'this action'}. This will be sent to the student.
                </p>
                <textarea
                  className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  rows={4}
                  placeholder="Type reason here..."
                  value={reviewModal.message}
                  onChange={(e) => setReviewModal({ ...reviewModal, message: e.target.value })}
                />
              </div>
              <div className="p-4 bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={() => setReviewModal({ ...reviewModal, open: false })}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => review(reviewModal.id, reviewModal.status, reviewModal.message)}
                  disabled={!reviewModal.message.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  Confirm {reviewModal.status === 'rejected' ? 'Rejection' : 'Action'}
                </button>
              </div>
            </div>
          </div>
        )}

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
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
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
                      className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${getStatusColor(
                        l.status
                      )}`}
                    >
                      {l.status.charAt(0).toUpperCase() + l.status.slice(1)}
                    </div>
                  </div>

                  {/* History / Chat View */}
                  <div className="mt-4 space-y-3 bg-gray-50 rounded-lg p-4 border border-gray-100 max-h-60 overflow-y-auto">
                    {l.history && l.history.length > 0 ? (
                      l.history.map((h, i) => (
                        <div key={i} className={`flex flex-col ${h.role === 'student' ? 'items-start' : 'items-end'}`}>
                          <div className={`max-w-[80%] rounded-lg p-3 text-sm ${h.role === 'student'
                            ? 'bg-white border border-gray-200 text-gray-800'
                            : 'bg-indigo-100 text-indigo-900'
                            }`}>
                            <p>{h.message}</p>
                            <div className="mt-1 text-[10px] opacity-70 flex items-center gap-1">
                              <span className="capitalize font-semibold">{h.role}</span> • {new Date(h.date).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-700 leading-relaxed">
                        {l.reason}
                      </div>
                    )}
                  </div>

                  {l.status === 'pending' && (
                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => openReview(l._id, 'approved')}
                        className="w-full sm:w-auto flex items-center gap-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve
                      </button>
                      <button
                        onClick={() => openReview(l._id, 'rejected')}
                        className="w-full sm:w-auto flex items-center gap-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
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
