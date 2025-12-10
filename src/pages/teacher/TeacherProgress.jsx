import React, { useEffect, useState } from 'react'
import API from '../../utils/api'
import { toast } from 'react-toastify'
import { BookOpen, UserPlus, Loader2, ClipboardList, Save } from 'lucide-react'

export default function TeacherProgress() {
  const [classes, setClasses] = useState([])
  const [students, setStudents] = useState([]) // List of students in selected class
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

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

  // Check Attendance Status whenever Date or Class changes
  useEffect(() => {
    if (!examForm.classId || !examForm.date || students.length === 0) return

    const checkAttendance = async () => {
      try {
        // Fetch attendance for the specific date
        // API: /attendance/class/:classId?startDate=...&endDate=...
        const res = await API.get(`/attendance/class/${examForm.classId}`, {
          params: { startDate: examForm.date, endDate: examForm.date }
        })
        
        const attendanceRecords = res.data || []
        // Assuming response is array of daily attendance objects. We need the one for this date.
        // Actually the API returns records matching the range.
        const recordForDay = attendanceRecords.find(r => 
           new Date(r.date).toISOString().slice(0, 10) === examForm.date
        )

        if (recordForDay && recordForDay.records) {
           setMarksData(prev => {
              const updated = { ...prev }
              let changed = false
              
              // Map of absent student IDs
              const absentSet = new Set()
              recordForDay.records.forEach(r => {
                 if (r.status === 'absent') absentSet.add(String(r.studentId._id || r.studentId)) 
              })

              students.forEach(s => {
                 const isAbsent = absentSet.has(String(s._id))
                 // Only update if changed to avoid loop/flicker
                 if (updated[s._id]?.absent !== isAbsent) {
                    updated[s._id] = { 
                       ...updated[s._id], 
                       absent: isAbsent,
                       // If absent, maybe clear marks? User said "apne aap show ho jae"
                       marks: isAbsent ? '' : updated[s._id].marks,
                       remarks: isAbsent ? 'Absent for Exam' : updated[s._id].remarks
                    }
                    changed = true
                 }
              })
              
              return changed ? updated : prev
           })
        } else {
            // No attendance found -> assume all present? Or just don't mark absent automatically.
            // If user changes date to one with no attendance, we should probably reset absent status?
            setMarksData(prev => {
                const updated = { ...prev }
                let changed = false
                students.forEach(s => {
                    if (updated[s._id]?.absent) { // access check was true, now false
                        updated[s._id] = { ...updated[s._id], absent: false, remarks: '' }
                        changed = true
                    }
                })
                return changed ? updated : prev
            })
        }

      } catch (err) {
        console.error('Error fetching attendance for cross-check:', err)
      }
    }
    checkAttendance()
  }, [examForm.date, examForm.classId, students.length])

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
      setRefreshKey(k => k + 1)
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
                        <th className="px-6 py-3">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {students.map((s, idx) => {
                        const isAbsent = marksData[s._id]?.absent || false
                        return (
                          <tr key={s._id} className="hover:bg-indigo-50/50 transition-colors">
                            <td className="px-6 py-3 text-gray-500 text-sm">{idx + 1}</td>
                            <td className="px-6 py-3 text-gray-700 text-sm">{s.rollNumber || '-'}</td>
                            <td className="px-6 py-3 font-medium text-gray-900">{s.firstName} {s.lastName}</td>
                            <td className="px-6 py-3">
                              {isAbsent ? (
                                <div className="px-3 py-1.5 bg-red-100 text-red-700 text-sm font-semibold text-center rounded border border-red-200">
                                  Absent
                                </div>
                              ) : (
                                <input
                                  type="number"
                                  value={marksData[s._id]?.marks || ''}
                                  onChange={e => handleMarkChange(s._id, 'marks', e.target.value)}
                                  className="w-full px-3 py-1.5 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-center"
                                  placeholder="-"
                                />
                              )}
                            </td>
                            <td className="px-6 py-3">
                              <input
                                type="text"
                                value={marksData[s._id]?.remarks || ''}
                                onChange={e => handleMarkChange(s._id, 'remarks', e.target.value)}
                                className="w-full px-3 py-1.5 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder={isAbsent ? "Student is absent" : "Optional remark"}
                                disabled={isAbsent}
                              />
                            </td>
                          </tr>
                        )
                      })}
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

        {/* Existing Marks History */}
        {examForm.classId && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Recorded Exams History</h4>
            <HistoryList classId={examForm.classId} key={refreshKey} />
          </div>
        )}
      </div>
    </main>
  )
}

// ... (previous code remains same)

