import React, { useEffect, useState } from 'react'
import API from '../../utils/api'

export default function DriverAttendance({ session = 'morning' }) {
  const [busInfo, setBusInfo] = useState(null)
  const [students, setStudents] = useState([]) // combined roster + status
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)

  useEffect(() => { loadRoster() }, [])

  // Reload attendance status when date, session or busInfo (roster) is ready
  useEffect(() => {
    if (busInfo && busInfo.busId) {
      loadAttendance();
      loadReport();
    }
  }, [date, session, busInfo?.busId]); // Depend on ID to avoid deep object loop

  async function loadRoster() {
    try {
      // Prefer richer driver->bus info which includes route and stops
      let res = null
      try {
        res = await API.get('/driver/me')
      } catch (e) {
        // fallback to older endpoint or error
        console.error("Failed to fetch driver info", e);
        return;
      }

      if (res && res.data && res.data.bus) {
        const bus = res.data.bus
        const info = { busId: bus._id, number: bus.number, route: res.data.route };
        setBusInfo(info)

        // flatten students from route stops if available
        const stops = (res.data.route && res.data.route.stops) ? res.data.route.stops : []
        const list = []
        for (const stop of stops) {
          for (const s of (stop.students || [])) {
            if (!list.find(x => String(x._id) === String(s._id))) list.push(s)
          }
        }
        // Initialize with 'present'
        const mapped = list.map(s => ({ studentId: s._id, name: `${s.firstName || ''} ${s.lastName || ''}`.trim(), rollNo: s.rollNumber || '', status: 'present' }))
        setStudents(mapped)
      } else {
        setBusInfo(null)
        setStudents([])
      }
    } catch (err) { console.error(err); }
  }

  async function loadAttendance() {
    if (!busInfo?.busId) return;
    try {
      // Fetch existing records for this date/session
      const res = await API.get('/driver/attendance', { params: { date, session } });
      const records = res.data.records || [];

      if (records.length > 0) {
        setStudents(prev => prev.map(s => {
          const r = records.find(rec => String(rec.studentId) === String(s.studentId));
          return r ? { ...s, status: r.status } : s;
        }));
      } else {
        // Reset to present if no records found for this new date
        setStudents(prev => prev.map(s => ({ ...s, status: 'present' })));
      }
    } catch (e) {
      console.error("Failed to load attendance", e);
    }
  }

  const toggleStatus = (id, status) => setStudents(prev => prev.map(s => s.studentId === id ? { ...s, status } : s))

  const submit = async () => {
    if (!busInfo) return
    setLoading(true)
    try {
      const records = students.map(s => ({ studentId: s.studentId, status: s.status }))
      await API.post('/driver/attendance', { date, records, session }) // Include session
      alert('Saved')
      loadReport()
    } catch (err) { alert(err?.response?.data?.message || err.message) }
    setLoading(false)
  }

  const markAll = (status) => setStudents(prev => prev.map(s => ({ ...s, status })))

  const presentCount = students.reduce((acc, s) => acc + (s.status === 'present' ? 1 : 0), 0)
  const absentCount = students.length - presentCount

  const loadReport = async () => {
    try {
      const res = await API.get('/driver/attendance/report', { params: { startDate: date, endDate: date, session } })
      setReport(res.data)
    } catch (err) { console.error(err) }
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">Bus Attendance ({session.charAt(0).toUpperCase() + session.slice(1)})</h2>
        {!busInfo ? <div className="text-sm text-gray-600">Loading assigned bus...</div> : (
          <div>
            <div className="mb-3 text-sm">Bus: <span className="font-medium">{busInfo.number || busInfo.busId}</span> • Date: <input type="date" value={date} onChange={e => setDate(e.target.value)} className="ml-2 px-2 py-1 border rounded" /></div>
            <div className="mb-2 text-xs text-gray-500">Students: {students.length} • Present: {presentCount} • Absent: {absentCount}</div>
            <div className="mb-3 flex gap-2">
              <button onClick={() => markAll('present')} className="px-3 py-1 rounded bg-green-100 text-green-700 text-sm">Mark All Present</button>
              <button onClick={() => markAll('absent')} className="px-3 py-1 rounded bg-red-100 text-red-700 text-sm">Mark All Absent</button>
            </div>
            <div className="grid gap-2">
              {students.map(s => (
                <div key={s.studentId} className="flex items-center justify-between border rounded p-2">
                  <div>
                    <div className="font-medium">{s.name} <span className="text-xs text-gray-500">{s.rollNo ? `• ${s.rollNo}` : ''}</span></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleStatus(s.studentId, 'present')} className={`px-3 py-1 rounded ${s.status === 'present' ? 'bg-green-500 text-white' : 'bg-gray-100'}`}>Present</button>
                    <button onClick={() => toggleStatus(s.studentId, 'absent')} className={`px-3 py-1 rounded ${s.status === 'absent' ? 'bg-red-500 text-white' : 'bg-gray-100'}`}>Absent</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={submit} className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={loading}>{loading ? 'Saving...' : 'Save Attendance'}</button>
              <button onClick={loadReport} className="px-4 py-2 border rounded">Load Report</button>
            </div>
          </div>
        )}

        {report && (
          <div className="mt-6">
            <h4 className="font-medium">Report</h4>
            <div className="text-sm text-gray-600">Bus: {report.bus?.number}</div>
            <div className="mt-2 space-y-2">
              {report.report.map(r => (
                <div key={r.student._id} className="flex items-center justify-between border p-2 rounded">
                  <div>{r.student.name} <span className="text-xs text-gray-500">{r.student.rollNo}</span></div>
                  <div className="text-sm font-semibold">{r.presentDays}/{r.totalDays} ({r.percentage.toFixed(0)}%)</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
