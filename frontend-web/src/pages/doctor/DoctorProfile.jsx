import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Award, Camera, Save, Briefcase } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function DoctorProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // TODO: Call actual API
      // const response = await api.get('/api/v1/doctors/me/profile');
      // setProfile(response.data);
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      // Mock data
      setProfile({
        id: user.id,
        fullName: user.fullName || 'BS. Nguyễn Văn An',
        email: user.email || 'doctor@clinic.com',
        phone: '0901234567',
        specialty: 'Tim mạch',
        experience: 10,
        education: 'Đại học Y Hà Nội',
        certifications: ['Chứng chỉ hành nghề', 'Chuyên khoa I Tim mạch'],
        bio: 'Bác sĩ chuyên khoa Tim mạch với hơn 10 năm kinh nghiệm. Từng công tác tại Bệnh viện Bạch Mai.',
        consultationFee: 300000,
        address: 'Quận 1, TP.HCM',
        avatar: null
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Không thể tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Call actual API
      // await api.put('/api/v1/doctors/me/profile', profile);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Đã cập nhật hồ sơ');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Không thể cập nhật hồ sơ');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hồ sơ bác sĩ</h1>
          <p className="text-gray-500">Quản lý thông tin cá nhân và chuyên môn</p>
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Chỉnh sửa
          </button>
        )}
      </div>

      {/* Avatar & Basic Info */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
              {profile.fullName?.charAt(0) || 'D'}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 p-2 bg-white border rounded-full shadow-sm hover:bg-gray-50">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-1 space-y-4">
            <div>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="text-2xl font-bold text-gray-900 border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-900">{profile.fullName}</h2>
              )}
              <p className="text-blue-600 font-medium">{profile.specialty}</p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <span>{profile.phone}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  />
                ) : (
                  <span>{profile.address}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Info */}
      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Thông tin chuyên môn</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên khoa</label>
            {isEditing ? (
              <input
                type="text"
                value={profile.specialty}
                onChange={(e) => handleChange('specialty', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profile.specialty}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kinh nghiệm</label>
            {isEditing ? (
              <input
                type="number"
                value={profile.experience}
                onChange={(e) => handleChange('experience', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profile.experience} năm</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trường đào tạo</label>
            {isEditing ? (
              <input
                type="text"
                value={profile.education}
                onChange={(e) => handleChange('education', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profile.education}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phí khám</label>
            {isEditing ? (
              <input
                type="number"
                value={profile.consultationFee}
                onChange={(e) => handleChange('consultationFee', parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profile.consultationFee?.toLocaleString('vi-VN')} VNĐ</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Giới thiệu</label>
          {isEditing ? (
            <textarea
              value={profile.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <p className="text-gray-700">{profile.bio}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Chứng chỉ</label>
          <div className="flex flex-wrap gap-2">
            {profile.certifications?.map((cert, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                <Award className="w-3 h-3 inline mr-1" />
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
