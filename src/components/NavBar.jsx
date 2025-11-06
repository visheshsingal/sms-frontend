import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Home, User, Users, BookOpen, LogOut } from 'lucide-react'; // Example icons from a library like 'lucide-react'

// Assuming 'bg-primary' is a color like a dark blue (e.g., indigo/blue-700)
// and 'text-uiText' is a default dark text color (e.g., gray-800)

export default function NavBar(){
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    // Use a full page reload or a clearer state reset if necessary, 
    // but navigate('/') is usually fine for simple state
    navigate('/'); 
  }

  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  const isLoggedIn = !!username;

  // Custom Link Component for consistent styling (white navbar with indigo accents)
  const NavLink = ({ to, children, icon: Icon }) => (
    <Link 
      to={to} 
      className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-indigo-600 transition duration-150 p-2 rounded-lg hover:bg-indigo-50"
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </Link>
  );

  return (
    // White navbar with blue accents; reduce left padding so logo shifts slightly left
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between py-3 pl-2 pr-4 md:pl-4 md:pr-8">

            {/* Logo and title - Use the sidebar blue for the logo, brand text dark on white bg */}
          <div className="flex items-center gap-3">
            {/* Using the same blue as sidebar for the logo icon */}
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow">SM</div>
            <Link to='/' className="text-xl font-bold text-gray-900 tracking-tight">School <span className="text-indigo-600">Management</span></Link>
          </div>

          {/* Right-aligned navigation and user actions */}
          <nav className="flex items-center gap-6">
            
            {/* Primary Navigation Links - Using the custom NavLink component */}
            <div className="hidden md:flex items-center gap-2">
              <NavLink to="/" icon={Home}>Home</NavLink>
              <NavLink to={role === 'admin' ? '/admin/dashboard' : '/admin'} icon={User}>Admin</NavLink>
              <NavLink to="/student" icon={Users}>Student</NavLink>
              <NavLink to="/teacher" icon={BookOpen}>Teacher</NavLink>
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
                <Link to="/admin" className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-150 shadow-md">
                    Login
                </Link>
            )}

            {/* You'd typically add a Hamburger/Mobile Menu button here for smaller screens */}
            
          </nav>
        </div>
      </div>
    </header>
  )
}































