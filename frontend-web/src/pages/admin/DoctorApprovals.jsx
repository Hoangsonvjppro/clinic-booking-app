import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, User, FileText, Eye, Search, Filter, ChevronDown, X, Calendar, Award, Briefcase, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllApplications, approveDoctor, rejectDoctor } from '../../api/doctorApi';

const statusConfig = {
  PENDING: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800' },
  APPROVED: { label: 'Đã duyệt', color: 'bg-green-100 text-green-800' },
  REJECTED: { label: 'Từ chối', color: 'bg-red-100 text-red-800' }
};

export default function DoctorApprovals() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [apiNotAvailable, setApiNotAvailable] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setApiNotAvailable(false);
    try {
      const response = await getAllApplications();
      const data = response.data || [];
      // Transform API response to match UI format
      const transformedData = data.map(app => ({
        id: app.id,
        fullName: app.name || 'N/A',
        email: app.hospitalEmail || 'N/A',
        phone: app.phone || 'N/A',
        specialty: app.specialty || 'Chưa xác định',
        licenseNumber: app.licenseNumber || 'N/A',
        hospital: app.address || 'N/A',
        experience: app.yearsOfExperience || 0,
        education: app.education || 'N/A',
        bio: app.description || '',
        documents: app.certificates || [],
        submittedAt: app.createdAt,
        status: app.status || 'PENDING',
        userId: app.userId
      }));
      setApplications(transformedData);
    } catch (error) {
      console.error('Error fetching applications:', error);
      if (error.response?.status === 404 || error.response?.status === 502) {
        setApiNotAvailable(true);
      } else {
        toast.error('Không thể tải danh sách đơn đăng ký');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveDoctor(id);
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status: 'APPROVED', approvedAt: new Date().toISOString().split('T')[0] } : app
      ));
      toast.success('Đã phê duyệt đơn đăng ký');
      setSelectedApp(null);
    } catch (error) {
      console.error('Error approving doctor:', error);
      toast.error('Không thể phê duyệt');
    }
  };

  const handleReject = async (id) => {
    if (!rejectReason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }
    try {
      await rejectDoctor(id);
      setApplications(applications.map(app => 
        app.id === id ? { 
          ...app, 
          status: 'REJECTED', 
          rejectedAt: new Date().toISOString().split('T')[0],
          rejectReason 
        } : app
      ));
      toast.success('Đã từ chối đơn đăng ký');
      setSelectedApp(null);
      setRejectReason('');
    } catch (error) {
      console.error('Error rejecting doctor:', error);
      toast.error('Không thể từ chối');
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchFilter = filter === 'all' || app.status === filter;
    const matchSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       app.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  const pendingCount = applications.filter(a => a.status === 'PENDING').length;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (apiNotAvailable) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Phê duyệt bác sĩ</h1>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Tính năng đang phát triển</h3>
          <p className="text-gray-500 mt-2">API duyệt bác sĩ đang được xây dựng.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Phê duyệt bác sĩ</h1>
        <p className="text-gray-500">
          {pendingCount > 0 ? `Có ${pendingCount} đơn đăng ký đang chờ duyệt` : 'Không có đơn nào chờ duyệt'}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, chuyên khoa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
          >
            <option value="all">Tất cả</option>
            <option value="PENDING">Chờ duyệt</option>
            <option value="APPROVED">Đã duyệt</option>
            <option value="REJECTED">Từ chối</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border">
            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">Không có đơn đăng ký nào</p>
          </div>
        ) : (
          filteredApplications.map((app) => (
            <div key={app.id} className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Doctor Info */}
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="w-7 h-7 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{app.fullName}</h3>
                      <p className="text-sm text-gray-500">{app.specialty}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>{app.email}</span>
                        <span>{app.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Date */}
                  <div className="flex flex-col items-start md:items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[app.status].color}`}>
                      {statusConfig[app.status].label}
                    </span>
                    <span className="text-sm text-gray-400">
                      Nộp ngày {formatDate(app.submittedAt)}
                    </span>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    {app.experience} năm kinh nghiệm
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Award className="w-4 h-4" />
                    {app.education}
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <FileText className="w-4 h-4" />
                    {app.documents.length} tài liệu
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="flex items-center gap-1 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    Xem chi tiết
                  </button>
                  {app.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleApprove(app.id)}
                        className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Phê duyệt
                      </button>
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setRejectReason('');
                        }}
                        className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                      >
                        <XCircle className="w-4 h-4" />
                        Từ chối
                      </button>
                    </>
                  )}
                </div>

                {/* Reject Reason */}
                {app.status === 'REJECTED' && app.rejectReason && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">
                      <strong>Lý do từ chối:</strong> {app.rejectReason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Chi tiết đơn đăng ký</h3>
              <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4 pb-4 border-b">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">{selectedApp.fullName}</h4>
                  <p className="text-gray-500">{selectedApp.specialty}</p>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig[selectedApp.status].color}`}>
                    {statusConfig[selectedApp.status].label}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Thông tin liên hệ</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="text-gray-900">{selectedApp.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Điện thoại:</span>
                    <p className="text-gray-900">{selectedApp.phone}</p>
                  </div>
                </div>
              </div>

              {/* Professional Info */}
              <div>
                <h5 className="font-medium text-gray-900 mb-3">Thông tin chuyên môn</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Số giấy phép hành nghề:</span>
                    <p className="text-gray-900">{selectedApp.licenseNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Nơi công tác:</span>
                    <p className="text-gray-900">{selectedApp.hospital}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Kinh nghiệm:</span>
                    <p className="text-gray-900">{selectedApp.experience} năm</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Học vấn:</span>
                    <p className="text-gray-900">{selectedApp.education}</p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Giới thiệu bản thân</h5>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedApp.bio}</p>
              </div>

              {/* Documents */}
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Tài liệu đính kèm</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedApp.documents.map((doc, index) => (
                    <button
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
                    >
                      <FileText className="w-4 h-4 text-gray-500" />
                      {doc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reject Form */}
              {selectedApp.status === 'PENDING' && (
                <div className="pt-4 border-t">
                  <h5 className="font-medium text-gray-900 mb-2">Từ chối đơn đăng ký</h5>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Nhập lý do từ chối..."
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 resize-none"
                  />
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => handleApprove(selectedApp.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Phê duyệt
                    </button>
                    <button
                      onClick={() => handleReject(selectedApp.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                    >
                      <XCircle className="w-4 h-4" />
                      Từ chối
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
