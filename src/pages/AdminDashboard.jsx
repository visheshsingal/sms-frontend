import React, { useEffect, useState } from 'react'
import { Users, GraduationCap, IndianRupee, Activity } from 'lucide-react'
import API from '../utils/api'

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load(isInitial = true) {
      try {
        if (isInitial) setIsLoading(true)
        else setIsRefreshing(true)

        const res = await API.get('/admin/reports/overview')
        if (!mounted) return
        setOverview(res.data)
      } catch (err) {
        console.error('Overview load error', err)
      } finally {
        if (mounted) {
          setIsLoading(false)
          setIsRefreshing(false)
        }
      }
    }
    load(true)
    const id = setInterval(() => load(false), 5001)
    return () => {
      mounted = false
      clearInterval(id)
    }
  }, [])

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '—'
    return num.toLocaleString('en-IN')
  }

  const StatCard = ({ icon: Icon, label, value, iconColor, isMain = false }) => (
    <div className={`relative overflow-hidden rounded-2xl bg-white p-6 border border-gray-100 shadow-md hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-2">{label}</p>
          <p className={`font-bold text-gray-900 ${isMain ? 'text-3xl' : 'text-2xl'}`}>
            {isLoading ? (
              <span className="inline-block w-24 h-8 bg-gray-200 rounded animate-pulse"></span>
            ) : value}
          </p>
        </div>
        <div className={`${iconColor} bg-opacity-10 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${iconColor.replace('bg-', 'text-')}`} />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-indigo-200 via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
    </div>
  )

  const AnalyticsCard = ({ title, value }) => (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg hover:border-indigo-100 transition-all duration-300 p-6 border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
      </div>
      <p className="text-2xl font-bold text-gray-900">
        {isLoading ? (
          <span className="inline-block w-20 h-7 bg-gray-200 rounded animate-pulse"></span>
        ) : value}
      </p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
            <p className="text-gray-600 text-sm">Overview of your institution’s performance</p>
          </div>
          {isRefreshing && (
            <div className="flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full mt-4 sm:mt-0">
              <Activity className="w-4 h-4 animate-spin" />
              <span>Updating...</span>
            </div>
          )}
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            icon={GraduationCap}
            label="Total Students"
            value={formatNumber(overview?.students)}
            iconColor="bg-indigo-500"
            isMain
          />
          <StatCard
            icon={Users}
            label="Total Teachers"
            value={formatNumber(overview?.teachers)}
            iconColor="bg-purple-500"
            isMain
          />
          <StatCard
            icon={IndianRupee}
            label="Total Fees Collected"
            value={overview ? `₹${formatNumber(overview.totalFees)}` : '—'}
            iconColor="bg-green-500"
            isMain
          />
        </div>

        {/* Analytics Section */}
        {(!isLoading || overview) && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-5 border-l-4 border-indigo-500 pl-3">
              Analytics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(overview?.analytics || []).map((a, idx) => (
                <AnalyticsCard key={idx} title={a.title} value={a.value} />
              ))}
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && !overview && (
          <div>
            <div className="w-32 h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
                >
                  <div className="w-24 h-4 bg-gray-200 rounded mb-3 animate-pulse"></div>
                  <div className="w-32 h-7 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
