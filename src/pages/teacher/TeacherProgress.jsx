import React, { useEffect, useState } from 'react'
import API from '../../utils/api'
import { toast } from 'react-toastify'
import { BookOpen, UserPlus, Loader2, ClipboardList, Save } from 'lucide-react'

export default function TeacherProgress() {
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([]) // List of students in selected class
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [loading, setLoading] = useState(false)

  // Exam Details Form
  const [examForm, setExamForm] = useState({
    classId: '',
    examName: '',
    subject: '',
    outOf: '',
    date: new Date().toISOString().slice(0, 10)
  })

  // Student Marks State: { studentId: { marks: '', remarks: '', absent: false } }
  const [marksData, setMarksData] = useState({})

  // Load classes initially
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const res = await API.get('/teacher/teaching-classes')
        // res.data is expected to be an array of objects: [{ _id, name, subjects: [] }]
        if (Array.isArray(res.data)) {
          setClasses(res.data)
        } else {
          setClasses([])
          console.warn('Unexpected format for classes data:', res.data)
        }
      } catch (err) {
        console.error('Error loading classes:', err)
        toast.error('Failed to load classes')
      }
    }
    loadClasses()
  }, [])

  // Load students when class changes
  useEffect(() => {
    if (!examForm.classId) {
      setStudents([])
      setMarksData({})
      return
    }
    const loadStudents = async () => {
      setLoadingStudents(true)
      try {
        const res = await API.get(`/admin/classes/${examForm.classId}`)
        const studentList = res.data.students || []
        setStudents(studentList)
        // Initialize marks data for new list
        const initialMarks = {}
        studentList.forEach(s => {
          initialMarks[s._id] = { marks: '', remarks: '', absent: false }
        })
        setMarksData(initialMarks)
      } catch (err) {
        console.error(err)
        toast.error('Failed to load students')
      }
      setLoadingStudents(false)
    }
    loadStudents()
  }, [examForm.classId])

  const handleMarkChange = (studentId, field, value) => {
    setMarksData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!students.length) return toast.error('No students in this class')

    setLoading(true)
    try {
      // Prepare payload
      const records = students.map(s => ({
        studentId: s._id,
        marks: marksData[s._id]?.marks || '',
        remarks: marksData[s._id]?.remarks || '',
        absent: marksData[s._id]?.absent || false
      })).filter(r => r.marks !== '' || r.remarks !== '' || r.absent)

      // Allow if attendance is marked (absent true) even if marks empty
      if (records.length === 0) {
        toast.warning('Please enter marks for at least one student')
        setLoading(false)
        return
      }

      await API.post('/teacher/progress/bulk', {
        ...examForm,
        records
      })
      toast.success('Results saved successfully!')

      // Reset form or clear marks?
      setExamForm(prev => ({ ...prev, examName: '', subject: '', outOf: '', date: new Date().toISOString().slice(0, 10) }))
      // Reset marks but keep students loaded
      const resetMarks = {}
      students.forEach(s => { resetMarks[s._id] = { marks: '', remarks: '', absent: false } })
      setMarksData(resetMarks)

    } catch (err) {
      toast.error('Failed to save records')
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-2">
            <ClipboardList className="w-6 h-6 text-indigo-600" />
            <h3 className="text-2xl font-semibold text-gray-900">Student Progress Entry</h3>
          </div>
          <p className="text-gray-600 text-sm">Select a class and enter exam details to record marks for the entire batch.</p>
        </div>

        <form onSubmit={submit} className="space-y-6">
          {/* Exam Details Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" /> Exam Details
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select
                  value={examForm.classId}
                  onChange={e => setExamForm({ ...examForm, classId: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                >
                  <option value="">-- Select Class --</option>
                  {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
                <input
                  value={examForm.examName}
                  onChange={e => setExamForm({ ...examForm, examName: e.target.value })}
                  placeholder="e.g. Mid-Term, Unit Test 1"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  value={examForm.subject}
                  onChange={e => setExamForm({ ...examForm, subject: e.target.value })}
                  placeholder="e.g. Mathematics"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Marks (Out Of)</label>
                <input
                  type="number"
                  value={examForm.outOf}
                  onChange={e => setExamForm({ ...examForm, outOf: e.target.value })}
                  placeholder="e.g. 100"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={examForm.date}
                  onChange={e => setExamForm({ ...examForm, date: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Student List Table */}
          {examForm.classId && (
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-indigo-600" /> Student Marks
                </h4>
                <div className="text-sm text-gray-500">
                  Total Students: {students.length}
                </div>
              </div>

              {loadingStudents ? (
                <div className="py-12 flex justify-center text-gray-600 gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-600" /> Loading students...
                </div>
              ) : students.length === 0 ? (
                <div className="py-12 text-center text-gray-500">No students found in this class.</div>
              ) : (
                <div className="overflow-x-auto border rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-700 text-sm font-semibold border-b">
                      <tr>
                        <th className="px-6 py-3 w-16">#</th>
                        <th className="px-6 py-3">Roll No</th>
                        <th className="px-6 py-3">Student Name</th>
                        <th className="px-6 py-3 w-32">Marks</th>
                        <th className="px-6 py-3 w-24">Absent</th>
                        <th className="px-6 py-3">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {students.map((s, idx) => (
                        <tr key={s._id} className="hover:bg-indigo-50/50 transition-colors">
                          <td className="px-6 py-3 text-gray-500 text-sm">{idx + 1}</td>
                          <td className="px-6 py-3 text-gray-700 text-sm">{s.rollNumber || '-'}</td>
                          <td className="px-6 py-3 font-medium text-gray-900">{s.firstName} {s.lastName}</td>
                          <td className="px-6 py-3">
                            <input
                              type="number"
                              value={marksData[s._id]?.marks || ''}
                              onChange={e => handleMarkChange(s._id, 'marks', e.target.value)}
                              disabled={marksData[s._id]?.absent}
                              className="w-full px-3 py-1.5 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-center disabled:bg-gray-100 disabled:text-gray-400"
                              placeholder={marksData[s._id]?.absent ? "Ab" : "-"}
                            />
                          </td>
                          <td className="px-6 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={marksData[s._id]?.absent || false}
                              onChange={e => handleMarkChange(s._id, 'absent', e.target.checked)}
                              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                          </td>
                          <td className="px-6 py-3">
                            <input
                              type="text"
                              value={marksData[s._id]?.remarks || ''}
                              onChange={e => handleMarkChange(s._id, 'remarks', e.target.value)}
                              className="w-full px-3 py-1.5 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                              placeholder="Optional remark"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {examForm.classId && students.length > 0 && (
            <div className="flex justify-end sticky bottom-6 z-10">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? 'Saving...' : 'Save All Records'}
              </button>
            </div>
          )}
        </form>
      </div>
    </main>
  )
}
