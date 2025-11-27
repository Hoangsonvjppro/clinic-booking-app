import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Save, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser, isLoggedIn } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user || {});

  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-sky-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-all"
            >
              <Edit2 className="w-4 h-4" />
              <span>Chỉnh sửa</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
              >
                <X className="w-4 h-4" />
                <span>Hủy</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Lưu</span>
              </button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Cover & Avatar */}
          <div className="relative h-32 bg-gradient-to-r from-sky-400 to-sky-600">
            <div className="absolute -bottom-16 left-8">
              <img
                src={formData.avatarUrl}
                alt={formData.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="pt-20 px-8 pb-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-1">{formData.name}</h1>
            <p className="text-gray-600 mb-6">{formData.email}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Thông Tin Cá Nhân
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    ) : (
                      <p className="text-slate-800">{formData.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    ) : (
                      <p className="text-slate-800">{formData.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tuổi
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleChange('age', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    ) : (
                      <p className="text-slate-800">{formData.age} tuổi</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giới tính
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.gender}
                        onChange={(e) => handleChange('gender', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    ) : (
                      <p className="text-slate-800">{formData.gender}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ
                    </label>
                    {isEditing ? (
                      <textarea
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      ></textarea>
                    ) : (
                      <p className="text-slate-800">{formData.address}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Medical Info */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Thông Tin Y Tế
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nhóm máu
                    </label>
                    <p className="text-slate-800">{formData.bloodType}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dị ứng
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {formData.allergies?.map((allergy, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-sky-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800 mb-2">Liên hệ khẩn cấp</h4>
                    <p className="text-sm text-gray-700">
                      <strong>Tên:</strong> {formData.emergencyContact?.name}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Quan hệ:</strong> {formData.emergencyContact?.relationship}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>SĐT:</strong> {formData.emergencyContact?.phone}
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-800 mb-2">Bảo hiểm y tế</h4>
                    <p className="text-sm text-gray-700">
                      <strong>Nhà cung cấp:</strong> {formData.insurance?.provider}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Số thẻ:</strong> {formData.insurance?.number}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Hạn sử dụng:</strong> {formData.insurance?.expiryDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
