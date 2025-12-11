import React, { useEffect, useState } from 'react'
import API from '../../utils/api'

export default function DriverAttendance({ session = 'morning' }) {
  const [busInfo, setBusInfo] = useState(null)
  const [assignedBuses, setAssignedBuses] = useState([])
  const [selectedBusId, setSelectedBusId] = useState('')
  const [students, setStudents] = useState([]) // combined roster + status
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)

  useEffect(() => { loadRoster() }, [])

  // Reload attendance status when date, session or selected bus changes
  useEffect(() => {
    if ((busInfo && busInfo.busId) || selectedBusId) {
      loadAttendance();
      loadReport();
    }
  }, [date, session, busInfo?.busId, selectedBusId]); // Depend on ID to avoid deep object loop

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

      if (res && res.data) {
        // driver.me now returns { driver, buses }
        const buses = res.data.buses || (res.data.bus ? [res.data.bus] : [])
        setAssignedBuses(buses)
        if (buses.length === 1) {
          const bus = buses[0]
          setSelectedBusId(bus._id)
          const route = session === 'evening' ? bus.eveningRoute : bus.morningRoute
          const info = { busId: bus._id, number: bus.number, route };
          // NOTE: We don't manually populate students from route here anymore
          // We rely on /driver/attendance/students endpoint to get the correct list for the session
          setBusInfo(info)
        } else if (buses.length > 1) {
          setBusInfo(null)
          setStudents([])
        } else {
          setBusInfo(null)
          setStudents([])
        }
      }
    } catch (err) { console.error(err); }
  }

  async function loadAttendance() {
    const busIdToUse = selectedBusId || busInfo?.busId
    if (!busIdToUse) return;
    try {
      // First fetch the student list for this session/bus
      const listRes = await API.get('/driver/attendance/students', { params: { busId: busIdToUse, session } })
      const roster = listRes.data.students || []
      
      // Then fetch existing records for this date/session
      const res = await API.get('/driver/attendance', { params: { date, session, busId: busIdToUse } });
      const records = res.data.records || [];

      const mapped = roster.map(s => {
          const r = records.find(rec => String(rec.studentId) === String(s._id))
          return {
             studentId: s._id,
             name: `${s.firstName || ''} ${s.lastName || ''}`.trim(), 
             rollNo: s.rollNumber || '', 
             status: r ? r.status : 'present'
          }
      })
      setStudents(mapped)
    } catch (e) {
      console.error("Failed to load attendance", e);
    }
  }

  const toggleStatus = (id, status) => setStudents(prev => prev.map(s => s.studentId === id ? { ...s, status } : s))

  const submit = async () => {
    const busIdToUse = selectedBusId || busInfo?.busId
    if (!busIdToUse) return
    setLoading(true)
    try {
      const records = students.map(s => ({ studentId: s.studentId, status: s.status }))
      await API.post('/driver/attendance', { date, records, session, busId: busIdToUse }) // Include session and busId
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
      const busIdToUse = selectedBusId || busInfo?.busId
      const res = await API.get('/driver/attendance/report', { params: { startDate: date, endDate: date, session, busId: busIdToUse } })
      setReport(res.data)
    } catch (err) { console.error(err) }
  }

  // When driver selects a bus (if multiple assigned), load its route/students
  useEffect(() => {
    if (!selectedBusId) return
    const fetchBus = async () => {
      try {
        const res = await API.get(`/admin/buses/${selectedBusId}`)
        const bus = res.data
        const route = session === 'evening' ? bus.eveningRoute : bus.morningRoute
        const info = { busId: bus._id, number: bus.number, route }
        setBusInfo(info)
        // loadAttendance will be triggered by selectedBusId
      } catch (err) {
        console.error('Failed loading selected bus info', err)
      }
    }
    fetchBus()
  }, [selectedBusId, session])

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">Bus Attendance ({session.charAt(0).toUpperCase() + session.slice(1)})</h2>
        {!busInfo && assignedBuses.length <= 1 ? <div className="text-sm text-gray-600">Loading assigned bus...</div> : (
          <>
            {assignedBuses.length > 1 && (
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Bus</label>
                <select value={selectedBusId} onChange={e => setSelectedBusId(e.target.value)} className="px-3 py-2 border rounded w-full sm:w-64">
                  <option value="">-- Choose Bus --</option>
                  {assignedBuses.map(b => {
                      const rName = session === 'evening' ? (b.eveningRoute?.name) : (b.morningRoute?.name)
                      return <option key={b._id} value={b._id}>{b.number} {rName ? `— ${rName}` : ''}</option>
                  })}
                </select>
              </div>
            )}
        
            {(!assignedBuses.length || (assignedBuses.length === 1) || selectedBusId) && (
          <div>
            <div className="mb-3 text-sm">Bus: <span className="font-medium">{busInfo?.number || busInfo?.busId || (assignedBuses.find(b => b._id===selectedBusId)?.number)}</span> • Date: <input type="date" value={date} onChange={e => setDate(e.target.value)} className="ml-2 px-2 py-1 border rounded" /></div>
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
        </>
      )}
      </div>
    </main>
  )
}
