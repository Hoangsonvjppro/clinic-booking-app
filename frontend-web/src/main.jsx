import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './pages/MainPage'
import AuthPage from './pages/AuthPage'
import PaymentPage from './pages/PaymentPage'
import PaymentComplete from './pages/PaymentComplete'
import CreateDoctorAcc from './pages/CreateDoctorAcc'




createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-complete" element={<PaymentComplete />} />
        <Route path="/doctor-appointment/form" element={<CreateDoctorAcc />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
