
import React, { useEffect, useState } from 'react'
import API from '../utils/api'
import { Plus, Search, Trash2, Edit2, X, Save, UserCheck } from 'lucide-react'
import { toast } from 'react-toastify'

export default function BusIncharges() {
    const [incharges, setIncharges] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [editing, setEditing] = useState(null)

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        password: ''
    })

    useEffect(() => {
        fetchIncharges()
    }, [])

    const fetchIncharges = async () => {
        try {
            setLoading(true)
            const res = await API.get('/admin/bus-incharges')
            setIncharges(res.data)
        } catch (err) {
            toast.error('Failed to load bus incharges')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this bus incharge?')) return
        try {
            await API.delete(`/ admin / bus - incharges / ${id} `)
            toast.success('Bus Incharge removed')
            fetchIncharges()
        } catch (err) {
            toast.error('Failed to remove bus incharge')
        }
    }

    const onEdit = (incharge) => {
        setEditing(incharge)
        setFormData({
            firstName: incharge.firstName,
            lastName: incharge.lastName,
            email: incharge.email || '',
            phone: incharge.phone || '',
            address: incharge.address || '',
            password: '' // password blank on edit means no change
        })
    }

    const cancelEdit = () => {
        setEditing(null)
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            password: ''
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editing) {
                // update
                await API.put(`/ admin / bus - incharges / ${editing._id} `, formData)
                toast.success('Bus Incharge updated')
                setEditing(null)
            } else {
                // create
                await API.post('/admin/bus-incharges', formData)
                toast.success('Bus Incharge created')
            }
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                address: '',
                password: ''
            })
            fetchIncharges()
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Operation failed')
        }
    }

    const filtered = incharges.filter(b =>
        b.firstName.toLowerCase().includes(search.toLowerCase()) ||
        b.lastName.toLowerCase().includes(search.toLowerCase()) ||
        (b.email && b.email.toLowerCase().includes(search.toLowerCase())) ||
        (b.phone && b.phone.includes(search))
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
            <div className="mx-auto max-w-6xl space-y-8">

                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <UserCheck className="w-8 h-8 text-indigo-600" /> Bus Incharges
                        </h1>
                        <p className="text-gray-600 mt-1">Manage bus transport supervisors</p>
                    </div>
                </div>

                {/* Form Section (Inline) */}
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg sm:p-8">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">{editing ? 'Edit Incharge' : 'Add New Incharge'}</h2>
                        {editing && (
                            <button onClick={cancelEdit} className="flex items-center gap-1 rounded bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                                <X className="h-4 w-4" /> Cancel
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <input required placeholder="First Name" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="rounded border px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200" />

                        <input required placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="rounded border px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200" />

                        <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="rounded border px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200" />

                        <input placeholder="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="rounded border px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200" />

                        <input placeholder="Address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="rounded border px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200" />

                        {/* Password - required for new, optional for edit */}
                        <input required={!editing} type="password" placeholder={editing ? "Password (leave blank to keep)" : "Password (required)"} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="rounded border px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-200" />

                        <div className="md:col-span-2 lg:col-span-3 flex justify-end">
                            <button type="submit" className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-white shadow-sm transition hover:bg-indigo-700">
                                <Save className="inline h-4 w-4" /> {editing ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* List Section */}
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg sm:p-8">
                    <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <h3 className="text-xl font-semibold">All Incharges</h3>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-12 text-gray-500">Loading...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filtered.map(incharge => (
                                <div key={incharge._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg border border-indigo-200">
                                                {incharge.firstName[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{incharge.firstName} {incharge.lastName}</h3>
                                                <p className="text-sm text-gray-500">{incharge.email || 'No email'}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{incharge.address || 'No address'}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => onEdit(incharge)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition border border-indigo-200">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(incharge._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition border border-red-200">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filtered.length === 0 && (
                                <div className="col-span-full text-center py-12 text-gray-500">
                                    No bus incharges found.
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

