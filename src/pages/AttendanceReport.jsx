import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { FileBarChart2, Calendar, GraduationCap } from 'lucide-react';

const AttendanceReport = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    if (!selectedClass || !startDate || !endDate) {
      toast.error('Please select all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await API.get(`/attendance/report/${selectedClass}`, {
        params: { startDate, endDate },
      });
      setReport(res.data);
    } catch (err) {
      toast.error('Error generating report');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileBarChart2 className="w-8 h-8 text-indigo-600" />
              Attendance Report
            </h1>
            <p className="text-gray-600 mt-1">
              Generate detailed attendance reports for any class within a specific date range.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleGenerateReport}
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 space-y-6 hover:shadow-lg transition-all duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Class Selection */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                Select Class
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                required
              >
                <option value="">Choose a class...</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Start Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={format(new Date(), 'yyyy-MM-dd')}
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                End Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                max={format(new Date(), 'yyyy-MM-dd')}
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating Report...
                </>
              ) : (
                'Generate Report'
              )}
            </button>
          </div>
        </form>

        {/* Report Table */}
        {report.length > 0 && (
          <div className="mt-10 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    {['Roll No', 'Name', 'Total Days', 'Present Days', 'Attendance %'].map(
                      (header, i) => (
                        <th
                          key={i}
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {report.map((record) => (
                    <tr
                      key={record.student._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {record.student.rollNo}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {record.student.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.totalDays}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.presentDays}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-indigo-600">
                        {record.percentage.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!report.length && !loading && (
          <div className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileBarChart2 className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Report Generated</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Select a class and date range above, then click “Generate Report” to view results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceReport;
