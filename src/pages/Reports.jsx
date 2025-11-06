import React, { useEffect, useState } from 'react'
import API from '../utils/api'
import { GraduationCap, Users, IndianRupee, BarChart3 } from 'lucide-react'

export default function Reports() {
  const [data, setData] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await API.get('/admin/reports/overview')
        setData(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [])

  const formatNumber = (num) => (num ? num.toLocaleString('en-IN') : '—')

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <div
              className={`p-2 rounded-lg ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}
            >
              <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
            </div>
          )}
          <p className="text-sm font-medium text-gray-500">{title}</p>
        </div>
      </div>
      <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-indigo-600" />
              Reports Overview
            </h1>
            <p className="text-gray-600 mt-1">
              Visual summary of institutional data and performance metrics.
            </p>
          </div>
        </div>

        {/* Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="Total Students"
            value={formatNumber(data?.students)}
            icon={GraduationCap}
            color="bg-indigo-500"
          />
          <StatCard
            title="Total Teachers"
            value={formatNumber(data?.teachers)}
            icon={Users}
            color="bg-purple-500"
          />
          <StatCard
            title="Total Fees Collected"
            value={`₹${formatNumber(data?.totalFees)}`}
            icon={IndianRupee}
            color="bg-green-500"
          />
        </div>

        {/* Analytics Section */}
        {data?.analytics && data.analytics.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-lg transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 border-l-4 border-indigo-500 pl-3">
              Analytics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.analytics.map((a, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl shadow-sm p-6 hover:shadow-md hover:border-indigo-100 transition-all duration-300"
                >
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    {a.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{a.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading or Empty State */}
        {!data && (
          <div className="mt-10 bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Loading Reports...
            </h3>
            <p className="text-gray-600 text-sm">
              Fetching latest metrics and analytics data.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
