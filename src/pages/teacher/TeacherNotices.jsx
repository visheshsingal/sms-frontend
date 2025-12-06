import React, { useEffect, useState } from 'react'
import API from '../../utils/api'
import { toast } from 'react-toastify'
import { Megaphone, PlusCircle, User, Users, School } from 'lucide-react'

export default function TeacherNotices() {
    const [notices, setNotices] = useState([])
    const [classes, setClasses] = useState([])
    const [students, setStudents] = useState([])
    const [creating, setCreating] = useState(false)

    // Form state
    const [form, setForm] = useState({ title: '', body: '', type: 'all', targetClass: '', targetStudent: '' })

    useEffect(() => {
        loadNotices()
        loadData()
    }, [])

    const loadNotices = async () => {
        try {
            const res = await API.get('/admin/notices')
            setNotices(res.data)
        } catch (e) { console.error(e) }
    }

    const loadData = async () => {
        try {
            const [cRes, sRes] = await Promise.all([
                API.get('/teacher/teaching-classes'),
                API.get('/admin/students')
            ])
            setClasses(cRes.data || [])
            setStudents(sRes.data || [])
        } catch (e) {
            console.error('Failed loading classes/students', e)
        }
    }

    const submit = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                title: form.title,
                body: form.body
            }
            if (form.type === 'class') {
                if (!form.targetClass) return toast.error('Select a class')
                payload.targetClass = form.targetClass
            } else if (form.type === 'student') {
                if (!form.targetStudent) return toast.error('Select a student')
                payload.targetStudent = form.targetStudent
            } else {
                // type 'all' -> broad cast to 'students' audience (handled by backend for teacher role)
            }

            await API.post('/admin/notices', payload)
            toast.success('Notice sent')
            setForm({ title: '', body: '', type: 'all', targetClass: '', targetStudent: '' })
            setCreating(false)
            loadNotices()
        } catch (e) {
            toast.error(e?.response?.data?.message || 'Error sending notice')
        }
    }

    return (
        <div className="p-6 max-w-5xl mx-auto min-h-screen">
            <div className="flex bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Megaphone className="text-indigo-600" /> Notices
                    </h1>
                    <p className="text-gray-500">Send announcements to students or classes</p>
                </div>
                <button
                    onClick={() => setCreating(!creating)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                >
                    <PlusCircle size={20} /> New Notice
                </button>
            </div>

            {creating && (
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="font-semibold text-lg mb-4 text-gray-800">Compose Notice</h3>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <input
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none"
                                placeholder="Notice Title"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <textarea
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none"
                                placeholder="Message content..."
                                rows={4}
                                value={form.body}
                                onChange={e => setForm({ ...form, body: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-lg"
                                    value={form.type}
                                    onChange={e => setForm({ ...form, type: e.target.value })}
                                >
                                    <option value="all">All Students</option>
                                    <option value="class">Specific Class</option>
                                    <option value="student">Specific Student</option>
                                </select>
                            </div>

                            {form.type === 'class' && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={form.targetClass}
                                        onChange={e => setForm({ ...form, targetClass: e.target.value })}
                                    >
                                        <option value="">-- Choose Class --</option>
                                        {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                            )}

                            {form.type === 'student' && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={form.targetStudent}
                                        onChange={e => setForm({ ...form, targetStudent: e.target.value })}
                                    >
                                        <option value="">-- Choose Student --</option>
                                        {students.map(s => <option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.class?.name || 'No Class'})</option>)}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setCreating(false)}
                                className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm"
                            >
                                Send Notice
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4">
                {notices.map(n => (
                    <div key={n._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-lg text-gray-900">{n.title}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                                    <span>•</span>
                                    <span>By {n.author?.username || 'Unknown'}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                                        {n.targetStudent ? <><User size={12} /> {n.targetStudent.firstName} {n.targetStudent.lastName}</> :
                                            n.targetClass ? <><Users size={12} /> Class {n.targetClass.name}</> :
                                                <><School size={12} /> All Students</>}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{n.body}</p>
                    </div>
                ))}
                {notices.length === 0 && <div className="text-center text-gray-500 py-10">No notices found</div>}
            </div>
        </div>
    )
}
