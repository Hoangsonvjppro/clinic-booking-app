import { createContext, useState, useContext } from 'react';
import * as appointmentApi from '../api/appointmentApi';
import toast from 'react-hot-toast';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [bookingStep, setBookingStep] = useState(1); // 1: Select DateTime, 2: Confirm, 3: Payment

  const startBooking = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingStep(1);
  };

  const selectDateTime = (date, time) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setBookingStep(2);
  };

  const confirmBooking = async (patientInfo, reasonForVisit) => {
    try {
      const appointmentData = {
        doctorId: selectedDoctor.id,
        patientId: patientInfo.id,
        appointmentTime: `${selectedDate}T${selectedTime}:00`,
        reasonForVisit,
        notes: patientInfo.notes || '',
      };

      const appointment = await appointmentApi.createAppointment(appointmentData);
      setAppointmentDetails(appointment);
      setBookingStep(3);
      toast.success('Appointment created successfully!');
      return appointment;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create appointment';
      toast.error(message);
      throw error;
    }
  };

  const cancelBooking = async (appointmentId, reason) => {
    try {
      await appointmentApi.cancelAppointment(appointmentId, reason);
      toast.success('Appointment cancelled successfully');
      resetBooking();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel appointment';
      toast.error(message);
      throw error;
    }
  };

  const resetBooking = () => {
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setAppointmentDetails(null);
    setBookingStep(1);
  };

  const goToStep = (step) => {
    setBookingStep(step);
  };

  const value = {
    selectedDoctor,
    selectedDate,
    selectedTime,
    appointmentDetails,
    bookingStep,
    startBooking,
    selectDateTime,
    confirmBooking,
    cancelBooking,
    resetBooking,
    goToStep,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};

export default BookingContext;
