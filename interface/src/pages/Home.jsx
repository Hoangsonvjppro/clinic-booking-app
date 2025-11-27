import React from 'react';
import Banner from '../components/Banner';
import DoctorList from '../components/DoctorList';
import NewsSection from '../components/NewsSection';
import { useApp } from '../context/AppContext';

const Home = () => {
  const { setBookingModalOpen } = useApp();

  const handleDoctorClick = (doctor) => {
    console.log('Doctor clicked:', doctor);
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Banner />
      <DoctorList onDoctorClick={handleDoctorClick} />
      <NewsSection />
    </div>
  );
};

export default Home;
