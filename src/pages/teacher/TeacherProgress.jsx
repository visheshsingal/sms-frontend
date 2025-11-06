import React, { useEffect, useState } from 'react'
import API from '../../utils/api'
import { toast } from 'react-toastify'
import { BookOpen, UserPlus, Loader2, ClipboardList } from 'lucide-react'

export default function TeacherProgress() {
  const [studentId, setStudentId] = useState('')
  const [records, setRecords] = useState([])
  const [form, setForm] = useState({
    studentId: '',
    classId: '',
    examName: '',
    subject: '',
    marks: '',
    outOf: '',
    remarks: '',
  })
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await API.get('/teacher/assigned-class')
        const cls = res.data
        if (cls && cls.students) setStudents(cls.students)
        if (cls && cls._id) setForm((f) => ({ ...f, classId: cls._id }))
      } catch (err) {
        console.error(err)
      }
    }
    loadStudents()
  }, [])

  const load = async () => {
    if (!studentId) return
    setLoading(true)
    try {
      const res = await API.get('/teacher/progress/' + studentId)
      setRecords(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (studentId) load()
  }, [studentId])

  const submit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        studentId: form.studentId,
        classId: form.classId,
        examName: form.examName,
        subject: form.subject,
        marks: form.marks ? Number(form.marks) : undefined,
        outOf: form.outOf ? Number(form.outOf) : undefined,
        remarks: form.remarks,
      }
      await API.post('/teacher/progress', payload)
      toast.success('Progress record added successfully!')
      setForm({
        studentId: '',
        classId: form.classId,
        examName: '',
        subject: '',
        marks: '',
        outOf: '',
        remarks: '',
      })
      setStudentId('')
    } catch (err) {
      toast.error('Failed to save record.')
      console.error(err)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <ClipboardList className="w-6 h-6 text-indigo-600" />
            <h3 className="text-2xl font-semibold text-gray-900">
              Student Progress (Exams)
            </h3>
          </div>
          <p className="text-gray-600 text-sm">
            Record and review exam results and student performance.
          </p>
        </div>

        {/* Add Record Form */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-5 h-5 text-indigo-600" />
            <h4 className="text-lg font-semibold text-gray-900">Add New Record</h4>
          </div>

          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Select Student
              </label>
              <select
                value={form.studentId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, studentId: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              >
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.firstName} {s.lastName}{' '}
                    {s.rollNumber ? `(${s.rollNumber})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Class ID</label>
              <input
                value={form.classId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, classId: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            <input
              value={form.examName}
              onChange={(e) =>
                setForm((f) => ({ ...f, examName: e.target.value }))
              }
              placeholder="Exam Name"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              value={form.subject}
              onChange={(e) =>
                setForm((f) => ({ ...f, subject: e.target.value }))
              }
              placeholder="Subject"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <div className="flex gap-3">
              <input
                value={form.marks}
                onChange={(e) =>
                  setForm((f) => ({ ...f, marks: e.target.value }))
                }
                placeholder="Marks"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                value={form.outOf}
                onChange={(e) =>
                  setForm((f) => ({ ...f, outOf: e.target.value }))
                }
                placeholder="Out Of"
                className="w-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <textarea
                value={form.remarks}
                onChange={(e) =>
                  setForm((f) => ({ ...f, remarks: e.target.value }))
                }
                placeholder="Remarks"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
              >
                Add Exam Record
              </button>
            </div>
          </form>
        </div>

        {/* Student Records Section */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h4 className="text-lg font-semibold text-gray-900">
              Student Progress Records
            </h4>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">Load student records</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.firstName} {s.lastName}
                </option>
              ))}
            </select>
            <button
              onClick={load}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Load
            </button>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              Loading records...
            </div>
          ) : records.length === 0 ? (
            <div className="text-sm text-gray-500">No records available</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Exam</th>
                    <th className="px-4 py-2">Subject</th>
                    <th className="px-4 py-2">Marks</th>
                    <th className="px-4 py-2">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {records.map((r) => (
                    <tr key={r._id} className="hover:bg-indigo-50 transition">
                      <td className="px-4 py-2">
                        {new Date(r.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">{r.examName || '-'}</td>
                      <td className="px-4 py-2">{r.subject || '-'}</td>
                      <td className="px-4 py-2 font-semibold text-indigo-700">
                        {r.marks != null
                          ? `${r.marks}/${r.outOf || ''}`
                          : r.metrics
                          ? JSON.stringify(r.metrics)
                          : '-'}
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                        {r.remarks || '-'}
                      </td>
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