function HistoryList({ classId }) {
  const [summary, setSummary] = useState([])
  const [selectedExamIndex, setSelectedExamIndex] = useState('') // Store index instead of composite string
  const [records, setRecords] = useState([])
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [loadingRecords, setLoadingRecords] = useState(false)
  const [search, setSearch] = useState('')

  // Load summary list for dropdown
  useEffect(() => {
    setSelectedExamIndex('')
    setRecords([])
    const fetchSummary = async () => {
      setLoadingSummary(true)
      try {
        const res = await API.get(`/teacher/progress/summary/${classId}`)
        setSummary(res.data || [])
      } catch (err) { console.error(err) }
      setLoadingSummary(false)
    }
    fetchSummary()
  }, [classId])

  // Load records when exam selected
  useEffect(() => {
    if (selectedExamIndex === '') {
      setRecords([])
      return
    }
    const fetchRecords = async () => {
      setLoadingRecords(true)
      try {
        const examData = summary[selectedExamIndex]
        if (!examData) return

        const { examName, subject, date } = examData
        console.log('Fetching records with params:', { classId, examName, subject, date })

        const res = await API.get('/teacher/progress/records', {
          params: { classId, examName, subject, date }
        })
        setRecords(res.data || [])
      } catch (err) { 
        console.error('Fetch records error:', err)
        const msg = err.response?.data?.message || err.message || 'Failed to load exam records'
        const detail = err.response?.data?.error
        toast.error(detail ? `${msg}: ${detail}` : msg)
      }
      setLoadingRecords(false)
    }
    fetchRecords()
  }, [selectedExamIndex, classId, summary])

  // Filter records
  const filteredRecords = records.filter(r => {
    if (!search) return true
    const s = r.studentId
    // Allow records even if studentId is missing, unless searching
    if (!s) return search ? false : true 
    const str = `${s.firstName} ${s.lastName} ${s.rollNumber}`.toLowerCase()
    return str.includes(search.toLowerCase())
  })

  // Format date helpful
  const formatDate = (d) => new Date(d).toLocaleDateString()

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Exam</label>
          <select
            value={selectedExamIndex}
            onChange={(e) => setSelectedExamIndex(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
          >
            <option value="">-- Choose an Exam Filter --</option>
            {summary.map((item, idx) => (
              <option key={idx} value={idx}>
                {item.examName} - {item.subject} ({formatDate(item.date)})
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search Student</label>
          <input
            type="text"
            placeholder="Name or Roll No..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={selectedExamIndex === ''}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
          />
        </div>
      </div>

      {loadingSummary && <div className="text-sm text-gray-500">Loading exams list...</div>}

      {/* Results View */}
      {selectedExamIndex !== '' && (
        <div className="border rounded-xl overflow-hidden mt-4">
          <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
            <h5 className="font-semibold text-gray-700">Exam Results</h5>
            <span className="text-xs text-gray-500">
               Showing {filteredRecords.length} / {records.length} students
            </span>
          </div>
          
          {loadingRecords ? (
            <div className="p-8 text-center text-gray-500 flex justify-center gap-2">
                <Loader2 className="animate-spin w-5 h-5"/> Loading records...
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {records.length === 0 ? (
                <div>No records found for this exam.</div>
              ) : search ? (
                <div>No matching student records found.</div>
              ) : (
                <div>No student records available for display.</div>
              )}
              <div className="mt-2 text-xs text-gray-400">Showing 0 of {records.length} records returned from server.</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white text-gray-600 border-b">
                  <tr>
                    <th className="px-4 py-3">Roll No</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Marks</th>
                    <th className="px-4 py-3">Max</th>
                    <th className="px-4 py-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredRecords.map((rec) => {
                     const st = rec.studentId || {}
                     return (
                      <tr key={rec._id} className="hover:bg-indigo-50/30">
                        <td className="px-4 py-2 font-medium text-gray-700">{st.rollNumber || '-'}</td>
                        <td className="px-4 py-2 text-gray-900">{st.firstName} {st.lastName}</td>
                        <td className="px-4 py-2">
                            {rec.absent ? (
                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">Absent</span>
                            ) : (
                                <span className="font-semibold text-indigo-700">{rec.marks}</span>
                            )}
                        </td>
                        <td className="px-4 py-2 text-gray-500">{rec.outOf}</td>
                        <td className="px-4 py-2 text-gray-500 text-xs italic truncate max-w-xs">{rec.remarks}</td>
                      </tr>
                     )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {selectedExamIndex === '' && !loadingSummary && summary.length > 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            Select an exam above to view student-wise results.
          </div>
      )}
    
      {selectedExamIndex === '' && !loadingSummary && summary.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            No exams recorded for this class yet.
          </div>
      )}
    </div>
  )
}
