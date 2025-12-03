import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  MagnifyingGlassIcon,
  BellIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  Bars3Icon,
  XMarkIcon,
  CalendarDaysIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/doctors?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: HomeIcon },
    { to: '/doctors', label: 'Find Doctors', icon: UserIcon },
    { to: '/bookings', label: 'My Bookings', icon: CalendarDaysIcon, auth: true },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-soft">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-md transition-all">
              <HeartIcon className="w-6 h-6 text-white" />
            </div>
            <span className="hidden sm:block font-bold text-xl text-slate-900">
              Clinic<span className="text-primary-600">Care</span>
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              (!link.auth || isAuthenticated) && (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    isActive(link.to)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search doctors, specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all text-sm"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </form>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            {isAuthenticated && (
              <Link
                to="/notifications"
                className="relative p-2.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
              >
                <BellIcon className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
            >
              {showMobileMenu ? (
                <XMarkIcon className="w-5 h-5" />
              ) : (
                <Bars3Icon className="w-5 h-5" />
              )}
            </button>

            {/* Login/Register or User Avatar */}
            <div className="hidden sm:block">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 p-1.5 pr-3 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm shadow-soft">
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-slate-700 max-w-[120px] truncate">
                      {user?.fullName || user?.email}
                    </span>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {showProfileMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowProfileMenu(false)}
                      ></div>
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-elevated py-2 z-20 border border-slate-100 animate-slide-down">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="font-semibold text-slate-900">{user?.fullName || 'User'}</p>
                          <p className="text-sm text-slate-500 truncate">{user?.email}</p>
                        </div>
                        
                        <div className="py-2">
                          <Link
                            to="/dashboard"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-all"
                          >
                            <HomeIcon className="w-5 h-5 text-slate-400" />
                            <span>Dashboard</span>
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-all"
                          >
                            <UserIcon className="w-5 h-5 text-slate-400" />
                            <span>My Profile</span>
                          </Link>
                          <Link
                            to="/bookings"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-all"
                          >
                            <CalendarDaysIcon className="w-5 h-5 text-slate-400" />
                            <span>My Bookings</span>
                          </Link>
                          <Link
                            to="/medical-records"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-all"
                          >
                            <ClipboardDocumentListIcon className="w-5 h-5 text-slate-400" />
                            <span>Medical Records</span>
                          </Link>
                        </div>
                        
                        <div className="border-t border-slate-100 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-all w-full"
                          >
                            <ArrowRightOnRectangleIcon className="w-5 h-5" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-slate-700 font-medium hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all text-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary py-2 px-4 text-sm"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearch} className="md:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden border-t border-slate-100 bg-white animate-slide-down">
          <div className="container-custom py-4">
            {/* Nav Links */}
            <nav className="space-y-1 mb-4">
              {navLinks.map((link) => (
                (!link.auth || isAuthenticated) && (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive(link.to)
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                )
              ))}
            </nav>

            {/* User Actions */}
            {isAuthenticated ? (
              <div className="border-t border-slate-100 pt-4 space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <UserIcon className="w-5 h-5 text-slate-400" />
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/medical-records"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <ClipboardDocumentListIcon className="w-5 h-5 text-slate-400" />
                  <span>Medical Records</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all w-full"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setShowMobileMenu(false)}
                  className="block w-full py-3 text-center font-medium text-primary-600 border border-primary-600 rounded-xl hover:bg-primary-50 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setShowMobileMenu(false)}
                  className="block w-full btn-primary py-3 text-center"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
