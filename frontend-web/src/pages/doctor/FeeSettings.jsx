import { useState, useEffect } from 'react';
import { DollarSign, Save, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';

export default function FeeSettings() {
  const { user } = useAuth();
  const [consultationFee, setConsultationFee] = useState(300000);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchFeeSettings();
    }
  }, [user?.id]);

  const fetchFeeSettings = async () => {
    setLoading(true);
    try {
      // Lấy phí từ API fee settings (dùng userId)
      const response = await api.get(`/doctor/fee/${user.id}`);
      const feeData = response?.data || response;
      
      console.log('Fee data:', feeData);
      
      if (feeData?.consultationFee) {
        setConsultationFee(Number(feeData.consultationFee));
      }
    } catch (error) {
      console.error('Error fetching fee settings:', error);
      toast.error('Không thể tải phí khám. Sử dụng giá trị mặc định.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (consultationFee <= 0) {
      toast.error('Phí khám phải lớn hơn 0');
      return;
    }

    setSaving(true);
    try {
      // Cập nhật phí khám qua API (dùng user.id)
      await api.put(`/doctor/fee/${user.id}`, {
        consultationFee: consultationFee
      });
      toast.success('Đã lưu phí khám thành công');
    } catch (error) {
      console.error('Error saving fee settings:', error);
      toast.error('Không thể lưu phí khám. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt phí khám</h1>
          <p className="text-gray-500">Thiết lập phí khám bệnh cho bệnh nhân</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Save className="w-4 h-4" />
          )}
          Lưu cài đặt
        </button>
      </div>

      {/* Fee Setting Card */}
      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-teal-600" />
          Phí khám bệnh
        </h2>
        
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phí khám (VNĐ)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={consultationFee}
              onChange={(e) => setConsultationFee(parseInt(e.target.value) || 0)}
              min={0}
              step={10000}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-lg"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Đây là phí khám bệnh sẽ được hiển thị cho bệnh nhân khi đặt lịch hẹn với bạn.
          </p>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <p className="font-medium mb-1">Lưu ý:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Phí khám này sẽ áp dụng cho tất cả các lịch hẹn của bạn</li>
            <li>Bệnh nhân sẽ thấy phí này khi xem hồ sơ và đặt lịch khám</li>
            <li>Thay đổi phí sẽ chỉ áp dụng cho các lịch hẹn mới</li>
          </ul>
        </div>
      </div>

      {/* Summary Card */}
      <div className="mt-6 bg-teal-50 border border-teal-200 rounded-xl p-6">
        <h3 className="font-semibold text-teal-900 mb-3">Tóm tắt</h3>
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-lg px-4 py-3 border border-teal-200">
            <span className="text-sm text-teal-700 block">Phí khám hiện tại</span>
            <p className="text-2xl font-bold text-teal-900">{formatCurrency(consultationFee)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
