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
import Drivers from './pages/Drivers'
import Buses from './pages/Buses'
import Classes from './pages/Classes'
import BusAttendance from './pages/admin/BusAttendance'
import RoutesPage from './pages/Routes'
import StudentAuth from './pages/StudentAuth'
import DriverAuth from './pages/DriverAuth'
import DriverLayout from './layouts/DriverLayout'
import DriverDashboard from './pages/DriverDashboard'
import DriverProfile from './pages/DriverProfile'
import DriverRoute from './pages/DriverRoute'
import LiveTrackingDriver from './pages/LiveTrackingDriver'
import DriverAttendance from './pages/driver/DriverAttendance'
import BusIncharges from './pages/BusIncharges'
import BusInchargeAuth from './pages/BusInchargeAuth'
import BusInchargeLayout from './layouts/BusInchargeLayout'
import BusInchargeDashboard from './pages/BusInchargeDashboard'
import StudentLayout from './layouts/StudentLayout'
import StudentProfile from './pages/student/Profile'
import MyQR from './pages/student/MyQR'
import StudentTransport from './pages/student/Transport'
import StudentAttendanceReport from './pages/student/AttendanceReport'
import StudentProgress from './pages/student/Progress'
import StudentLeaves from './pages/student/Leaves'
import StudentAssignments from './pages/student/Assignments'
import StudentTimetable from './pages/student/Timetable'
import Notices from './pages/Notices.jsx'
import LiveTrackingAdmin from './pages/LiveTrackingAdmin'
import LiveTrackingStudent from './pages/LiveTrackingStudent'
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
import QRScanner from './pages/QRScanner'
import Attendance from './pages/Attendance.jsx'
import AttendanceReport from './pages/AttendanceReport.jsx'
import TeacherNotices from './pages/teacher/TeacherNotices'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-uiText">
      <ToastContainer />
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/admin' element={<AdminAuth />} />

        {/* admin panel routes (protected on server) */}
        <Route path='/admin/*' element={<AdminLayout />}>
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='students' element={<Students />} />
          <Route path='teachers' element={<Teachers />} />
          <Route path='drivers' element={<Drivers />} />
          <Route path='classes' element={<Classes />} />
          <Route path='buses' element={<Buses />} />
          <Route path='bus-incharges' element={<BusIncharges />} />
          <Route path='routes' element={<RoutesPage />} />
          <Route path='bus-attendance' element={<BusAttendance />} />
          {/* Finance section temporarily hidden — comment out for now. Can re-enable later by restoring the import and this route. */}
          {/* <Route path='finance' element={<Finance/>} /> */}
          <Route path='attendance' element={<Attendance />} />
          <Route path='attendance-report' element={<AttendanceReport />} />
          <Route path='notices' element={<Notices />} />
          <Route path='live' element={<LiveTrackingAdmin />} />
        </Route>

        <Route path='/student' element={<StudentAuth />} />
        <Route path='/driver' element={<DriverAuth />} />
        <Route path='/driver/*' element={<DriverLayout />}>
          <Route path='dashboard' element={<DriverDashboard />} />
          <Route path='live' element={<LiveTrackingDriver />} />
          <Route path='profile' element={<DriverProfile />} />
          <Route path='route' element={<DriverRoute />} />
          <Route path='qr-scanner' element={<QRScanner session="morning" />} />
          <Route path='attendance' element={<DriverAttendance session="morning" />} />
          <Route path='attendance/morning' element={<DriverAttendance session="morning" />} />
          <Route path='attendance/evening' element={<DriverAttendance session="evening" />} />
          <Route path='qr-scanner/morning' element={<QRScanner session="morning" />} />
          <Route path='qr-scanner/evening' element={<QRScanner session="evening" />} />
          <Route path='notices' element={<Notices />} />
        </Route>
        <Route path='/student/*' element={<StudentLayout />}>
          <Route path='profile' element={<StudentProfile />} />
          <Route path='qr' element={<MyQR />} />
          <Route path='live' element={<LiveTrackingStudent />} />
          <Route path='transport' element={<StudentTransport />} />
          <Route path='attendance-report' element={<StudentAttendanceReport />} />
          <Route path='progress' element={<StudentProgress />} />
          <Route path='leaves' element={<StudentLeaves />} />
          <Route path='assignments' element={<StudentAssignments />} />
          <Route path='timetable' element={<StudentTimetable />} />
          <Route path='notices/school' element={<Notices source="admin" />} />
          <Route path='notices/class' element={<Notices source="teacher" />} />
          {/* <Route path='notices' element={<Notices />} /> */}
        </Route>
        <Route path='/teacher' element={<TeacherAuth />} />
        <Route path='/teacher/*' element={<TeacherLayout />}>
          <Route path='dashboard' element={<TeacherDashboard />} />
          <Route path='class' element={<TeacherClass />} />
          <Route path='attendance' element={<TeacherAttendance />} />
          <Route path='assignments' element={<TeacherAssignments />} />
          <Route path='timetable' element={<TeacherTimetable />} />
          <Route path='notices/school' element={<Notices source="admin" />} />
          <Route path='notices/my' element={<TeacherNotices />} />
          {/* <Route path='notices' element={<TeacherNotices />} /> */}
          <Route path='progress' element={<TeacherProgress />} />
          <Route path='qr-scanner' element={<QRScanner />} />
          <Route path='leaves' element={<TeacherLeaves />} />
          <Route path='progress/:studentId/report' element={<StudentProgressReport />} />
        </Route>
        <Route path='/bus-incharge' element={<BusInchargeAuth />} />
        <Route path='/bus-incharge/*' element={<BusInchargeLayout />}>
          <Route path='dashboard' element={<BusInchargeDashboard />} />
          <Route path='buses' element={<Buses />} />
          <Route path='routes' element={<RoutesPage />} />
          {/* <Route path='bus-attendance' element={<BusAttendance />} /> */}
          <Route path='attendance/morning' element={<BusAttendance session="morning" />} />
          <Route path='attendance/evening' element={<BusAttendance session="evening" />} />
          <Route path='scan/morning' element={<QRScanner session="morning" />} />
          <Route path='scan/evening' element={<QRScanner session="evening" />} />
          <Route path='live' element={<LiveTrackingAdmin />} />
        </Route>
        <Route path='/notices' element={<Notices />} />
      </Routes>
    </div>
  )
}
