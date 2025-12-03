import { useState, useEffect } from 'react';
import { FileText, Download, Eye, Calendar, User, Activity, X, Search, Filter, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      // TODO: Call API
      await new Promise(resolve => setTimeout(resolve, 500));
      setRecords([
        {
          id: 1,
          doctorName: 'BS. Nguyễn Văn An',
          specialty: 'Tim mạch',
          date: '2025-01-10',
          diagnosis: 'Tăng huyết áp độ 1',
          symptoms: 'Đau đầu, chóng mặt, huyết áp cao',
          prescription: [
            { name: 'Amlodipine 5mg', dosage: '1 viên/ngày', duration: '30 ngày' },
            { name: 'Aspirin 81mg', dosage: '1 viên/ngày', duration: '30 ngày' }
          ],
          notes: 'Theo dõi huyết áp hàng ngày, tái khám sau 1 tháng',
          type: 'examination',
          attachments: ['xetnghiem_mau.pdf', 'dien_tim.pdf']
        },
        {
          id: 2,
          doctorName: 'BS. Trần Thị Bình',
          specialty: 'Da liễu',
          date: '2025-01-05',
          diagnosis: 'Viêm da cơ địa',
          symptoms: 'Ngứa, mẩn đỏ vùng tay, chân',
          prescription: [
            { name: 'Hydrocortisone cream 1%', dosage: 'Bôi 2 lần/ngày', duration: '14 ngày' },
            { name: 'Cetirizine 10mg', dosage: '1 viên tối', duration: '14 ngày' }
          ],
          notes: 'Tránh tiếp xúc với chất gây dị ứng, giữ ẩm da',
          type: 'examination',
          attachments: []
        },
        {
          id: 3,
          doctorName: 'BS. Lê Minh Châu',
          specialty: 'Nội tổng quát',
          date: '2024-12-20',
          diagnosis: 'Khám sức khỏe định kỳ - Bình thường',
          symptoms: 'Không có triệu chứng',
          prescription: [],
          notes: 'Sức khỏe tổng quát tốt. Khuyên duy trì chế độ ăn uống lành mạnh và tập thể dục.',
          type: 'checkup',
          attachments: ['ketqua_tongquat.pdf', 'xquang_nguc.pdf', 'sieu_am_bung.pdf']
        },
        {
          id: 4,
          doctorName: 'BS. Hoàng Văn Em',
          specialty: 'Thần kinh',
          date: '2024-12-15',
          diagnosis: 'Đau nửa đầu Migraine',
          symptoms: 'Đau đầu dữ dội một bên, buồn nôn, nhạy cảm với ánh sáng',
          prescription: [
            { name: 'Sumatriptan 50mg', dosage: 'Uống khi đau đầu', duration: 'Theo nhu cầu' },
            { name: 'Paracetamol 500mg', dosage: '1-2 viên khi đau', duration: 'Theo nhu cầu' }
          ],
          notes: 'Ghi nhận các yếu tố kích hoạt. Tái khám nếu cơn đau tăng tần suất.',
          type: 'examination',
          attachments: ['mri_nao.pdf']
        }
      ]);
    } catch (error) {
      toast.error('Không thể tải hồ sơ bệnh án');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record => {
    const matchSearch = record.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       record.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || record.type === filterType;
    return matchSearch && matchType;
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const typeLabels = {
    examination: { label: 'Khám bệnh', color: 'bg-blue-100 text-blue-800' },
    checkup: { label: 'Khám định kỳ', color: 'bg-green-100 text-green-800' }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hồ sơ bệnh án</h1>
        <p className="text-gray-500">Xem lịch sử khám bệnh và đơn thuốc</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo bác sĩ, chẩn đoán..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="all">Tất cả loại</option>
            <option value="examination">Khám bệnh</option>
            <option value="checkup">Khám định kỳ</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Records List */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border">
            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">Chưa có hồ sơ bệnh án nào</p>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div key={record.id} className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Main Info */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{record.diagnosis}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeLabels[record.type].color}`}>
                          {typeLabels[record.type].label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {record.doctorName} - {record.specialty}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(record.date)}
                        </div>
                      </div>
                      {record.prescription.length > 0 && (
                        <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                          <Activity className="w-4 h-4" />
                          {record.prescription.length} loại thuốc được kê
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      Xem chi tiết
                    </button>
                    {record.attachments.length > 0 && (
                      <button className="flex items-center gap-1 px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm font-medium">
                        <Download className="w-4 h-4" />
                        Tải về
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Chi tiết hồ sơ bệnh án</h3>
              <button onClick={() => setSelectedRecord(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4 pb-4 border-b">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedRecord.doctorName}</h4>
                  <p className="text-gray-500">{selectedRecord.specialty}</p>
                  <p className="text-sm text-gray-400">{formatDate(selectedRecord.date)}</p>
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Chẩn đoán</h5>
                <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{selectedRecord.diagnosis}</p>
              </div>

              {/* Symptoms */}
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Triệu chứng</h5>
                <p className="text-gray-700">{selectedRecord.symptoms}</p>
              </div>

              {/* Prescription */}
              {selectedRecord.prescription.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Đơn thuốc</h5>
                  <div className="space-y-2">
                    {selectedRecord.prescription.map((med, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium text-gray-900">{med.name}</p>
                        <p className="text-sm text-gray-600">Liều dùng: {med.dosage}</p>
                        <p className="text-sm text-gray-600">Thời gian: {med.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedRecord.notes && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Ghi chú từ bác sĩ</h5>
                  <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">{selectedRecord.notes}</p>
                </div>
              )}

              {/* Attachments */}
              {selectedRecord.attachments.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Tài liệu đính kèm</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecord.attachments.map((file, index) => (
                      <button
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
                      >
                        <FileText className="w-4 h-4 text-gray-500" />
                        {file}
                        <Download className="w-4 h-4 text-blue-500" />
                      </button>
                    ))}
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
