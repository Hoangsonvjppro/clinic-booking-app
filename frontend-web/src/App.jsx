import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { BookingProvider } from './context/BookingContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Layouts
import MainLayout from './components/layout/MainLayout';
import PublicLayout from './components/layout/PublicLayout';
import PatientLayout from './components/layout/PatientLayout';
import DoctorLayout from './components/layout/DoctorLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import OAuthCallback from './pages/auth/OAuthCallback';
import DoctorListPage from './pages/doctor/DoctorList';
import DoctorDetail from './pages/doctor/DoctorDetail';
import DoctorApplication from './pages/doctor/DoctorApplication';

// Booking & Payment Pages (shared)
import BookingPage from './pages/booking/BookingPage';
import PaymentPage from './pages/payment/PaymentPage';
import PaymentComplete from './pages/payment/PaymentComplete';

// Patient Portal Pages
import PatientDashboard from './pages/patient/Dashboard';
import PatientBookings from './pages/patient/Bookings';
import PatientMedicalRecords from './pages/patient/MedicalRecords';
import PatientNotifications from './pages/patient/Notifications';
import PatientProfile from './pages/patient/Profile';
import PatientReviews from './pages/patient/Reviews';
import DoctorReview from './pages/patient/DoctorReview';

// Legacy user pages (for backwards compatibility)
import Profile from './pages/user/Profile';
import Dashboard from './pages/user/Dashboard';
import MedicalRecords from './pages/user/MedicalRecords';
import Notifications from './pages/user/Notifications';
import BookingHistory from './pages/booking/BookingHistory';
import MyReportsPage from './pages/user/MyReportsPage';
import MyWarningsPage from './pages/user/MyWarningsPage';
import MyPenaltiesPage from './pages/user/MyPenaltiesPage';

// Admin Portal Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ReportManagement from './pages/admin/ReportManagement';
import WarningManagement from './pages/admin/WarningManagement';
import PenaltyManagement from './pages/admin/PenaltyManagement';
import UserManagement from './pages/admin/UserManagement';
import StatisticsDashboard from './pages/admin/StatisticsDashboard';
import CommissionSettings from './pages/admin/CommissionSettings';
import DoctorApprovals from './pages/admin/DoctorApprovals';
import SystemSettings from './pages/admin/SystemSettings';

// Doctor Portal Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorSchedule from './pages/doctor/DoctorSchedule';
import DoctorProfile from './pages/doctor/DoctorProfile';
import DoctorFeeSettings from './pages/doctor/FeeSettings';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppProvider>
            <BookingProvider>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />

              <Routes>
                {/* ============ PUBLIC ROUTES ============ */}
                <Route path="/" element={<PublicLayout />}>
                  <Route index element={<Home />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="oauth2/callback" element={<OAuthCallback />} />
                  <Route path="doctors" element={<DoctorListPage />} />
                  <Route path="doctors/:id" element={<DoctorDetail />} />
                  <Route path="doctor/apply" element={<DoctorApplication />} />
                </Route>

                {/* ============ PATIENT PORTAL ============ */}
                <Route
                  path="/patient"
                  element={
                    <ProtectedRoute roles={['PATIENT', 'USER']}>
                      <PatientLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<PatientDashboard />} />
                  <Route path="dashboard" element={<PatientDashboard />} />
                  <Route path="bookings" element={<PatientBookings />} />
                  <Route path="medical-records" element={<PatientMedicalRecords />} />
                  <Route path="notifications" element={<PatientNotifications />} />
                  <Route path="reviews" element={<PatientReviews />} />
                  <Route path="review/:appointmentId" element={<DoctorReview />} />
                  <Route path="profile" element={<PatientProfile />} />
                </Route>

                {/* Booking flow - accessible by patients (uses MainLayout for multi-step flow) */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="booking/:doctorId" element={<BookingPage />} />
                  <Route path="payment/:appointmentId" element={<PaymentPage />} />
                  <Route path="payment/complete" element={<PaymentComplete />} />
                </Route>

                {/* Legacy routes - redirect to new patient portal */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="dashboard" element={<Navigate to="/patient/dashboard" replace />} />
                  <Route path="profile" element={<Navigate to="/patient/profile" replace />} />
                  <Route path="medical-records" element={<Navigate to="/patient/medical-records" replace />} />
                  <Route path="notifications" element={<Navigate to="/patient/notifications" replace />} />
                  <Route path="bookings" element={<Navigate to="/patient/bookings" replace />} />
                  <Route path="my-reports" element={<MyReportsPage />} />
                  <Route path="my-warnings" element={<MyWarningsPage />} />
                  <Route path="my-penalties" element={<MyPenaltiesPage />} />
                </Route>

                {/* ============ ADMIN PORTAL ============ */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute roles={['ADMIN']}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="statistics" element={<StatisticsDashboard />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="doctor-approvals" element={<DoctorApprovals />} />
                  <Route path="reports" element={<ReportManagement />} />
                  <Route path="warnings" element={<WarningManagement />} />
                  <Route path="penalties" element={<PenaltyManagement />} />
                  <Route path="commission" element={<CommissionSettings />} />
                  <Route path="settings" element={<SystemSettings />} />
                </Route>

                {/* ============ DOCTOR PORTAL ============ */}
                <Route
                  path="/doctor"
                  element={
                    <ProtectedRoute roles={['DOCTOR']}>
                      <DoctorLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DoctorDashboard />} />
                  <Route path="dashboard" element={<DoctorDashboard />} />
                  <Route path="appointments" element={<DoctorAppointments />} />
                  <Route path="schedule" element={<DoctorSchedule />} />
                  <Route path="fee-settings" element={<DoctorFeeSettings />} />
                  <Route path="profile" element={<DoctorProfile />} />
                </Route>

                {/* 404 - Redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BookingProvider>
          </AppProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
