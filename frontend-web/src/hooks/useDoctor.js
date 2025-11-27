import { useState, useEffect } from 'react';
import * as doctorApi from '../api/doctorApi';

export const useDoctor = (doctorId) => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (doctorId) {
      fetchDoctor();
    }
  }, [doctorId]);

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      const data = await doctorApi.getDoctorById(doctorId);
      setDoctor(data);
      setError(null);
    } catch (err) {
      setError(err);
      console.error('Failed to fetch doctor:', err);
    } finally {
      setLoading(false);
    }
  };

  return { doctor, loading, error, refetch: fetchDoctor };
};

export const useDoctors = (filters = {}) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, [JSON.stringify(filters)]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await doctorApi.getDoctors(filters);
      setDoctors(data);
      setError(null);
    } catch (err) {
      setError(err);
      console.error('Failed to fetch doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  return { doctors, loading, error, refetch: fetchDoctors };
};
