import { useState, useEffect } from 'react';
import { DollarSign, Save, Info, TrendingUp, Users, Calendar, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CommissionSettings() {
  const [settings, setSettings] = useState({
    defaultCommissionRate: 10,
    minCommissionRate: 5,
    maxCommissionRate: 30,
    specialtyRates: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalCommission: 0,
    totalAppointments: 0,
    activeSpecialties: 0
  });

  useEffect(() => {
    fetchSettings();
    fetchStats();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      // TODO: Call API
      await new Promise(resolve => setTimeout(resolve, 500));
      setSettings({
        defaultCommissionRate: 10,
        minCommissionRate: 5,
        maxCommissionRate: 30,
        specialtyRates: [
          { id: 1, name: 'Tim mạch', rate: 12, appointmentCount: 156 },
          { id: 2, name: 'Da liễu', rate: 10, appointmentCount: 89 },
          { id: 3, name: 'Nội tổng quát', rate: 8, appointmentCount: 234 },
          { id: 4, name: 'Thần kinh', rate: 15, appointmentCount: 67 },
          { id: 5, name: 'Xương khớp', rate: 11, appointmentCount: 123 },
          { id: 6, name: 'Nhi khoa', rate: 9, appointmentCount: 189 },
          { id: 7, name: 'Sản phụ khoa', rate: 13, appointmentCount: 145 },
          { id: 8, name: 'Mắt', rate: 10, appointmentCount: 78 }
        ]
      });
    } catch (error) {
      toast.error('Không thể tải cài đặt hoa hồng');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // TODO: Call API
      await new Promise(resolve => setTimeout(resolve, 300));
      setStats({
        totalRevenue: 125000000,
        totalCommission: 12500000,
        totalAppointments: 1081,
        activeSpecialties: 8
      });
    } catch (error) {
      console.error('Error fetching stats');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Call API
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Đã lưu cài đặt hoa hồng thành công');
    } catch (error) {
      toast.error('Không thể lưu cài đặt');
    } finally {
      setSaving(false);
    }
  };

  const updateSpecialtyRate = (id, newRate) => {
    const rate = Math.min(Math.max(parseInt(newRate) || 0, settings.minCommissionRate), settings.maxCommissionRate);
    setSettings({
      ...settings,
      specialtyRates: settings.specialtyRates.map(s => 
        s.id === id ? { ...s, rate } : s
      )
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt hoa hồng</h1>
          <p className="text-gray-500">Quản lý phần trăm hoa hồng từ các lượt khám</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Save className="w-4 h-4" />
          )}
          Lưu cài đặt
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng doanh thu</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng hoa hồng</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(stats.totalCommission)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng lượt khám</p>
              <p className="text-lg font-semibold text-gray-900">{stats.totalAppointments.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Chuyên khoa</p>
              <p className="text-lg font-semibold text-gray-900">{stats.activeSpecialties}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Default Settings */}
      <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-indigo-600" />
          Cài đặt mặc định
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tỷ lệ hoa hồng mặc định (%)
            </label>
            <input
              type="number"
              value={settings.defaultCommissionRate}
              onChange={(e) => setSettings({ ...settings, defaultCommissionRate: parseInt(e.target.value) || 0 })}
              min={settings.minCommissionRate}
              max={settings.maxCommissionRate}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tỷ lệ tối thiểu (%)
            </label>
            <input
              type="number"
              value={settings.minCommissionRate}
              onChange={(e) => setSettings({ ...settings, minCommissionRate: parseInt(e.target.value) || 0 })}
              min={0}
              max={100}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tỷ lệ tối đa (%)
            </label>
            <input
              type="number"
              value={settings.maxCommissionRate}
              onChange={(e) => setSettings({ ...settings, maxCommissionRate: parseInt(e.target.value) || 0 })}
              min={0}
              max={100}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">
            Tỷ lệ hoa hồng mặc định sẽ được áp dụng cho các chuyên khoa chưa có cài đặt riêng. 
            Bạn có thể điều chỉnh tỷ lệ cho từng chuyên khoa bên dưới.
          </p>
        </div>
      </div>

      {/* Specialty Rates */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tỷ lệ theo chuyên khoa</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Chuyên khoa</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">Số lượt khám</th>
                <th className="text-center py-3 px-4 font-medium text-gray-600">Tỷ lệ hoa hồng (%)</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Dự kiến/lượt</th>
              </tr>
            </thead>
            <tbody>
              {settings.specialtyRates.map((specialty) => {
                const avgFee = 400000; // Giả định phí khám trung bình
                const estimatedCommission = (avgFee * specialty.rate) / 100;
                return (
                  <tr key={specialty.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{specialty.name}</td>
                    <td className="py-3 px-4 text-center text-gray-600">{specialty.appointmentCount}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <input
                          type="range"
                          value={specialty.rate}
                          onChange={(e) => updateSpecialtyRate(specialty.id, e.target.value)}
                          min={settings.minCommissionRate}
                          max={settings.maxCommissionRate}
                          className="w-24"
                        />
                        <input
                          type="number"
                          value={specialty.rate}
                          onChange={(e) => updateSpecialtyRate(specialty.id, e.target.value)}
                          min={settings.minCommissionRate}
                          max={settings.maxCommissionRate}
                          className="w-16 px-2 py-1 border rounded text-center"
                        />
                        <span className="text-gray-500">%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {formatCurrency(estimatedCommission)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700">
            Thay đổi tỷ lệ hoa hồng sẽ chỉ áp dụng cho các lịch khám mới. 
            Các lịch khám đã đặt trước đó sẽ giữ nguyên tỷ lệ cũ.
          </p>
        </div>
      </div>
    </div>
  );
}
