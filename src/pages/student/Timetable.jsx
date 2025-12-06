import React, { useEffect, useState } from 'react'
import { CalendarDays, UploadCloud, Link as LinkIcon, Loader2 } from 'lucide-react'
import API from '../../utils/api'

export default function StudentTimetable() {
  const [timetables, setTimetables] = useState([])
  const [loading, setLoading] = useState(false)
  const [month, setMonth] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const q = month ? `?month=${month}` : ''
        const res = await API.get(`/student/me/timetable${q}`)
        setTimetables(res.data)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    load()
  }, [month])

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-lg transition-all duration-300">
          {/* Header */}
          <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-2 mb-6">
            <CalendarDays className="w-6 h-6 text-indigo-600" />
            Class Timetable
          </h3>

          {/* Month filter */}
          <div className="mb-4 flex items-center gap-3">
            <label className="text-sm text-gray-700">Filter by month:</label>
            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="px-3 py-2 border rounded-md" />
            {month && <button onClick={() => setMonth('')} className="text-sm text-indigo-600 hover:underline">Clear</button>}
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              Loading timetables...
            </div>
          ) : timetables.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <UploadCloud className="w-10 h-10 text-indigo-500" />
              </div>
              <p className="text-gray-600 text-sm">No timetables available yet</p>
            </div>
          ) : (
            <div className="space-y-5">
              {timetables.map((t) => (
                <div
                  key={t._id}
                  className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      {t.date && (
                        <div className="text-sm font-semibold text-indigo-700 mb-2">
                          {new Date(t.date).toLocaleDateString()}
                        </div>
                      )}

                      {/* Timetable Content */}
                      {t.content && t.content.startsWith('http') ? (
                        <a
                          href={t.content}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          <LinkIcon className="w-4 h-4" />
                          Open Timetable Link
                        </a>
                      ) : (
                        t.content && <div className="font-medium text-gray-900">
                          {t.content}
                        </div>
                      )}

                      {t.imageUrl && (
                        <div className="mt-3">
                          <img src={t.imageUrl} alt="Timetable" className="max-w-sm rounded-lg shadow-sm mb-2" style={{ maxHeight: '300px', objectFit: 'contain' }} />
                          <button
                            onClick={async () => {
                              try {
                                const response = await fetch(t.imageUrl);
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                const filename = t.imageUrl.split('/').pop() || 'timetable_image';
                                link.setAttribute('download', filename);
                                document.body.appendChild(link);
                                link.click();
                                link.parentNode.removeChild(link);
                                window.URL.revokeObjectURL(url);
                              } catch (error) {
                                console.error('Download failed', error);
                                window.open(t.imageUrl, '_blank');
                              }
                            }}
                            className="text-sm text-indigo-600 hover:underline flex items-center gap-1 bg-transparent border-none cursor-pointer"
                          >
                            <LinkIcon className="w-4 h-4" />
                            View Full Image / Download
                          </button>
                        </div>
                      )}

                      {/* Uploaded By */}
                      {t.uploadedBy && t.uploadedBy.firstName && (
                        <div className="text-sm text-gray-600 mt-2">
                          Uploaded by:{' '}
                          <span className="font-medium text-gray-800">
                            {t.uploadedBy.firstName} {t.uploadedBy.lastName}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Upload Date */}
                    <div className="text-xs text-gray-500">
                      Uploaded: {new Date(t.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
