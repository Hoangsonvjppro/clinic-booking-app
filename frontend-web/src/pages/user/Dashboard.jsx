import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BellIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { getUpcomingAppointments, getAppointmentHistory } from '../../api/appointmentApi';
import { useAuth } from '../../hooks/useAuth';

const quickActions = [
  { title: 'Book Appointment', icon: CalendarDaysIcon, path: '/doctors', color: 'bg-primary-500' },
  { title: 'My Appointments', icon: ClockIcon, path: '/bookings', color: 'bg-medical-500' },
  { title: 'Medical Records', icon: DocumentTextIcon, path: '/medical-records', color: 'bg-amber-500' },
  { title: 'Notifications', icon: BellIcon, path: '/notifications', color: 'bg-slate-700' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    upcomingCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [upcoming, history] = await Promise.all([
        getUpcomingAppointments(),
        getAppointmentHistory()
      ]);
      
      const upcomingData = upcoming?.data || upcoming || [];
      const historyData = history?.data || history || [];
      
      setUpcomingAppointments(upcomingData.slice(0, 3));
      setRecentAppointments(historyData.slice(0, 5));
      setStats({
        totalAppointments: historyData.length + upcomingData.length,
        completedAppointments: historyData.filter(a => a.status === 'COMPLETED').length,
        upcomingCount: upcomingData.length,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Mock data
      setUpcomingAppointments([
        {
          id: 1,
          doctorName: 'Dr. Sarah Johnson',
          doctorSpecialty: 'Cardiology',
          appointmentDate: '2024-12-05',
          appointmentTime: '10:00 AM',
          status: 'CONFIRMED',
        },
      ]);
      setStats({
        totalAppointments: 12,
        completedAppointments: 8,
        upcomingCount: 2,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container-custom">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 md:p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {getGreeting()}, {user?.fullName?.split(' ')[0] || 'there'}! 👋
              </h1>
              <p className="text-primary-100 mt-2">
                Welcome back to your health dashboard
              </p>
            </div>
            <Link 
              to="/doctors" 
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-all self-start"
            >
              <CalendarDaysIcon className="w-5 h-5" />
              Book Appointment
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Appointments', value: stats.totalAppointments, icon: CalendarDaysIcon, color: 'text-primary-600 bg-primary-50' },
            { label: 'Completed', value: stats.completedAppointments, icon: CheckCircleIcon, color: 'text-medical-600 bg-medical-50' },
            { label: 'Upcoming', value: stats.upcomingCount, icon: ClockIcon, color: 'text-amber-600 bg-amber-50' },
            { label: 'Health Score', value: '85%', icon: StarSolidIcon, color: 'text-primary-600 bg-primary-50' },
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-5 shadow-card">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                className="bg-white rounded-xl p-5 shadow-card hover:shadow-elevated transition-all hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-slate-900 group-hover:text-primary-600 transition-colors">
                  {action.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-xl shadow-card">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Upcoming Appointments</h2>
              <Link to="/bookings" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                View all <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
            
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse flex gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="p-8 text-center">
                <CalendarDaysIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">No upcoming appointments</p>
                <Link to="/doctors" className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block">
                  Book an appointment
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                        {appointment.doctorName?.charAt(0) || 'D'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{appointment.doctorName}</p>
                        <p className="text-sm text-primary-600">{appointment.doctorSpecialty}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">{formatDate(appointment.appointmentDate)}</p>
                        <p className="text-sm text-slate-500">{appointment.appointmentTime}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Health Tips / Reminders */}
          <div className="bg-white rounded-xl shadow-card">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Health Tips</h2>
            </div>
            <div className="p-6 space-y-4">
              {[
                { 
                  icon: ExclamationCircleIcon,
                  title: 'Annual Checkup Due',
                  description: 'Schedule your annual health checkup to stay on top of your health.',
                  color: 'bg-amber-100 text-amber-600'
                },
                { 
                  icon: DocumentTextIcon,
                  title: 'Update Medical History',
                  description: 'Keep your medical records up to date for better care.',
                  color: 'bg-primary-100 text-primary-600'
                },
                { 
                  icon: CheckCircleIcon,
                  title: 'Vaccination Schedule',
                  description: 'Check if you\'re due for any vaccinations.',
                  color: 'bg-medical-100 text-medical-600'
                },
              ].map((tip, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className={`w-10 h-10 rounded-lg ${tip.color} flex items-center justify-center flex-shrink-0`}>
                    <tip.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">{tip.title}</h4>
                    <p className="text-sm text-slate-500 mt-1">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}