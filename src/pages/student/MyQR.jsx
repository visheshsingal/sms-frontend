import React, { useEffect, useState } from 'react'
import API from '../../utils/api'
import { QrCode, Loader2 } from 'lucide-react'

function encodePayload(payload){
  try { return btoa(JSON.stringify(payload)); } catch(e) { return null }
}

export default function MyQR(){
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try{
        const res = await API.get('/student/me')
        setData(res.data)
      }catch(err){
        setError(err?.response?.data?.message || err.message || 'Failed to load')
      }finally{ setLoading(false) }
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
    </div>
  )

  if (error) return (
    <div className="p-6">
      <div className="text-red-600">{error}</div>
    </div>
  )

  const { student, class: cls } = data || {}
  if (!student) return <div className="p-6">No student data</div>

  const payload = { studentId: student._id, token: student.qrToken, rollNumber: student.rollNumber || null, className: cls ? cls.name : null }
  const raw = student.qrToken ? encodePayload(payload) : null
  const src = raw ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(raw)}&size=300x300` : null

  const generateQR = async () => {
    try{
      setLoading(true)
      // use generate-me which relies on the logged-in user mapping
      await API.post('/qr/generate-me')
      const res = await API.get('/student/me')
      setData(res.data)
    }catch(err){
      setError(err?.response?.data?.message || err.message || 'Failed to generate')
    }finally{ setLoading(false) }
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4"><QrCode className="w-5 h-5 text-indigo-600"/> My QR Code</h2>
        {student.qrToken ? (
          <div className="flex flex-col items-center gap-3">
            <img src={src} alt="Student QR" className="w-48 h-48 bg-white p-2 rounded-md" />
            <div className="text-sm text-gray-600">Show this QR to your teacher or driver for attendance scan.</div>
            <div className="text-xs text-gray-500">Roll: {student.rollNumber || '—'}{cls ? ` • Class: ${cls.name}` : ''}</div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="text-sm text-gray-600">Your QR is not generated yet.</div>
            <div className="flex gap-2">
              <button className="rounded bg-indigo-600 text-white px-3 py-1" onClick={generateQR} disabled={loading}>Generate QR</button>
              <button className="rounded border px-3 py-1" onClick={()=>window.alert('Contact admin if you cannot generate.')}>Contact admin</button>
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
          </div>
        )}
      </div>
    </main>
  )
}
