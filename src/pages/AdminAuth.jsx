import React, { useState } from 'react'
import API from '../utils/api'
import { useNavigate } from 'react-router-dom'
import { Shield, LogIn, UserPlus } from 'lucide-react'

export default function AdminAuth() {
  const [isSignup, setIsSignup] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const toggle = () => setIsSignup(s => !s)

  const submit = async e => {
    e.preventDefault()
    try {
      if (isSignup) {
        await API.post('/admin/signup', { username, password })
        alert('Admin account created. Please login.')
        setIsSignup(false)
      } else {
        const res = await API.post('/auth/login', { username, password })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('role', res.data.role)
        localStorage.setItem('username', res.data.username)
        navigate('/admin/dashboard')
      }
    } catch (err) {
      alert(err?.response?.data?.message || err.message)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white px-4">
      <div className="relative w-full max-w-md p-8 rounded-2xl shadow-2xl border border-slate-700 bg-slate-900/60 backdrop-blur-xl">
        
        {/* Header Icon and Title */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Shield className="w-12 h-12 text-indigo-500" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            {isSignup ? 'Create Admin Account' : 'Admin Login'}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {isSignup 
              ? 'Fill in your details to register as an Admin.'
              : 'Access your Admin Dashboard securely.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-slate-300 block mb-1">Username</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full px-4 py-2 rounded-lg bg-slate-800 text-slate-100 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-300"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300 block mb-1">Password</label>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-2 rounded-lg bg-slate-800 text-slate-100 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all duration-300"
            />
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="submit"
              className="flex items-center justify-center w-full sm:w-auto px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {isSignup ? (
                <>
                  <UserPlus className="w-5 h-5 mr-2" /> Sign Up
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" /> Login
                </>
              )}
            </button>

            <button
              type="button"
              onClick={toggle}
              className="text-sm text-slate-400 hover:text-indigo-400 transition-all duration-200"
            >
              {isSignup ? 'Already have an account? Login' : 'Create admin account'}
            </button>
          </div>
        </form>

        {/* Subtle footer */}
        <div className="mt-8 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} School Management Platform
        </div>
      </div>
    </main>
  )
}
