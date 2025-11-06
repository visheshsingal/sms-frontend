import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { Calendar, Users, Check, X, Save, GraduationCap } from 'lucide-react';

const Attendance = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await API.get('/admin/classes');
        setClasses(res.data);
      } catch (err) {
        toast.error('Error fetching classes');
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) return;
      setLoadingStudents(true);
      try {
        const res = await API.get(`/admin/classes/${selectedClass}`);
        if (res.data.students) {
          const mapped = res.data.students.map(s => ({
            ...s,
            _id: s._id,
            rollNo: s.rollNumber,
            name: `${s.firstName || ''} ${s.lastName || ''}`.trim()
          }));
          setStudents(mapped);
          setAttendanceRecords(
            mapped.map(student => ({
              studentId: student._id,
              status: 'present'
            }))
          );
        }
      } catch (err) {
        toast.error('Error fetching students');
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, [selectedClass]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords(prev =>
      prev.map(record =>
        record.studentId === studentId ? { ...record, status } : record
      )
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedClass || !date) {
      toast.error('Please select class and date');
      return;
    }

    setLoading(true);
    try {
      await API.post('/attendance', {
        classId: selectedClass,
        date,
        records: attendanceRecords
      });
      toast.success('Attendance marked successfully');
      setSelectedClass('');
      setStudents([]);
      setAttendanceRecords([]);
      setDate(format(new Date(), 'yyyy-MM-dd'));
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error marking attendance');
    }
    setLoading(false);
  };

  const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
  const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;
  const attendancePercentage =
    students.length > 0 ? Math.round((presentCount / students.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
            <p className="text-gray-600 mt-1">
              Select a class and mark attendance for the selected date.
            </p>
          </div>
          {loading && (
            <div className="flex items-center gap-2 bg-indigo-50 text-indigo-600 text-sm px-4 py-2 rounded-full shadow-sm">
              <Save className="w-4 h-4 animate-spin" />
              Saving...
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Class Selector */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                Select Class
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-gray-900 bg-white"
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                required
              >
                <option value="">Choose a class...</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Select Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-gray-900 bg-white"
                value={date}
                onChange={e => setDate(e.target.value)}
                max={format(new Date(), 'yyyy-MM-dd')}
                required
              />
            </div>
          </div>

          {/* Summary Cards */}
          {students.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Students', icon: Users, value: students.length, color: 'blue' },
                { label: 'Present', icon: Check, value: presentCount, color: 'green' },
                { label: 'Absent', icon: X, value: absentCount, color: 'red' },
                { label: 'Attendance %', icon: null, value: `${attendancePercentage}%`, color: 'purple' }
              ].map((card, idx) => (
                <div
                  key={idx}
                  className={`bg-gradient-to-br from-${card.color}-500 to-${card.color}-600 rounded-xl text-white p-5 shadow-md hover:shadow-lg transition-transform duration-200 hover:-translate-y-1`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium opacity-90">{card.label}</p>
                    {card.icon && <card.icon className="w-5 h-5 opacity-80" />}
                  </div>
                  <p className="text-3xl font-bold">{card.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Loading State */}
          {loadingStudents && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="inline-block w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading students...</p>
            </div>
          )}

          {/* Students Table */}
          {students.length > 0 && !loadingStudents && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    {['Roll No', 'Student Name', 'Attendance Status'].map((h, i) => (
                      <th
                        key={i}
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map(student => {
                    const status =
                      attendanceRecords.find(r => r.studentId === student._id)?.status || 'present';
                    return (
                      <tr key={student._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center w-8 h-8 bg-indigo-50 rounded-full">
                            <span className="text-xs font-semibold text-indigo-600">
                              {student.rollNo}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {student.name}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            {['present', 'absent'].map(type => {
                              const isActive = status === type;
                              const color =
                                type === 'present'
                                  ? 'green'
                                  : 'red';
                              return (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => handleStatusChange(student._id, type)}
                                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm border-2 transition-all duration-200 ${
                                    isActive
                                      ? `bg-${color}-100 text-${color}-700 border-${color}-500`
                                      : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200'
                                  }`}
                                >
                                  {type === 'present' ? (
                                    <Check className="w-4 h-4" />
                                  ) : (
                                    <X className="w-4 h-4" />
                                  )}
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Submit Button */}
          {students.length > 0 && !loadingStudents && (
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving Attendance...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Attendance
                  </>
                )}
              </button>
            </div>
          )}

          {/* Empty State */}
          {!selectedClass && !loadingStudents && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Select a Class</h3>
              <p className="text-gray-600 max-w-sm mx-auto">
                Choose a class from the dropdown to view students and mark attendance.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Attendance;
