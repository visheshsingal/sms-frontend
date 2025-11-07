import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { Megaphone, Trash2, PlusCircle } from 'lucide-react';

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState({ title: '', body: '', audience: 'all' });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const res = await API.get('/admin/notices');
      setNotices(res.data);
    } catch (err) {
      toast.error('Error loading notices');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const role = localStorage.getItem('role');
    if (role !== 'admin') return toast.error('Only admins can create notices');
    setLoading(true);
    try {
      await API.post('/admin/notices', form);
      setForm({ title: '', body: '', audience: 'all' });
      load();
      toast.success('Notice created');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error creating notice');
    }
    setLoading(false);
  };

  const del = async (id) => {
    if (!confirm('Delete notice?')) return;
    try {
      await API.delete(`/admin/notices/${id}`);
      load();
      toast.success('Notice deleted');
    } catch (err) {
      toast.error('Error deleting');
    }
  };

  const isAdmin = localStorage.getItem('role') === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Megaphone className="w-8 h-8 text-indigo-600" />
              Notices
            </h1>
            <p className="text-gray-600 mt-1">
              Create, manage, and view notices for your school community.
            </p>
          </div>
        </div>

        {/* Admin Create Notice Form */}
        {isAdmin && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-10 hover:shadow-lg transition-all duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-600" />
              Create New Notice
            </h3>
            <form onSubmit={submit} className="space-y-4">
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                placeholder="Notice Title"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                required
              />
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                placeholder="Write notice details..."
                rows={5}
                value={form.body}
                onChange={(e) =>
                  setForm((f) => ({ ...f, body: e.target.value }))
                }
                required
              />
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <select
                  value={form.audience}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, audience: e.target.value }))
                  }
                  className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all w-full sm:w-auto"
                >
                  <option value="all">All</option>
                  <option value="students">Students</option>
                  <option value="teachers">Teachers</option>
                  <option value="drivers">Drivers</option>
                  <option value="admins">Admins</option>
                </select>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-5 h-5" /> Save Notice
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notices List */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-lg transition-all duration-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Notices</h3>

          {notices.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No notices posted yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notices.map((n) => (
                <div
                  key={n._id}
                  className="py-5 hover:bg-gray-50 rounded-lg px-2 transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-lg text-gray-900">
                        {n.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(n.createdAt).toLocaleString()} •{' '}
                        {n.author?.username || '—'}
                      </div>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => del(n._id)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 text-sm font-medium transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    )}
                  </div>

                  <div className="mt-3 text-sm text-gray-800 leading-relaxed">
                    {n.body}
                  </div>

                  {n.audience && (
                    <div className="mt-2 text-xs font-medium text-indigo-600 bg-indigo-50 inline-block px-3 py-1 rounded-full">
                      Audience: {n.audience.charAt(0).toUpperCase() + n.audience.slice(1)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
