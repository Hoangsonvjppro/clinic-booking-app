import React, { useState } from 'react';
import { createPatientReport, createDoctorReport } from '../../api/reportApi';
import toast from 'react-hot-toast';

const REPORT_TYPES = {
  PATIENT: [
    { value: 'UNPROFESSIONAL_BEHAVIOR', label: 'Hành vi không chuyên nghiệp' },
    { value: 'LATE_CANCELLATION', label: 'Hủy lịch muộn' },
    { value: 'NO_SHOW', label: 'Không đến theo lịch hẹn' },
    { value: 'OVERCHARGING', label: 'Tính phí quá cao' },
    { value: 'POOR_SERVICE', label: 'Dịch vụ kém chất lượng' },
    { value: 'HARASSMENT', label: 'Quấy rối' },
    { value: 'OTHER', label: 'Khác' },
  ],
  DOCTOR: [
    { value: 'NO_SHOW', label: 'Bệnh nhân không đến' },
    { value: 'ABUSIVE_BEHAVIOR', label: 'Hành vi lạm dụng' },
    { value: 'FAKE_BOOKING', label: 'Đặt lịch giả' },
    { value: 'LATE_CANCELLATION', label: 'Hủy lịch muộn' },
    { value: 'HARASSMENT', label: 'Quấy rối' },
    { value: 'OTHER', label: 'Khác' },
  ],
};

const ReportForm = ({ 
  reportedUserId, 
  reportedUserName,
  reporterType = 'PATIENT', // 'PATIENT' or 'DOCTOR'
  appointmentId = null,
  onSuccess,
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    reportType: '',
    title: '',
    description: '',
    evidenceUrls: [],
  });
  const [newEvidenceUrl, setNewEvidenceUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const reportTypes = reporterType === 'PATIENT' ? REPORT_TYPES.PATIENT : REPORT_TYPES.DOCTOR;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.reportType) newErrors.reportType = 'Vui lòng chọn loại báo cáo';
    if (!formData.title.trim()) newErrors.title = 'Vui lòng nhập tiêu đề';
    if (formData.title.length > 255) newErrors.title = 'Tiêu đề không được quá 255 ký tự';
    if (!formData.description.trim()) newErrors.description = 'Vui lòng nhập mô tả chi tiết';
    if (formData.description.length > 5000) newErrors.description = 'Mô tả không được quá 5000 ký tự';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData = {
        reportedId: reportedUserId,
        reportType: formData.reportType,
        title: formData.title.trim(),
        description: formData.description.trim(),
        appointmentId: appointmentId,
        evidenceUrls: formData.evidenceUrls.filter(url => url.trim()),
      };

      const createReport = reporterType === 'PATIENT' ? createPatientReport : createDoctorReport;
      await createReport(submitData);
      
      toast.success('Báo cáo đã được gửi thành công!');
      onSuccess?.();
    } catch (error) {
      console.error('Error creating report:', error);
      if (error.response?.data?.message?.includes('already submitted')) {
        toast.error('Bạn đã gửi báo cáo cho cuộc hẹn này rồi');
      } else {
        toast.error('Không thể gửi báo cáo. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  const addEvidenceUrl = () => {
    if (newEvidenceUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        evidenceUrls: [...prev.evidenceUrls, newEvidenceUrl.trim()]
      }));
      setNewEvidenceUrl('');
    }
  };

  const removeEvidenceUrl = (index) => {
    setFormData(prev => ({
      ...prev,
      evidenceUrls: prev.evidenceUrls.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Báo cáo {reporterType === 'PATIENT' ? 'Bác sĩ' : 'Bệnh nhân'}
      </h2>
      
      {reportedUserName && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Báo cáo về: </span>
          <span className="font-semibold text-gray-800">{reportedUserName}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Report Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loại báo cáo <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.reportType}
            onChange={(e) => setFormData(prev => ({ ...prev, reportType: e.target.value }))}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.reportType ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">-- Chọn loại báo cáo --</option>
            {reportTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          {errors.reportType && <p className="mt-1 text-sm text-red-500">{errors.reportType}</p>}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Nhập tiêu đề ngắn gọn cho báo cáo"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          <p className="mt-1 text-xs text-gray-500">{formData.title.length}/255 ký tự</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả chi tiết <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
            rows={5}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          <p className="mt-1 text-xs text-gray-500">{formData.description.length}/5000 ký tự</p>
        </div>

        {/* Evidence URLs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bằng chứng (URL ảnh/video)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="url"
              value={newEvidenceUrl}
              onChange={(e) => setNewEvidenceUrl(e.target.value)}
              placeholder="Nhập URL bằng chứng"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={addEvidenceUrl}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Thêm
            </button>
          </div>
          {formData.evidenceUrls.length > 0 && (
            <ul className="space-y-2">
              {formData.evidenceUrls.map((url, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <span className="truncate flex-1 text-blue-600">{url}</span>
                  <button
                    type="button"
                    onClick={() => removeEvidenceUrl(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Xóa
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang gửi...' : 'Gửi báo cáo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
