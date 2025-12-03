import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CheckCircleIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  HomeIcon,
  ArrowDownTrayIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

export default function PaymentComplete() {
  const location = useLocation();
  const [showConfetti, setShowConfetti] = useState(true);
  const { booking, transactionId, paymentMethod } = location.state || {
    booking: {
      id: 'BK-2024-001',
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: '2024-12-05',
      time: '10:00 AM',
      consultationFee: 150,
      serviceFee: 5,
    },
    transactionId: 'TXN-' + Date.now(),
    paymentMethod: 'card',
  };

  const total = booking.consultationFee + booking.serviceFee;

  useEffect(() => {
    // Auto-hide confetti animation after 3 seconds
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 relative overflow-hidden">
      {/* Confetti Animation (CSS-based) */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className={`w-3 h-3 ${
                  ['bg-primary-500', 'bg-medical-500', 'bg-amber-400', 'bg-pink-400'][
                    Math.floor(Math.random() * 4)
                  ]
                }`}
                style={{
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}
      <div className="container-custom max-w-2xl">
        {/* Success Animation */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-24 h-24 bg-medical-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
            <CheckCircleIcon className="w-14 h-14 text-medical-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
          <p className="text-slate-600">Your appointment has been confirmed</p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm opacity-80">Booking ID</span>
              <span className="font-mono font-medium">{booking.id}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{booking.doctorName}</h2>
                <p className="opacity-80">{booking.specialty}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <CalendarDaysIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Date</p>
                  <p className="font-medium text-slate-900">
                    {new Date(booking.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <ClockIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Time</p>
                  <p className="font-medium text-slate-900">{booking.time}</p>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Transaction ID</span>
                <span className="font-mono text-slate-900">{transactionId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Payment Method</span>
                <span className="capitalize text-slate-900">
                  {paymentMethod === 'card' ? 'Credit Card' : paymentMethod === 'bank' ? 'Bank Transfer' : 'MoMo'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Amount Paid</span>
                <span className="font-semibold text-medical-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-slate-100 p-4 bg-slate-50 flex flex-wrap gap-3 justify-center">
            <button className="btn-outline py-2 px-4 text-sm flex items-center gap-2">
              <ArrowDownTrayIcon className="w-4 h-4" />
              Download Receipt
            </button>
            <button className="btn-ghost py-2 px-4 text-sm flex items-center gap-2">
              <ShareIcon className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-xl p-6 shadow-card mb-6">
          <h3 className="font-semibold text-slate-900 mb-4">What's Next?</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-medical-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-medical-600">1</span>
              </div>
              <div>
                <p className="font-medium text-slate-900">Confirmation Email</p>
                <p className="text-sm text-slate-600">Check your email for appointment details and instructions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-medical-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-medical-600">2</span>
              </div>
              <div>
                <p className="font-medium text-slate-900">Reminder</p>
                <p className="text-sm text-slate-600">You'll receive a reminder 24 hours before your appointment</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-medical-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-medical-600">3</span>
              </div>
              <div>
                <p className="font-medium text-slate-900">Arrive Early</p>
                <p className="text-sm text-slate-600">Please arrive 10-15 minutes before your scheduled time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/bookings" className="flex-1 btn-primary py-3 text-center flex items-center justify-center gap-2">
            <DocumentTextIcon className="w-5 h-5" />
            View My Bookings
          </Link>
          <Link to="/" className="flex-1 btn-outline py-3 text-center flex items-center justify-center gap-2">
            <HomeIcon className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}