import React, { useEffect, useState } from 'react'
import API from '../utils/api'

export default function DriverProfile(){
  const [data, setData] = useState({ driver: null, bus: null })

  useEffect(()=>{
    const load = async ()=>{
      try{
        const res = await API.get('/driver/me')
        setData(res.data)
      }catch(err){ console.error(err) }
    }
    load()
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      {data.driver ? (
        <div className="p-4 bg-white rounded shadow">
          <div><strong>Name:</strong> {data.driver.firstName} {data.driver.lastName}</div>
          <div><strong>Email:</strong> {data.driver.email || '—'}</div>
          <div><strong>Phone:</strong> {data.driver.phone || '—'}</div>
          <div><strong>License:</strong> {data.driver.licenseNumber || '—'}</div>
        </div>
      ) : <div className="text-sm text-gray-500">No profile found</div>}
    </div>
  )
}
