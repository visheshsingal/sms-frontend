import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, User, Users, BookOpen, LogOut, Bus, Menu, X, ChevronDown } from 'lucide-react'; // Added Bus icon for Driver link

// Assuming 'bg-primary' is a color like a dark blue (e.g., indigo/blue-700)
// and 'text-uiText' is a default dark text color (e.g., gray-800)

export default function NavBar(){
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const loginDropdownRef = useRef(null);
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    // Use a full page reload or a clearer state reset if necessary, 
    // but navigate('/') is usually fine for simple state
    navigate('/'); 
  }

  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username') || localStorage.getItem('email') || '';
  // Consider user logged in when a valid token exists. Username/email may be empty for some flows,
  // so rely on token presence to determine logged-in UI state.
  const isLoggedIn = !!token;

  // Custom Link Component for consistent styling (white navbar with indigo accents)
  const NavLink = ({ to, children, icon: Icon }) => (
    <Link
      to={to}
      className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-indigo-600 transition duration-150 px-2 py-2 rounded-lg hover:bg-indigo-50"
      onClick={() => setMobileOpen(false)}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </Link>
  );

  useEffect(() => {
    setMobileOpen(false);
    setLoginOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(event.target)) {
        setLoginOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    // White navbar with blue accents; reduce left padding so logo shifts slightly left
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="w-full px-0">
        <div className="flex items-center justify-between gap-4 py-3 pl-4 pr-4 md:pl-6 md:pr-8">

            {/* Logo and title - Use the sidebar blue for the logo, brand text dark on white bg */}
          <div className="flex items-center gap-3">
            {/* Using the same blue as sidebar for the logo icon */}
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow">SM</div>
            <Link to='/' className="text-xl font-bold text-gray-900 tracking-tight">School <span className="text-indigo-600">Management</span></Link>
          </div>

          {/* Right-aligned navigation and user actions */}
          <nav className="flex items-center gap-3">
            
            {/* Primary Navigation Links - Using the custom NavLink component */}
            <div className="hidden md:flex items-center gap-2">
              <NavLink to="/" icon={Home}>Home</NavLink>
                <NavLink to={role === 'admin' ? '/admin/dashboard' : '/admin'} icon={User}>Admin</NavLink>
                <NavLink to={role === 'student' ? '/student/profile' : '/student'} icon={Users}>Student</NavLink>
                <NavLink to={role === 'teacher' ? '/teacher/dashboard' : '/teacher'} icon={BookOpen}>Teacher</NavLink>
                <NavLink to={role === 'driver' ? '/driver/dashboard' : '/driver'} icon={Bus}>Driver</NavLink>
            </div>

            {/* Separator Line */}
            {isLoggedIn && <div className="hidden md:block w-px h-6 bg-gray-200" />}


            {/* User Info and Logout/Login Button */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                {/* User Info with a clean, pill-like background */}
                <div className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full hidden sm:block">
                  {username} (<span className="capitalize text-indigo-600">{role}</span>)
                </div>
                {/* Logout Button - prominent, primary action button */}
                <button 
                  onClick={logout} 
                  className="flex items-center gap-1 px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-150 shadow-md"
                >
                  <LogOut className="w-4 h-4"/>
                  Logout
                </button>
              </div>
            ) : (
                <div className="relative hidden md:block" ref={loginDropdownRef}>
                  <button
                    onClick={() => setLoginOpen((prev) => !prev)}
                    className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-150 shadow-md"
                    aria-expanded={loginOpen}
                    aria-haspopup="true"
                  >
                    <span>Login</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${loginOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {loginOpen && (
                    <div className="absolute right-0 mt-2 w-44 rounded-lg border border-gray-100 bg-white py-2 text-sm shadow-lg">
                        <Link to={role === 'admin' ? '/admin/dashboard' : '/admin'} className="block px-4 py-2 text-gray-700 hover:bg-indigo-50">Admin</Link>
                        <Link to={role === 'student' ? '/student/profile' : '/student'} className="block px-4 py-2 text-gray-700 hover:bg-indigo-50">Student</Link>
                        <Link to={role === 'teacher' ? '/teacher/dashboard' : '/teacher'} className="block px-4 py-2 text-gray-700 hover:bg-indigo-50">Teacher</Link>
                        <Link to={role === 'driver' ? '/driver/dashboard' : '/driver'} className="block px-4 py-2 text-gray-700 hover:bg-indigo-50">Driver</Link>
                    </div>
                  )}
                </div>
            )}

            {/* Mobile toggles */}
            <button
              className="md:hidden inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-700 hover:bg-gray-50"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </nav>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-3 shadow-inner">
            <div className="flex flex-col gap-2">
              <NavLink to="/" icon={Home}>Home</NavLink>
                <NavLink to={role === 'admin' ? '/admin/dashboard' : '/admin'} icon={User}>Admin</NavLink>
                <NavLink to={role === 'student' ? '/student/profile' : '/student'} icon={Users}>Student</NavLink>
                <NavLink to={role === 'teacher' ? '/teacher/dashboard' : '/teacher'} icon={BookOpen}>Teacher</NavLink>
                <NavLink to={role === 'driver' ? '/driver/dashboard' : '/driver'} icon={Bus}>Driver</NavLink>
            </div>
            <div className="my-3 h-px bg-gray-100" />
            {isLoggedIn ? (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
                  <span className="font-semibold text-gray-800">{username}</span>
                  <span className="capitalize text-indigo-600">{role}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 text-sm">
                <Link to="/admin" className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-2 text-gray-700 hover:bg-indigo-50" onClick={() => setMobileOpen(false)}>
                  <span>Admin Login</span>
                  <User className="h-4 w-4 text-indigo-500" />
                </Link>
                <Link to="/student" className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-2 text-gray-700 hover:bg-indigo-50" onClick={() => setMobileOpen(false)}>
                  <span>Student Login</span>
                  <Users className="h-4 w-4 text-indigo-500" />
                </Link>
                <Link to="/teacher" className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-2 text-gray-700 hover:bg-indigo-50" onClick={() => setMobileOpen(false)}>
                  <span>Teacher Login</span>
                  <BookOpen className="h-4 w-4 text-indigo-500" />
                </Link>
                <Link to="/driver" className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-2 text-gray-700 hover:bg-indigo-50" onClick={() => setMobileOpen(false)}>
                  <span>Driver Login</span>
                  <Bus className="h-4 w-4 text-indigo-500" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}































