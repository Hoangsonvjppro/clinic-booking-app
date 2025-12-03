import { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Save, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const DAYS_OF_WEEK = [
  { id: 0, name: 'Chủ nhật', short: 'CN' },
  { id: 1, name: 'Thứ 2', short: 'T2' },
  { id: 2, name: 'Thứ 3', short: 'T3' },
  { id: 3, name: 'Thứ 4', short: 'T4' },
  { id: 4, name: 'Thứ 5', short: 'T5' },
  { id: 5, name: 'Thứ 6', short: 'T6' },
  { id: 6, name: 'Thứ 7', short: 'T7' },
];

const TIME_SLOTS = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

export default function DoctorSchedule() {
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      // TODO: Call actual API
      // const response = await api.get('/api/v1/doctors/me/schedule');
      // setSchedule(response.data);
      
      // Mock data - schedule by day of week
      setSchedule({
        1: [{ start: '08:00', end: '11:30' }, { start: '14:00', end: '17:00' }],
        2: [{ start: '08:00', end: '11:30' }, { start: '14:00', end: '17:00' }],
        3: [{ start: '08:00', end: '11:30' }],
        4: [{ start: '08:00', end: '11:30' }, { start: '14:00', end: '17:00' }],
        5: [{ start: '14:00', end: '17:00' }],
        6: [{ start: '08:00', end: '11:30' }],
      });
    } catch (error) {
      console.error('Error fetching schedule:', error);
      toast.error('Không thể tải lịch làm việc');
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = (dayId) => {
    setSchedule(prev => ({
      ...prev,
      [dayId]: [...(prev[dayId] || []), { start: '08:00', end: '11:30' }]
    }));
  };

  const removeTimeSlot = (dayId, index) => {
    setSchedule(prev => ({
      ...prev,
      [dayId]: prev[dayId].filter((_, i) => i !== index)
    }));
  };

  const updateTimeSlot = (dayId, index, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [dayId]: prev[dayId].map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Call actual API
      // await api.put('/api/v1/doctors/me/schedule', schedule);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Đã lưu lịch làm việc');
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error('Không thể lưu lịch làm việc');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lịch làm việc</h1>
          <p className="text-gray-500">Thiết lập giờ làm việc hàng tuần của bạn</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="divide-y">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day.id} className="p-4">
              <div className="flex items-start gap-4">
                {/* Day name */}
                <div className="w-24 pt-2">
                  <span className={`font-medium ${schedule[day.id]?.length > 0 ? 'text-gray-900' : 'text-gray-400'}`}>
                    {day.name}
                  </span>
                </div>

                {/* Time slots */}
                <div className="flex-1 space-y-2">
                  {schedule[day.id]?.length > 0 ? (
                    schedule[day.id].map((slot, index) => (
                      <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <select
                          value={slot.start}
                          onChange={(e) => updateTimeSlot(day.id, index, 'start', e.target.value)}
                          className="px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {TIME_SLOTS.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                        <span className="text-gray-500">đến</span>
                        <select
                          value={slot.end}
                          onChange={(e) => updateTimeSlot(day.id, index, 'end', e.target.value)}
                          className="px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {TIME_SLOTS.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => removeTimeSlot(day.id, index)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 py-2">Không làm việc</p>
                  )}
                  
                  <button
                    onClick={() => addTimeSlot(day.id)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm ca làm việc
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">Lưu ý</h3>
            <p className="text-sm text-blue-700 mt-1">
              Lịch làm việc sẽ được áp dụng cho các tuần tiếp theo. 
              Bệnh nhân chỉ có thể đặt lịch trong các khung giờ bạn đã thiết lập.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
