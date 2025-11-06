import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import AdminAuth from './pages/AdminAuth'
import AdminDashboard from './pages/AdminDashboard'
import AdminLayout from './layouts/AdminLayout'
import Students from './pages/Students'
import Teachers from './pages/Teachers'
import Finance from './pages/Finance'
import Classes from './pages/Classes'
import StudentAuth from './pages/StudentAuth'
import StudentLayout from './layouts/StudentLayout'
import StudentProfile from './pages/student/Profile'
import StudentAttendanceReport from './pages/student/AttendanceReport'
import StudentProgress from './pages/student/Progress'
import StudentLeaves from './pages/student/Leaves'
import StudentAssignments from './pages/student/Assignments'
import StudentTimetable from './pages/student/Timetable'
import Notices from './pages/Notices.jsx'
import TeacherAuth from './pages/TeacherAuth'
import TeacherDashboard from './pages/TeacherDashboard'
import TeacherLayout from './layouts/TeacherLayout'
import TeacherClass from './pages/teacher/TeacherClass'
import TeacherAttendance from './pages/teacher/TeacherAttendance'
import TeacherAssignments from './pages/teacher/TeacherAssignments'
import TeacherTimetable from './pages/teacher/TeacherTimetable'
import TeacherProgress from './pages/teacher/TeacherProgress'
import TeacherLeaves from './pages/teacher/TeacherLeaves'
import StudentProgressReport from './pages/teacher/StudentProgressReport'
import Attendance from './pages/Attendance.jsx'
import AttendanceReport from './pages/AttendanceReport.jsx'

export default function App(){
  return (
    <div className="min-h-screen bg-gray-50 text-uiText">
      <ToastContainer />
      <NavBar />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/admin' element={<AdminAuth/>} />

        {/* admin panel routes (protected on server) */}
        <Route path='/admin/*' element={<AdminLayout/>}>
          <Route path='dashboard' element={<AdminDashboard/>} />
          <Route path='students' element={<Students/>} />
          <Route path='teachers' element={<Teachers/>} />
          <Route path='classes' element={<Classes/>} />
          <Route path='finance' element={<Finance/>} />
          <Route path='attendance' element={<Attendance/>} />
          <Route path='attendance-report' element={<AttendanceReport/>} />
          <Route path='notices' element={<Notices/>} />
        </Route>

        <Route path='/student' element={<StudentAuth/>} />
        <Route path='/student/*' element={<StudentLayout/>}>
          <Route path='profile' element={<StudentProfile/>} />
          <Route path='attendance-report' element={<StudentAttendanceReport/>} />
          <Route path='progress' element={<StudentProgress/>} />
          <Route path='leaves' element={<StudentLeaves/>} />
          <Route path='assignments' element={<StudentAssignments/>} />
          <Route path='timetable' element={<StudentTimetable/>} />
          <Route path='notices' element={<Notices/>} />
        </Route>
        <Route path='/teacher' element={<TeacherAuth/>} />
        <Route path='/teacher/*' element={<TeacherLayout/>}>
          <Route path='dashboard' element={<TeacherDashboard/>} />
          <Route path='class' element={<TeacherClass/>} />
          <Route path='attendance' element={<TeacherAttendance/>} />
          <Route path='assignments' element={<TeacherAssignments/>} />
          <Route path='timetable' element={<TeacherTimetable/>} />
          <Route path='progress' element={<TeacherProgress/>} />
          <Route path='leaves' element={<TeacherLeaves/>} />
          <Route path='progress/:studentId/report' element={<StudentProgressReport/>} />
        </Route>
        <Route path='/notices' element={<Notices/>} />
      </Routes>
    </div>
  )
}
