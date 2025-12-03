import { useState, useEffect } from 'react';
import { DollarSign, Save, Info, Plus, Trash2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FeeSettings() {
  const [feeSettings, setFeeSettings] = useState({
    baseFee: 0,
    followUpFee: 0,
    emergencyFee: 0,
    consultationDuration: 30,
    customFees: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newCustomFee, setNewCustomFee] = useState({ name: '', fee: '' });

  useEffect(() => {
    fetchFeeSettings();
  }, []);

  const fetchFeeSettings = async () => {
    setLoading(true);
    try {
      // TODO: Call API
      await new Promise(resolve => setTimeout(resolve, 500));
      setFeeSettings({
        baseFee: 500000,
        followUpFee: 300000,
        emergencyFee: 800000,
        consultationDuration: 30,
        customFees: [
          { id: 1, name: 'Khám tổng quát', fee: 500000 },
          { id: 2, name: 'Siêu âm tim', fee: 700000 },
          { id: 3, name: 'Điện tâm đồ', fee: 400000 }
        ]
      });
    } catch (error) {
      toast.error('Không thể tải cài đặt phí khám');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (feeSettings.baseFee <= 0) {
      toast.error('Phí khám cơ bản phải lớn hơn 0');
      return;
    }

    setSaving(true);
    try {
      // TODO: Call API
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Đã lưu cài đặt phí khám thành công');
    } catch (error) {
      toast.error('Không thể lưu cài đặt');
    } finally {
      setSaving(false);
    }
  };

  const addCustomFee = () => {
    if (!newCustomFee.name.trim()) {
      toast.error('Vui lòng nhập tên dịch vụ');
      return;
    }
    if (!newCustomFee.fee || parseInt(newCustomFee.fee) <= 0) {
      toast.error('Vui lòng nhập phí dịch vụ hợp lệ');
      return;
    }

    setFeeSettings({
      ...feeSettings,
      customFees: [
        ...feeSettings.customFees,
        { id: Date.now(), name: newCustomFee.name, fee: parseInt(newCustomFee.fee) }
      ]
    });
    setNewCustomFee({ name: '', fee: '' });
    toast.success('Đã thêm dịch vụ');
  };

  const removeCustomFee = (id) => {
    setFeeSettings({
      ...feeSettings,
      customFees: feeSettings.customFees.filter(f => f.id !== id)
    });
    toast.success('Đã xóa dịch vụ');
  };

  const updateCustomFee = (id, field, value) => {
    setFeeSettings({
      ...feeSettings,
      customFees: feeSettings.customFees.map(f => 
        f.id === id ? { ...f, [field]: field === 'fee' ? parseInt(value) || 0 : value } : f
      )
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt phí khám</h1>
          <p className="text-gray-500">Thiết lập các mức phí cho dịch vụ khám bệnh</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Save className="w-4 h-4" />
          )}
          Lưu cài đặt
        </button>
      </div>

      {/* Basic Fees */}
      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-teal-600" />
          Phí khám cơ bản
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phí khám ban đầu (VNĐ)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={feeSettings.baseFee}
                onChange={(e) => setFeeSettings({ ...feeSettings, baseFee: parseInt(e.target.value) || 0 })}
                min={0}
                step={10000}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Phí cho lần khám đầu tiên</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phí tái khám (VNĐ)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={feeSettings.followUpFee}
                onChange={(e) => setFeeSettings({ ...feeSettings, followUpFee: parseInt(e.target.value) || 0 })}
                min={0}
                step={10000}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Phí cho các lần tái khám</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phí khám khẩn cấp (VNĐ)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={feeSettings.emergencyFee}
                onChange={(e) => setFeeSettings({ ...feeSettings, emergencyFee: parseInt(e.target.value) || 0 })}
                min={0}
                step={10000}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Phí cho khám ngoài giờ/khẩn cấp</p>
          </div>
        </div>
      </div>

      {/* Consultation Duration */}
      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-teal-600" />
          Thời gian khám
        </h2>
        
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thời gian mỗi lượt khám (phút)
          </label>
          <select
            value={feeSettings.consultationDuration}
            onChange={(e) => setFeeSettings({ ...feeSettings, consultationDuration: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
          >
            <option value={15}>15 phút</option>
            <option value={20}>20 phút</option>
            <option value={30}>30 phút</option>
            <option value={45}>45 phút</option>
            <option value={60}>60 phút</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Thời gian này sẽ được sử dụng để tạo các slot lịch khám
          </p>
        </div>
      </div>

      {/* Custom Services */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-teal-600" />
          Dịch vụ bổ sung
        </h2>

        {/* Add New Service */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên dịch vụ</label>
            <input
              type="text"
              value={newCustomFee.name}
              onChange={(e) => setNewCustomFee({ ...newCustomFee, name: e.target.value })}
              placeholder="VD: Siêu âm tim, Điện tâm đồ..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phí dịch vụ (VNĐ)</label>
            <input
              type="number"
              value={newCustomFee.fee}
              onChange={(e) => setNewCustomFee({ ...newCustomFee, fee: e.target.value })}
              placeholder="500000"
              min={0}
              step={10000}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={addCustomFee}
              className="w-full md:w-auto px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Thêm
            </button>
          </div>
        </div>

        {/* Services List */}
        {feeSettings.customFees.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Chưa có dịch vụ bổ sung nào</p>
          </div>
        ) : (
          <div className="space-y-3">
            {feeSettings.customFees.map((service) => (
              <div key={service.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => updateCustomFee(service.id, 'name', e.target.value)}
                    className="w-full px-3 py-1.5 border rounded focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="w-40">
                  <input
                    type="number"
                    value={service.fee}
                    onChange={(e) => updateCustomFee(service.id, 'fee', e.target.value)}
                    min={0}
                    step={10000}
                    className="w-full px-3 py-1.5 border rounded focus:ring-2 focus:ring-teal-500 text-right"
                  />
                </div>
                <span className="text-gray-500 hidden md:block">{formatCurrency(service.fee)}</span>
                <button
                  onClick={() => removeCustomFee(service.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">
            Các dịch vụ bổ sung sẽ được hiển thị khi bệnh nhân đặt lịch khám. 
            Họ có thể chọn thêm các dịch vụ này vào lịch hẹn của mình.
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 bg-teal-50 border border-teal-200 rounded-xl p-6">
        <h3 className="font-semibold text-teal-900 mb-3">Tóm tắt cài đặt</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-teal-700">Phí khám ban đầu:</span>
            <p className="font-semibold text-teal-900">{formatCurrency(feeSettings.baseFee)}</p>
          </div>
          <div>
            <span className="text-teal-700">Phí tái khám:</span>
            <p className="font-semibold text-teal-900">{formatCurrency(feeSettings.followUpFee)}</p>
          </div>
          <div>
            <span className="text-teal-700">Phí khẩn cấp:</span>
            <p className="font-semibold text-teal-900">{formatCurrency(feeSettings.emergencyFee)}</p>
          </div>
          <div>
            <span className="text-teal-700">Thời gian khám:</span>
            <p className="font-semibold text-teal-900">{feeSettings.consultationDuration} phút</p>
          </div>
        </div>
      </div>
    </div>
  );
}
