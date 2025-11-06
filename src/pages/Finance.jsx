import React, { useEffect, useState } from 'react'
import API from '../utils/api'
import { IndianRupee, PlusCircle, Receipt } from 'lucide-react'

export default function Finance() {
  const [fees, setFees] = useState([])
  const [form, setForm] = useState({ studentId: '', amount: '', note: '' })
  const [total, setTotal] = useState(0)
  const [students, setStudents] = useState([])

  const load = async () => {
    const res = await API.get('/admin/finance')
    setFees(res.data)
    const t = await API.get('/admin/finance/summary/total')
    setTotal(t.data.total)
    const s = await API.get('/admin/students')
    setStudents(s.data)
  }

  useEffect(() => {
    load()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    try {
      await API.post('/admin/finance', {
        studentId: form.studentId || undefined,
        amount: Number(form.amount),
        note: form.note,
      })
      setForm({ studentId: '', amount: '', note: '' })
      load()
    } catch (err) {
      alert(err?.response?.data?.message || err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Receipt className="w-8 h-8 text-indigo-600" />
              Finance Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage school fees, view transactions, and track total revenue.
            </p>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-10 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Fees Collected</p>
              <h2 className="text-4xl font-bold text-gray-900 mt-2 flex items-center gap-2">
                <IndianRupee className="w-6 h-6 text-indigo-600" />
                {total.toLocaleString('en-IN')}
              </h2>
            </div>
            <div className="hidden sm:block w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <IndianRupee className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Add Payment Form */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-10 hover:shadow-lg transition-all duration-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-600" /> Add Payment
          </h3>
          <form
            onSubmit={submit}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            {/* Student Selector */}
            <div className="col-span-1 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Select Student
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                value={form.studentId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, studentId: e.target.value }))
                }
              >
                <option value="">-- Select Student --</option>
                {students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.firstName} {s.lastName}{' '}
                    {s.rollNumber ? `(${s.rollNumber})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Amount (₹)
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                placeholder="Enter amount"
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: e.target.value }))
                }
                required
              />
            </div>

            {/* Note */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Note
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                placeholder="Add note (optional)"
                value={form.note}
                onChange={(e) =>
                  setForm((f) => ({ ...f, note: e.target.value }))
                }
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-4 flex justify-end">
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <PlusCircle className="w-5 h-5" /> Add Payment
              </button>
            </div>
          </form>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-lg transition-all duration-300">
          <h4 className="text-xl font-semibold text-gray-800 mb-6">
            Recent Transactions
          </h4>

          {fees.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No transactions recorded yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {fees.map((f) => (
                <div
                  key={f._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 hover:bg-gray-50 rounded-lg px-2 transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
                      ₹{f.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {f.studentId
                        ? `${f.studentId.firstName} ${f.studentId.lastName}`
                        : '—'}{' '}
                      • {new Date(f.paidAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-2 sm:mt-0 italic">
                    {f.note || '—'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
