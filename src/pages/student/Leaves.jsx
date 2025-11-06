import React, { useEffect, useState } from 'react'
import { Calendar, Send, CheckCircle, XCircle, Clock, Phone } from 'lucide-react'
import API from '../../utils/api'
import { useNavigate } from 'react-router-dom'

export default function StudentLeaves() {
  const [form, setForm] = useState({ from: '', to: '', reason: '', contact: '' })
  const [leaves, setLeaves] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get('/leaves/me')
        setLeaves(res.data)
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    try {
      await API.post('/leaves', form)
      const res = await API.get('/leaves/me')
      setLeaves(res.data)
      setForm({ from: '', to: '', reason: '', contact: '' })
      alert('Leave applied successfully!')
    } catch (err) {
      alert(err?.response?.data?.message || err.message)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Apply Form */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-lg transition-all duration-300">
          <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-600" />
            Apply for Leave
          </h3>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">From</label>
                <input
                  required
                  type="date"
                  value={form.from}
                  onChange={(e) => setForm((f) => ({ ...f, from: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">To</label>
                <input
                  required
                  type="date"
                  value={form.to}
                  onChange={(e) => setForm((f) => ({ ...f, to: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600 flex items-center gap-1">
                <Phone className="w-4 h-4 text-indigo-500" /> Contact
              </label>
              <input
                type="text"
                value={form.contact}
                onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Phone or email"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Reason</label>
              <textarea
                required
                value={form.reason}
                onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                rows={4}
              />
            </div>

            <div className="text-right">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition-all"
              >
                <Send className="w-4 h-4" />
                Submit Leave
              </button>
            </div>
          </form>
        </div>

        {/* Leave List */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-lg transition-all duration-300">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Your Leave Applications
          </h3>

          <div className="space-y-4">
            {leaves.length === 0 && (
              <div className="text-sm text-gray-500">No leave applications</div>
            )}
            {leaves.map((l) => (
              <div
                key={l._id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-800 font-medium">
                    {new Date(l.from).toLocaleDateString()} →{' '}
                    {new Date(l.to).toLocaleDateString()}
                  </div>
                  <div
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${
                      l.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : l.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {l.status === 'approved' ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : l.status === 'rejected' ? (
                      <XCircle className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    {l.status}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-2 leading-snug">{l.reason}</p>
                {l.reviewedBy && (
                  <div className="text-xs text-gray-500 mt-2">
                    Reviewed by: {l.reviewedBy}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
