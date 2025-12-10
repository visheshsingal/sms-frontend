import React, { useEffect, useState } from 'react'
import API from '../../utils/api'

export default function BusAttendance({ session = 'morning' }) {
  const [buses, setBuses] = useState([])
  const [selected, setSelected] = useState('')
  const [students, setStudents] = useState([])
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [records, setRecords] = useState([])
  const [report, setReport] = useState(null)

  useEffect(() => { loadBuses() }, [])

  const loadBuses = async () => {
    try {
      const res = await API.get('/admin/buses');
      let list = res.data || [];
      // If a session prop is provided, filter buses by route startTime roughly
      // morning => routes starting before 12:00, evening => routes starting at/after 12:00
      if (session) {
        list = list.filter(b => {
          const rt = b.route && b.route.startTime;
          if (!rt) return true; // keep if route missing
          const hour = parseInt(String(rt).split(':')[0], 10);
          if (session === 'morning') return hour < 12;
          if (session === 'evening') return hour >= 12;
          return true;
        })
      }
      setBuses(list)
    } catch (e) { console.error(e) }
  }

  const loadBus = async (id) => {
    setSelected(id)
    try {
      const res = await API.get(`/admin/buses/${id}`)
      const route = res.data.route
      const studentsList = []
      if (route && route.stops) for (const stop of route.stops) for (const s of (stop.students || [])) if (!studentsList.find(x => x._id === s._id)) studentsList.push(s)
      setStudents(studentsList)

      // Load existing attendance for this session
      const attRes = await API.get(`/admin/buses/${id}/attendance`, { params: { startDate: date, endDate: date, session } })
      if (attRes.data && attRes.data.length > 0 && attRes.data[0].records) {
        setRecords(attRes.data[0].records)
      } else {
        setRecords(studentsList.map(s => ({ studentId: s._id, status: 'present' })))
      }
    } catch (e) { console.error(e) }
  }

  // Reload when date or session changes if bus selected
  useEffect(() => {
    if (selected) loadBus(selected)
  }, [date, session])

  const toggleStatus = (studentId, status) => {
    setRecords(prev => prev.map(r => String(r.studentId) === String(studentId) ? { ...r, status } : r))
  }

  const markAll = (status) => {
    setRecords(prev => prev.map(r => ({ ...r, status })))
  }

  const submit = async () => {
    try {
      await API.post(`/admin/buses/${selected}/attendance`, { date, records, session })
      alert('Saved')
    } catch (e) { alert(e?.response?.data?.message || e.message) }
  }

  const loadReport = async () => {
    try { const res = await API.get(`/admin/buses/${selected}/attendance/report`, { params: { startDate: date, endDate: date, session } }); setReport(res.data) } catch (e) { console.error(e) }
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">Bus Attendance ({session.charAt(0).toUpperCase() + session.slice(1)})</h2>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-4">
          <select value={selected} onChange={e => loadBus(e.target.value)} className="w-full sm:w-auto px-3 py-2 border rounded">
            <option value="">Select a bus</option>
            {buses.map(b => <option key={b._id} value={b._id}>{b.number} {b.route && b.route.name ? `— ${b.route.name}` : ''}</option>)}
          </select>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full sm:w-auto px-3 py-2 border rounded" />
          <button onClick={loadReport} className="w-full sm:w-auto px-3 py-2 bg-indigo-600 text-white rounded">Load Report</button>
        </div>

        {students.length > 0 && (
          <div>
            <div className="grid gap-2">
              {students.map(s => (
                <div key={s._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border p-2 rounded">
                  <div className="mb-2 sm:mb-0">{s.firstName} {s.lastName} <div className="text-xs text-gray-500">{s.rollNumber}</div></div>
                  <div className="flex w-full sm:w-auto gap-2">
                    <button
                      onClick={() => toggleStatus(s._id, 'present')}
                      className={`flex-1 sm:flex-none text-center px-3 py-1 rounded font-medium text-sm ${records.find(r => String(r.studentId) === String(s._id))?.status === 'present' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
                      Present
                    </button>
                    <button
                      onClick={() => toggleStatus(s._id, 'absent')}
                      className={`flex-1 sm:flex-none text-center px-3 py-1 rounded font-medium text-sm ${records.find(r => String(r.studentId) === String(s._id))?.status === 'absent' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
                      Absent
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex flex-col sm:flex-row gap-2">
              <button onClick={() => markAll('present')} className="w-full sm:w-auto px-3 py-1 rounded bg-green-100 text-green-700 text-sm">Mark All Present</button>
              <button onClick={() => markAll('absent')} className="w-full sm:w-auto px-3 py-1 rounded bg-red-100 text-red-700 text-sm">Mark All Absent</button>
            </div>
            <div className="mt-4"><button onClick={submit} className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded">Save</button></div>
          </div>
        )}

        {report && (
          <div className="mt-6">
            <h4 className="font-medium">Report</h4>
            <div className="mt-2 space-y-2">
              {report.report.map(r => (
                <div key={r.student._id} className="flex items-center justify-between border p-2 rounded">
                  <div>{r.student.name}</div>
                  <div>{r.presentDays}/{r.totalDays} ({r.percentage.toFixed(0)}%)</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
