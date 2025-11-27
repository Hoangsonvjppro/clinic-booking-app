import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import ConsultModal from './components/ConsultModal';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import MedicalRecords from './pages/MedicalRecords';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/medical-records" element={<MedicalRecords />} />
            </Routes>
          </main>
          <Footer />
          <BookingModal />
          <ConsultModal />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
