import { useState, useEffect } from 'react';
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  CameraIcon,
  ShieldCheckIcon,
  KeyIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    address: user?.address || '',
    gender: user?.gender || '',
    bloodType: user?.bloodType || '',
    emergencyContact: user?.emergencyContact || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        address: user.address || '',
        gender: user.gender || '',
        bloodType: user.bloodType || '',
        emergencyContact: user.emergencyContact || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Call API to update profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    setLoading(true);
    try {
      // TODO: Call API to change password
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password changed successfully');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-600 mt-1">Manage your personal information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          {/* Cover & Avatar */}
          <div className="relative h-32 bg-gradient-to-r from-primary-600 to-primary-700">
            <div className="absolute -bottom-12 left-8">
              <div className="relative">
                {user?.avatarUrl ? (
                  <img 
                    src={user.avatarUrl} 
                    alt={user.fullName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                    {profileData.fullName?.charAt(0) || 'U'}
                  </div>
                )}
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white hover:bg-slate-800 transition-colors">
                  <CameraIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Edit Button */}
            <div className="absolute top-4 right-4">
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 bg-white text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-all flex items-center gap-2"
                  >
                    {loading ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      <CheckIcon className="w-5 h-5" />
                    )}
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-medium transition-all flex items-center gap-2"
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-16 px-8 pb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">{profileData.fullName || 'Your Name'}</h2>
              <p className="text-slate-500">{profileData.email}</p>
            </div>

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="input-label flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <p className="py-3 text-slate-900">{profileData.fullName || '-'}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="input-label flex items-center gap-2">
                  <EnvelopeIcon className="w-4 h-4 text-slate-400" />
                  Email Address
                </label>
                <p className="py-3 text-slate-900">{profileData.email}</p>
                <p className="text-xs text-slate-500">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label className="input-label flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4 text-slate-400" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="+1 (555) 000-0000"
                  />
                ) : (
                  <p className="py-3 text-slate-900">{profileData.phone || '-'}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="input-label flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-slate-400" />
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profileData.dateOfBirth}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                ) : (
                  <p className="py-3 text-slate-900">{profileData.dateOfBirth || '-'}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="input-label">Gender</label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={profileData.gender}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <p className="py-3 text-slate-900 capitalize">{profileData.gender || '-'}</p>
                )}
              </div>

              {/* Blood Type */}
              <div>
                <label className="input-label">Blood Type</label>
                {isEditing ? (
                  <select
                    name="bloodType"
                    value={profileData.bloodType}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Select blood type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                ) : (
                  <p className="py-3 text-slate-900">{profileData.bloodType || '-'}</p>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="input-label flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4 text-slate-400" />
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    rows={2}
                    className="input-field resize-none"
                    placeholder="Enter your address"
                  />
                ) : (
                  <p className="py-3 text-slate-900">{profileData.address || '-'}</p>
                )}
              </div>

              {/* Emergency Contact */}
              <div className="md:col-span-2">
                <label className="input-label flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4 text-slate-400" />
                  Emergency Contact
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={profileData.emergencyContact}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Emergency contact phone number"
                  />
                ) : (
                  <p className="py-3 text-slate-900">{profileData.emergencyContact || '-'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-xl shadow-card mt-6 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-primary-600" />
            Security
          </h3>
          
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <KeyIcon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Password</p>
                <p className="text-sm text-slate-500">Last changed 30 days ago</p>
              </div>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="btn-outline py-2 px-4 text-sm"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl animate-slide-up">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Change Password</h3>
            
            <div className="space-y-4">
              <div>
                <label className="input-label">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="input-field"
                  placeholder="Enter current password"
                />
              </div>
              
              <div>
                <label className="input-label">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="input-field"
                  placeholder="Enter new password"
                />
              </div>
              
              <div>
                <label className="input-label">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="input-field"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="flex-1 btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={loading}
                className="flex-1 btn-primary"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}