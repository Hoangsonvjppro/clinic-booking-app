import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  EyeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { getAppointmentHistory, cancelAppointment } from '../../api/appointmentApi';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const statusConfig = {
  PENDING: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: ClockIcon },
  CONFIRMED: { label: 'Confirmed', color: 'bg-primary-100 text-primary-700', icon: CheckCircleIcon },
  COMPLETED: { label: 'Completed', color: 'bg-medical-100 text-medical-700', icon: CheckCircleIcon },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircleIcon },
};

export default function BookingHistory() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const response = await getAppointmentHistory();
      setAppointments(response?.data || response || []);
    } catch (error) {
      console.error('Failed to load appointments:', error);
      // Mock data
      setAppointments([
        {
          id: 1,
          doctorName: 'Dr. Sarah Johnson',
          doctorSpecialty: 'Cardiology',
          appointmentDate: '2024-12-05',
          appointmentTime: '10:00 AM',
          status: 'CONFIRMED',
          location: 'Medical Center, Building A',
          consultationFee: 150,
        },
        {
          id: 2,
          doctorName: 'Dr. Michael Chen',
          doctorSpecialty: 'Neurology',
          appointmentDate: '2024-11-28',
          appointmentTime: '02:30 PM',
          status: 'COMPLETED',
          location: 'City Hospital',
          consultationFee: 180,
        },
        {
          id: 3,
          doctorName: 'Dr. Emily Williams',
          doctorSpecialty: 'Pediatrics',
          appointmentDate: '2024-11-20',
          appointmentTime: '09:00 AM',
          status: 'CANCELLED',
          location: 'Children\'s Clinic',
          consultationFee: 120,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedAppointment) return;
    
    setCancellingId(selectedAppointment.id);
    try {
      await cancelAppointment(selectedAppointment.id, cancelReason);
      toast.success('Appointment cancelled successfully');
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === selectedAppointment.id 
            ? { ...apt, status: 'CANCELLED' }
            : apt
        )
      );
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
      toast.error('Failed to cancel appointment');
    } finally {
      setCancellingId(null);
      setShowCancelModal(false);
      setSelectedAppointment(null);
      setCancelReason('');
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Appointments</h1>
            <p className="text-slate-600 mt-1">View and manage your appointment history</p>
          </div>
          <Link to="/doctors" className="btn-primary inline-flex items-center gap-2 self-start">
            <CalendarDaysIcon className="w-5 h-5" />
            Book New Appointment
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-card mb-6">
          <div className="flex flex-wrap gap-2">
            {['all', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status === 'all' ? 'All' : statusConfig[status]?.label || status}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-slate-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-card">
            <CalendarDaysIcon className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No appointments found</h3>
            <p className="text-slate-600 mb-6">
              {filter === 'all' 
                ? "You haven't booked any appointments yet." 
                : `No ${statusConfig[filter]?.label.toLowerCase()} appointments.`
              }
            </p>
            <Link to="/doctors" className="btn-primary">
              Find a Doctor
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => {
              const status = statusConfig[appointment.status] || statusConfig.PENDING;
              const StatusIcon = status.icon;
              const isPending = appointment.status === 'PENDING';
              const isConfirmed = appointment.status === 'CONFIRMED';
              const canCancel = isPending || isConfirmed;

              return (
                <div key={appointment.id} className="bg-white rounded-xl p-6 shadow-card hover:shadow-elevated transition-all">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Doctor Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xl font-bold">
                        {appointment.doctorName?.charAt(0) || 'D'}
                      </div>
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900">{appointment.doctorName}</h3>
                        <span className={`badge ${status.color}`}>
                          <StatusIcon className="w-3.5 h-3.5 mr-1" />
                          {status.label}
                        </span>
                      </div>
                      <p className="text-primary-600 text-sm font-medium">{appointment.doctorSpecialty}</p>
                      
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <CalendarDaysIcon className="w-4 h-4" />
                          {formatDate(appointment.appointmentDate)}
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          {appointment.appointmentTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="w-4 h-4" />
                          {appointment.location}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                      <Link
                        to={`/appointments/${appointment.id}`}
                        className="btn-outline py-2 px-4 text-sm flex items-center gap-1"
                      >
                        <EyeIcon className="w-4 h-4" />
                        View
                      </Link>
                      
                      {appointment.status === 'COMPLETED' && (
                        <Link
                          to={`/medical-records?appointmentId=${appointment.id}`}
                          className="btn-ghost py-2 px-4 text-sm flex items-center gap-1"
                        >
                          <DocumentTextIcon className="w-4 h-4" />
                          Records
                        </Link>
                      )}
                      
                      {canCancel && (
                        <button
                          onClick={() => handleCancelClick(appointment)}
                          disabled={cancellingId === appointment.id}
                          className="py-2 px-4 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <ExclamationCircleIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Cancel Appointment</h3>
                <p className="text-sm text-slate-500">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-slate-600 mb-4">
              Are you sure you want to cancel your appointment with{' '}
              <span className="font-medium">{selectedAppointment?.doctorName}</span>?
            </p>

            <div className="mb-6">
              <label className="input-label">Reason for cancellation (optional)</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                className="input-field resize-none"
                placeholder="Please let us know why you're cancelling..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedAppointment(null);
                  setCancelReason('');
                }}
                className="flex-1 btn-ghost"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleCancelConfirm}
                disabled={cancellingId}
                className="flex-1 bg-red-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-red-700 transition-all disabled:opacity-50"
              >
                {cancellingId ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}