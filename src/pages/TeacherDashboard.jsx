import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../utils/api'
import { User, BookOpen, ClipboardList, CalendarDays, Users, BarChart2 } from 'lucide-react'

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState(null)
  const [assignedClass, setAssignedClass] = useState(null)
  const [teachingClasses, setTeachingClasses] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          API.get('/teacher/me'),
          API.get('/teacher/assigned-class'),
        ])
        setTeacher(pRes.data)
        setAssignedClass(cRes.data || null)
        // teachingClasses loaded in separate effect
      } catch (err) {
        console.error('Error loading teacher data', err?.response?.data || err.message)
      }
    }
    load()
  }, [])

  useEffect(() => {
    const loadTeaching = async () => {
      try {
        const res = await API.get('/teacher/teaching-classes')
        setTeachingClasses(res.data || [])
      } catch (err) {
        console.error('Error loading teaching classes', err?.response?.data || err.message)
      }
    }
    loadTeaching()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <User className="w-7 h-7 text-indigo-600" />
              Teacher Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              {teacher
                ? `Welcome, ${teacher.firstName} ${teacher.lastName}`
                : 'Loading your profile...'}
            </p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* My Roles Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-indigo-600" /> My Roles
            </h4>
            <div className="space-y-3">
              {/* Class Teacher Role */}
              {assignedClass && (
                <div className="p-3 bg-indigo-50 rounded border border-indigo-100 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <span className="font-medium text-indigo-900">
                    Class Teacher of Class {assignedClass.name}
                  </span>
                </div>
              )}
              
              {/* Subject Teacher Roles */}
              {teachingClasses.map(cls => (
                cls.subjects.map((sub, idx) => (
                  <div key={`${cls._id}-${idx}`} className="p-3 bg-gray-50 rounded border border-gray-100 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                    <span className="font-medium text-gray-800">
                      {sub.name} Teacher of Class {cls.name}
                    </span>
                  </div>
                ))
              ))}

              {!assignedClass && (!teachingClasses || teachingClasses.every(c => !c.subjects.length)) && (
                 <div className="text-sm text-gray-500 italic">No active roles assigned.</div>
              )}
            </div>
          </div>
          {/* Assigned Class Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-indigo-600" /> Assigned Class
            </h4>
            {assignedClass ? (
              <div>
                <div className="font-medium text-gray-900 text-lg mb-1">
                  {assignedClass.name}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Students: {assignedClass.students ? assignedClass.students.length : 0}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/teacher/class"
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    View Class
                  </Link>
                  <Link
                    to="/teacher/attendance"
                    className="px-4 py-2 rounded-lg border border-indigo-500 text-indigo-600 text-sm font-medium hover:bg-indigo-50 transition-all duration-200"
                  >
                    Manage Attendance
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic mt-2">
                No class assigned yet.
              </div>
            )}
          </div>

          {/* Teaching Tools Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-indigo-600" /> Teaching Tools
            </h4>
            <div className="flex flex-col gap-3">
              <Link
                to="/teacher/assignments"
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm font-semibold hover:shadow-md hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200"
              >
                <ClipboardList className="w-4 h-4" />
                Manage Assignments
              </Link>
              <Link
                to="/teacher/timetable"
                className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-300 text-gray-800 text-sm font-medium hover:bg-gray-50 transition-all duration-200"
              >
                <CalendarDays className="w-4 h-4 text-indigo-600" />
                Update Timetable
              </Link>
              <Link
                to="/teacher/progress"
                className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-300 text-gray-800 text-sm font-medium hover:bg-gray-50 transition-all duration-200"
              >
                <BarChart2 className="w-4 h-4 text-indigo-600" />
                Track Student Progress
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Summary Card */}
        {teacher && (
          <div className="mt-8 bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" /> Profile Summary
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <span className="font-medium text-gray-900">Name:</span>{' '}
                {teacher.firstName} {teacher.lastName}
              </div>
              <div>
                <span className="font-medium text-gray-900">Email:</span>{' '}
                {teacher.email}
              </div>

              <div>
                <span className="font-medium text-gray-900">Role:</span>{' '}
                {teacher.role || 'Teacher'}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
