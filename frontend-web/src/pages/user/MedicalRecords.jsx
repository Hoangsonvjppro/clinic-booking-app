import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DocumentTextIcon,
  CalendarDaysIcon,
  UserIcon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export default function MedicalRecords() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setLoading(true);
    try {
      // TODO: Call API to fetch medical records
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock data
      setRecords([
        {
          id: 1,
          date: '2024-11-28',
          doctorName: 'Dr. Sarah Johnson',
          doctorSpecialty: 'Cardiology',
          diagnosis: 'Mild hypertension',
          prescription: [
            { medicine: 'Lisinopril 10mg', dosage: '1 tablet daily', duration: '30 days' },
            { medicine: 'Aspirin 81mg', dosage: '1 tablet daily', duration: '30 days' },
          ],
          notes: 'Patient advised to reduce salt intake and exercise regularly. Follow-up in 1 month.',
          attachments: ['ECG Report', 'Blood Test Results'],
          type: 'consultation',
        },
        {
          id: 2,
          date: '2024-10-15',
          doctorName: 'Dr. Michael Chen',
          doctorSpecialty: 'General Medicine',
          diagnosis: 'Seasonal allergies',
          prescription: [
            { medicine: 'Cetirizine 10mg', dosage: '1 tablet at night', duration: '14 days' },
          ],
          notes: 'Avoid allergens. Use antihistamines as needed.',
          attachments: [],
          type: 'consultation',
        },
        {
          id: 3,
          date: '2024-09-05',
          labName: 'City Medical Lab',
          testType: 'Complete Blood Count (CBC)',
          results: 'All values within normal range',
          attachments: ['Lab Report'],
          type: 'lab',
        },
      ]);
    } catch (error) {
      console.error('Failed to load records:', error);
      toast.error('Failed to load medical records');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record => {
    if (filter !== 'all' && record.type !== filter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        record.doctorName?.toLowerCase().includes(query) ||
        record.diagnosis?.toLowerCase().includes(query) ||
        record.testType?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Medical Records</h1>
            <p className="text-slate-600 mt-1">Access your complete medical history</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl p-4 shadow-card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'consultation', 'lab'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    filter === type
                      ? 'bg-primary-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type === 'all' ? 'All' : type === 'consultation' ? 'Consultations' : 'Lab Reports'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Records List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-slate-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-card">
            <DocumentTextIcon className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No records found</h3>
            <p className="text-slate-600">
              {searchQuery ? 'Try adjusting your search' : 'Your medical records will appear here'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-xl p-6 shadow-card hover:shadow-elevated transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    record.type === 'lab' ? 'bg-amber-100' : 'bg-primary-100'
                  }`}>
                    {record.type === 'lab' ? (
                      <BeakerIcon className="w-6 h-6 text-amber-600" />
                    ) : (
                      <ClipboardDocumentListIcon className="w-6 h-6 text-primary-600" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {record.type === 'lab' ? record.testType : record.diagnosis}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {record.type === 'lab' ? record.labName : `${record.doctorName} • ${record.doctorSpecialty}`}
                        </p>
                      </div>
                      <span className="badge-neutral flex items-center gap-1">
                        <CalendarDaysIcon className="w-3.5 h-3.5" />
                        {formatDate(record.date)}
                      </span>
                    </div>

                    {/* Prescription */}
                    {record.prescription && record.prescription.length > 0 && (
                      <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                        <h4 className="text-sm font-medium text-slate-700 mb-2">Prescription</h4>
                        <div className="space-y-2">
                          {record.prescription.map((med, idx) => (
                            <div key={idx} className="flex flex-wrap gap-x-4 text-sm">
                              <span className="font-medium text-slate-900">{med.medicine}</span>
                              <span className="text-slate-500">{med.dosage}</span>
                              <span className="text-slate-400">({med.duration})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {record.notes && (
                      <p className="text-sm text-slate-600 mt-3">{record.notes}</p>
                    )}

                    {/* Attachments & Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-100">
                      <div className="flex flex-wrap gap-2">
                        {record.attachments?.map((attachment, idx) => (
                          <span key={idx} className="text-sm text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                            {attachment}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedRecord(record)}
                          className="btn-ghost py-1.5 px-3 text-sm flex items-center gap-1"
                        >
                          <EyeIcon className="w-4 h-4" />
                          View Details
                        </button>
                        <button className="btn-outline py-1.5 px-3 text-sm flex items-center gap-1">
                          <ArrowDownTrayIcon className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Medical Record Details</h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Date</span>
                  <span className="font-medium">{formatDate(selectedRecord.date)}</span>
                </div>
                {selectedRecord.doctorName && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Doctor</span>
                    <span className="font-medium">{selectedRecord.doctorName}</span>
                  </div>
                )}
                {selectedRecord.diagnosis && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Diagnosis</span>
                    <span className="font-medium">{selectedRecord.diagnosis}</span>
                  </div>
                )}
                {selectedRecord.notes && (
                  <div>
                    <span className="text-slate-500 block mb-2">Notes</span>
                    <p className="text-slate-700 bg-slate-50 p-4 rounded-lg">{selectedRecord.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}