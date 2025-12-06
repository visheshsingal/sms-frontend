import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [unreadNotices, setUnreadNotices] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Load unread count
    const loadUnread = async () => {
        try {
            const res = await API.get('/notices/unread');
            setUnreadCount(res.data.count);
            setUnreadNotices(res.data.notices);
        } catch (err) {
            console.error('Failed to load unread notices', err);
        }
    };

    useEffect(() => {
        loadUnread();
        // Optional: Poll every 60s
        const interval = setInterval(loadUnread, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkRead = async (noticeId) => {
        try {
            await API.post(`/notices/${noticeId}/read`);
            // Update local state by filtering out the read notice
            setUnreadCount((prev) => Math.max(0, prev - 1));
            setUnreadNotices((prev) => prev.filter((n) => n._id !== noticeId));
        } catch (err) {
            console.error('Failed to mark notice as read', err);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative inline-flex items-center justify-center p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-600 rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-700 flex justify-between items-center">
                        <span>Notifications</span>
                        {unreadCount > 0 && <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">{unreadCount} New</span>}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {unreadNotices.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500">
                                No new notifications
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {unreadNotices.map((notice) => (
                                    <div
                                        key={notice._id}
                                        onClick={() => handleMarkRead(notice._id)}
                                        className="p-3 hover:bg-indigo-50 cursor-pointer transition-colors"
                                    >
                                        <div className="text-sm font-medium text-gray-800 mb-1 line-clamp-1">{notice.title}</div>
                                        <div className="text-xs text-gray-500 line-clamp-2">{notice.body}</div>
                                        <div className="text-[10px] text-gray-400 mt-2 text-right">Click to mark read</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
