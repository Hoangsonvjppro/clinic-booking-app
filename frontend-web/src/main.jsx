import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './pages/MainPage'
import AuthPage from './pages/AuthPage'
import PaymentPage from './pages/PaymentPage'
import PaymentComplete from './pages/PaymentComplete'
import CreateDoctorAcc from './pages/CreateDoctorAcc'
import Dashboard from './pages/Dashboard'
import DoctorPage from './pages/DoctorPage'
import Profile from './pages/Profile'
import BookingPage from './pages/BookingPage'
import AdminDashboard from './pages/AdminDashboard'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/homepage" element={<MainPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/profile/*" element={<Profile />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/payment-complete" element={<PaymentComplete />} />
      <Route path="/doctor-appointment/form" element={<CreateDoctorAcc />} />
      <Route path="/doctor-appointment" element={<DoctorPage />} />
      <Route path="/doctor-appointment/booking" element={<BookingPage />} />
      <Route path="/admin/*" element={<AdminDashboard />}>
          {/* These will match /admin, /admin/requests, etc. */}
          {/* The sub-routes are handled inside AdminDashboard */}
        </Route>
    </Routes> 
  </BrowserRouter>
)
