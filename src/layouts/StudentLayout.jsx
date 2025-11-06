import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import StudentSidebar from '../components/StudentSidebar'
import API from '../utils/api'

export default function StudentLayout(){
  const [cls, setCls] = useState(null)

  useEffect(()=>{
    const load = async ()=>{
      try{
        const res = await API.get('/student/me')
        setCls(res.data.class)
      }catch(err){
        console.error(err)
        if (err?.response?.status === 401) navigate('/student')
      }
    }
    load()
  }, [])

  return (
    <div className="min-h-screen flex bg-gray-50">
      <StudentSidebar studentClass={cls} />
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  )
}
