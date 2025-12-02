import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Eye, Calendar, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { medicalRecords } from '../data/mockData';

const MedicalRecords = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useApp();
  const [selectedRecord, setSelectedRecord] = useState(null);

  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-sky-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>
        </div>

        <h1 className="text-3xl font-bold text-slate-800 mb-2">Hồ Sơ Bệnh Án</h1>
        <p className="text-gray-600 mb-6">Lịch sử khám bệnh và điều trị của bạn</p>

        {/* Records Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Records List */}
          <div className="space-y-4">
            {medicalRecords.map((record) => (
              <div
                key={record.id}
                onClick={() => setSelectedRecord(record)}
                className={`bg-white rounded-xl shadow-sm p-5 cursor-pointer transition-all hover:shadow-md ${
                  selectedRecord?.id === record.id ? 'ring-2 ring-sky-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-sky-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{record.diagnosis}</h3>
                      <p className="text-sm text-gray-600">{record.specialty}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                    <Eye className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(record.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{record.doctorName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Record Detail */}
          <div className="lg:sticky lg:top-24 h-fit">
            {selectedRecord ? (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                      {selectedRecord.diagnosis}
                    </h2>
                    <p className="text-gray-600">{formatDate(selectedRecord.date)}</p>
                  </div>
                  <button className="p-2 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-lg transition-all">
                    <Download className="w-5 h-5" />
                  </button>
                </div>

                {/* Doctor Info */}
                <div className="bg-sky-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-slate-800 mb-2">Bác sĩ điều trị</h3>
                  <p className="text-gray-700">{selectedRecord.doctorName}</p>
                  <p className="text-sm text-gray-600">{selectedRecord.specialty}</p>
                </div>

                {/* Prescription */}
                {selectedRecord.prescription.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-slate-800 mb-3">Đơn thuốc</h3>
                    <div className="space-y-3">
                      {selectedRecord.prescription.map((med, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-slate-800 mb-1">{med.name}</h4>
                          <p className="text-sm text-gray-600">
                            <strong>Liều lượng:</strong> {med.dosage}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Thời gian:</strong> {med.duration}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-800 mb-2">Ghi chú</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedRecord.notes}</p>
                </div>

                {/* Attachments */}
                {selectedRecord.attachments.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Tài liệu đính kèm</h3>
                    <div className="space-y-2">
                      {selectedRecord.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-gray-600" />
                            <span className="text-sm text-gray-700">{file}</span>
                          </div>
                          <Download className="w-4 h-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">
                  Chọn một hồ sơ để xem chi tiết
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
