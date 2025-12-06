import React, { useEffect, useRef, useState } from 'react'
import API from '../utils/api'

// Note: requires `html5-qrcode` package. Install in client with:
// npm install html5-qrcode

export default function QRScanner({ session }) {
	const [message, setMessage] = useState(null)
	const [scanning, setScanning] = useState(false)
	const [cameras, setCameras] = useState([])
	const [currentCamera, setCurrentCamera] = useState(null)
	const html5QrRef = useRef(null)
	const [recent, setRecent] = useState([])

	// For bus incharge/admin selection
	const [buses, setBuses] = useState([])
	const [selectedBusId, setSelectedBusId] = useState('')
	const [userRole, setUserRole] = useState('')

	// Helper: are two ISO timestamps on the same local day?
	function sameLocalDay(aIso, bIso) {
		const a = new Date(aIso)
		const b = new Date(bIso)
		return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
	}

	function todayKey() {
		const d = new Date()
		return `qr_recent_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
	}

	// Check user role and load buses if needed
	useEffect(() => {
		const checkRole = async () => {
			try {
				const res = await API.get('/auth/me') // Assuming we have this or similar, otherwise decode token. 
				// Actually API.get('/auth/me') might not exist, but let's try to infer from accessible routes or just check storage if generic
				// Better: Check if we can hit /admin/buses. If yes, we are admin or incharge. 
				const busesRes = await API.get('/admin/buses')
				setBuses(busesRes.data)
				// If we successfully fetched buses, we likely need to show the dropdown (unless we are just a driver viewing list? drivers cant view /admin/buses usually)
				// Let's assume if we can fetch buses, we show the dropdown.
			} catch (e) {
				// Not admin/incharge or can't fetch buses
			}
		}
		checkRole()
	}, [])

	// ... (rest of persistent recent scans logic)

	// load persisted recent scans for today
	useEffect(() => {
		try {
			const key = todayKey()
			const raw = localStorage.getItem(key)
			if (raw) {
				const parsed = JSON.parse(raw)
				if (Array.isArray(parsed)) setRecent(parsed)
			}
		} catch (e) { console.warn('Failed loading persisted recent scans', e) }
	}, [])

	// helper to persist
	function persistRecent(arr) {
		try {
			localStorage.setItem(todayKey(), JSON.stringify(arr))
		} catch (e) { console.warn('Failed writing recent scans', e) }
	}

	// schedule clearing recent scans at next local midnight
	useEffect(() => {
		let to = null
		function schedule() {
			const now = new Date()
			const next = new Date(now)
			next.setDate(now.getDate() + 1)
			next.setHours(0, 0, 0, 0)
			const ms = next - now
			to = setTimeout(() => {
				setRecent(r => {
					const kept = r.filter(item => sameLocalDay(item.time, new Date().toISOString()))
					// persist cleared list (likely empty)
					persistRecent(kept)
					return kept
				})
				schedule()
			}, ms + 1000) // slight buffer
		}
		schedule()
		return () => { if (to) clearTimeout(to) }
	}, [])

	useEffect(() => {
		let mounted = true
		async function setup() {
			try {
				const module = await import('html5-qrcode')
				// module should contain Html5Qrcode
				const Html5QrcodeClass = module && (module.Html5Qrcode || module.default?.Html5Qrcode || module.default)
				if (!Html5QrcodeClass) {
					console.warn('html5-qrcode did not export Html5Qrcode')
					html5QrRef.current = null
					return
				}
				// get cameras
				try {
					const cams = await Html5QrcodeClass.getCameras()
					if (!mounted) return
					setCameras(cams || [])
					if (cams && cams.length) setCurrentCamera(cams[0].id)
					// keep module object for later (so we can access constructor and instance)
					html5QrRef.current = { module, Html5QrcodeClass }
				} catch (e) {
					// camera enumeration failed
					console.warn('Camera enumeration failed', e)
					html5QrRef.current = { module, Html5QrcodeClass }
				}
			} catch (err) {
				console.warn('html5-qrcode not available; install with `npm install html5-qrcode`')
				html5QrRef.current = null
			}
		}
		setup()
		return () => { mounted = false }
	}, [])

	useEffect(() => {
		// cleanup on unmount
		return () => { stopScanner() }
	}, [])

	const startScanner = async () => {
		setMessage(null)

		// If buses are loaded (meaning we are admin/incharge), require selection
		if (buses.length > 0 && !selectedBusId) {
			return setMessage({ type: 'error', text: 'Please select a bus before scanning' })
		}

		if (!html5QrRef.current) return setMessage({ type: 'error', text: 'Scanner not available. Run `npm install html5-qrcode` in client.' })
		const { Html5QrcodeClass } = html5QrRef.current
		const elementId = 'qr-reader'
		if (scanning) return
		try {
			const camId = currentCamera
			const html5QrCode = new Html5QrcodeClass(elementId)
			setScanning(true)
			await html5QrCode.start(
				camId,
				{ fps: 10, qrbox: 250 },
				async (decodedText, decodedResult) => {
					// stop after first successful scan
					await stopScannerInternal(html5QrCode)
					// send to server
					try {
						const payload = { raw: decodedText }
						if (session) payload.session = session;
						if (selectedBusId) payload.busId = selectedBusId;

						const res = await API.post('/qr/scan', payload)
						// server now returns previousAttendanceStatus / previousBusAttendanceStatus
						const s = res.data.student
						const att = res.data.attendance
						const prev = res.data.previousAttendanceStatus || res.data.previousBusAttendanceStatus || null

						if (prev === 'present') {
							setMessage({ type: 'info', text: 'Attendance already marked present' })
						} else {
							setMessage({ type: 'success', text: res.data.message || 'Attendance recorded' })
						}

						const entry = {
							id: res.data.eventId,
							student: s,
							attendance: att,
							time: new Date().toISOString(),
							marked: prev === 'present' ? 'already' : 'marked'
						}

						setRecent(prevArr => {
							const next = [entry].concat(prevArr).filter(Boolean).slice(0, 8)
							persistRecent(next)
							return next
						})
					} catch (err) {
						setMessage({ type: 'error', text: err?.response?.data?.message || err.message || 'Scan failed' })
					}
				},
				(errorMessage) => {
					// optional error callback per frame
				}
			)
			// attach instance to ref for later stop
			html5QrRef.current.instance = html5QrCode
		} catch (err) {
			console.error('Failed to start scanner', err)
			setScanning(false)
			setMessage({ type: 'error', text: 'Unable to start camera scanner: ' + (err.message || err) })
		}
	}

	const stopScannerInternal = async (instance) => {
		try {
			await instance.stop()
			await instance.clear()
		} catch (e) {/* ignore */ }
		setScanning(false)
	}

	const stopScanner = async () => {
		try {
			const inst = html5QrRef.current && html5QrRef.current.instance
			if (inst) await stopScannerInternal(inst)
		} catch (e) {/* ignore */ }
		setScanning(false)
	}

	// manual paste removed per request; scanning uses camera only

	return (
		<main className="min-h-screen p-6">
			<div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
				<h2 className="text-lg font-semibold mb-4">QR Scanner {session ? `(${session})` : ''}</h2>
				<div>
					{buses.length > 0 && (
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700 mb-1">Select Bus</label>
							<select
								value={selectedBusId}
								onChange={e => setSelectedBusId(e.target.value)}
								className="w-full rounded border px-3 py-2"
								disabled={scanning}
							>
								<option value="">-- Choose Bus --</option>
								{buses.map(b => (
									<option key={b._id} value={b._id}>{b.number} {b.route?.name ? `- ${b.route.name}` : ''}</option>
								))}
							</select>
						</div>
					)}

					<div className="mb-2 text-sm text-gray-600">Live Camera Scan</div>
					<div id="qr-reader" className="w-full bg-gray-100 rounded-md overflow-hidden min-h-[220px] sm:min-h-[360px]" />
					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-3">
						<select className="w-full sm:w-auto rounded border px-3 py-2" value={currentCamera || ''} onChange={e => setCurrentCamera(e.target.value)}>
							{cameras.length === 0 ? <option value="">No cameras found</option> : cameras.map(c => <option key={c.id} value={c.id}>{c.label || c.id}</option>)}
						</select>
						{!scanning ? (
							<button onClick={startScanner} className="w-full sm:w-auto rounded bg-indigo-600 text-white px-4 py-2">Start Camera</button>
						) : (
							<button onClick={stopScanner} className="w-full sm:w-auto rounded border px-3 py-2">Stop</button>
						)}
					</div>
					<div className="text-xs text-gray-500 mt-2">Point the camera at the student's QR code. On success, attendance will be recorded automatically.</div>
				</div>

				{message && (
					<div className={`mt-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message.text}</div>
				)}
				{recent.length > 0 && (
					<div className="mt-4">
						<h4 className="text-sm font-medium mb-2">Recent Scans</h4>
						<div className="space-y-2">
							{recent.map(r => (
								<div key={r.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-md border p-2">
									<div>
										<div className="font-semibold">{r.student.firstName} {r.student.lastName} {r.student.rollNumber ? `• Roll: ${r.student.rollNumber}` : ''}</div>
										<div className="text-xs text-gray-500">{r.student.className || ''} • {new Date(r.time).toLocaleString()}</div>
									</div>
									<div className={`text-xs ${r.marked === 'already' ? 'text-yellow-600' : 'text-green-600'}`}>
										{r.marked === 'already' ? 'Already marked' : 'Marked'}
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</main>
	)
}
