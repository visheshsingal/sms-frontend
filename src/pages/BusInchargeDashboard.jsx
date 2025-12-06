import React, { useEffect, useState } from 'react'
import API from '../utils/api'

export default function BusInchargeDashboard() {
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        API.get('/bus-incharge/me')
            .then(res => setProfile(res.data))
            .catch(err => console.error(err))
    }, [])

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Bus Incharge Dashboard</h1>
            {profile && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Welcome, {profile.firstName} {profile.lastName}</h2>
                    <p className="text-gray-500">{profile.email}</p>
                    <p className="text-gray-500">{profile.phone}</p>
                </div>
            )}
        </div>
    )
}
