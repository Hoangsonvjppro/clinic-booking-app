import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { BookingProvider } from './context/BookingContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages - Import placeholders (will be created)
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import OAuthCallback from './pages/auth/OAuthCallback';
import DoctorListPage from './pages/doctor/DoctorList';
import DoctorDetail from './pages/doctor/DoctorDetail';
import DoctorApplication from './pages/doctor/DoctorApplication';
import BookingPage from './pages/booking/BookingPage';
import BookingHistory from './pages/booking/BookingHistory';
import PaymentPage from './pages/payment/PaymentPage';
import PaymentComplete from './pages/payment/PaymentComplete';
import Profile from './pages/user/Profile';
import Dashboard from './pages/user/Dashboard';
import MedicalRecords from './pages/user/MedicalRecords';
import Notifications from './pages/user/Notifications';
import AdminDashboard from './pages/admin/AdminDashboard';
import ReportManagement from './pages/admin/ReportManagement';
import WarningManagement from './pages/admin/WarningManagement';
import PenaltyManagement from './pages/admin/PenaltyManagement';
import UserManagement from './pages/admin/UserManagement';
import StatisticsDashboard from './pages/admin/StatisticsDashboard';

// User pages for reports/warnings/penalties
import MyReportsPage from './pages/user/MyReportsPage';
import MyWarningsPage from './pages/user/MyWarningsPage';
import MyPenaltiesPage from './pages/user/MyPenaltiesPage';

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
                {/* Public routes */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Home />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="oauth2/callback" element={<OAuthCallback />} />
                  <Route path="doctors" element={<DoctorListPage />} />
                  <Route path="doctors/:id" element={<DoctorDetail />} />
                </Route>

                {/* Protected routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="medical-records" element={<MedicalRecords />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="booking/:doctorId" element={<BookingPage />} />
                  <Route path="bookings" element={<BookingHistory />} />
                  <Route path="payment/:appointmentId" element={<PaymentPage />} />
                  <Route path="payment/complete" element={<PaymentComplete />} />
                  <Route path="doctor/apply" element={<DoctorApplication />} />
                  <Route path="my-reports" element={<MyReportsPage />} />
                  <Route path="my-warnings" element={<MyWarningsPage />} />
                  <Route path="my-penalties" element={<MyPenaltiesPage />} />
                </Route>

                {/* Admin routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute roles={['ADMIN']}>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="statistics" element={<StatisticsDashboard />} />
                  <Route path="reports" element={<ReportManagement />} />
                  <Route path="warnings" element={<WarningManagement />} />
                  <Route path="penalties" element={<PenaltyManagement />} />
                  <Route path="users" element={<UserManagement />} />
                </Route>

                {/* 404 */}
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
