// Complete Mock Data for Clinic Booking App
// All data is fake and used for frontend demonstration only

export const doctors = [
  {
    id: 1,
    name: "BS. Nguyễn Văn An",
    specialty: "Tim mạch",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    description: "Bác sĩ chuyên khoa Tim mạch với 15 năm kinh nghiệm",
    rating: 4.8,
    reviewCount: 234,
    availableDates: ["2025-11-28", "2025-11-29", "2025-12-01", "2025-12-02"],
    availableTimes: ["08:00", "09:00", "10:00", "14:00", "15:00", "16:00"]
  },
  {
    id: 2,
    name: "BS. Trần Thị Bình",
    specialty: "Da liễu",
    avatarUrl: "https://i.pravatar.cc/150?img=45",
    description: "Chuyên gia hàng đầu về điều trị da và thẩm mỹ",
    rating: 4.9,
    reviewCount: 189,
    availableDates: ["2025-11-28", "2025-11-30", "2025-12-01", "2025-12-03"],
    availableTimes: ["08:30", "09:30", "10:30", "14:30", "15:30", "16:30"]
  },
  {
    id: 3,
    name: "BS. Lê Minh Châu",
    specialty: "Nhi khoa",
    avatarUrl: "https://i.pravatar.cc/150?img=32",
    description: "Bác sĩ Nhi khoa tận tâm, yêu trẻ em",
    rating: 4.7,
    reviewCount: 312,
    availableDates: ["2025-11-27", "2025-11-28", "2025-11-29", "2025-12-01"],
    availableTimes: ["08:00", "09:00", "10:00", "13:30", "14:30", "15:30"]
  },
  {
    id: 4,
    name: "BS. Phạm Quốc Dũng",
    specialty: "Răng hàm mặt",
    avatarUrl: "https://i.pravatar.cc/150?img=68",
    description: "Chuyên gia Implant và thẩm mỹ nha khoa",
    rating: 4.9,
    reviewCount: 278,
    availableDates: ["2025-11-28", "2025-11-29", "2025-11-30", "2025-12-02"],
    availableTimes: ["08:00", "09:30", "11:00", "14:00", "15:30", "17:00"]
  },
  {
    id: 5,
    name: "BS. Võ Thị Hằng",
    specialty: "Sản phụ khoa",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
    description: "Chuyên khoa Sản với 12 năm kinh nghiệm",
    rating: 4.8,
    reviewCount: 201,
    availableDates: ["2025-11-27", "2025-11-29", "2025-12-01", "2025-12-03"],
    availableTimes: ["08:30", "09:30", "10:30", "13:30", "14:30", "16:00"]
  },
  {
    id: 6,
    name: "BS. Hoàng Minh Khôi",
    specialty: "Thần kinh",
    avatarUrl: "https://i.pravatar.cc/150?img=51",
    description: "Chuyên điều trị bệnh lý thần kinh não bộ",
    rating: 4.7,
    reviewCount: 156,
    availableDates: ["2025-11-28", "2025-11-30", "2025-12-02", "2025-12-04"],
    availableTimes: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]
  },
  {
    id: 7,
    name: "BS. Đặng Thị Mai",
    specialty: "Mắt",
    avatarUrl: "https://i.pravatar.cc/150?img=38",
    description: "Bác sĩ chuyên khoa Mắt, phẫu thuật cận thị",
    rating: 4.9,
    reviewCount: 223,
    availableDates: ["2025-11-27", "2025-11-28", "2025-11-30", "2025-12-01"],
    availableTimes: ["08:00", "09:00", "10:00", "14:00", "15:00"]
  },
  {
    id: 8,
    name: "BS. Bùi Văn Nam",
    specialty: "Tiêu hóa",
    avatarUrl: "https://i.pravatar.cc/150?img=56",
    description: "Chuyên điều trị các bệnh về dạ dày, gan mật",
    rating: 4.6,
    reviewCount: 178,
    availableDates: ["2025-11-28", "2025-11-29", "2025-12-01", "2025-12-03"],
    availableTimes: ["08:30", "09:30", "10:30", "14:30", "15:30", "16:30"]
  }
];

export const services = [
  {
    id: 1,
    name: "Khám răng",
    icon: "tooth",
    description: "Khám tổng quát răng miệng, làm sạch, điều trị sâu răng"
  },
  {
    id: 2,
    name: "Da liễu",
    icon: "heart-pulse",
    description: "Khám và điều trị các bệnh về da, mụn, nám, viêm da"
  },
  {
    id: 3,
    name: "Xét nghiệm",
    icon: "test-tube",
    description: "Xét nghiệm máu, nước tiểu, sinh hóa, miễn dịch"
  },
  {
    id: 4,
    name: "Lâm sàng",
    icon: "stethoscope",
    description: "Khám nội khoa, ngoại khoa, chẩn đoán bệnh tổng quát"
  },
  {
    id: 5,
    name: "Tư vấn sức khỏe",
    icon: "messages-square",
    description: "Tư vấn dinh dưỡng, lối sống, phòng bệnh"
  },
  {
    id: 6,
    name: "Chẩn đoán hình ảnh",
    icon: "scan",
    description: "Chụp X-quang, CT, MRI, siêu âm"
  },
  {
    id: 7,
    name: "Khám tim mạch",
    icon: "heart",
    description: "Khám và điều trị các bệnh về tim, mạch máu"
  },
  {
    id: 8,
    name: "Khám mắt",
    icon: "eye",
    description: "Khám thị lực, đo độ cận, viễn, điều trị bệnh mắt"
  }
];

export const notifications = [
  {
    id: 1,
    title: "Lịch hẹn sắp tới",
    content: "Bạn có lịch khám với BS. Nguyễn Văn An vào 09:00 ngày 28/11/2025",
    isRead: false,
    isStarred: true,
    date: "2025-11-27T10:30:00",
    type: "personal"
  },
  {
    id: 2,
    title: "Chương trình khuyến mãi",
    content: "Giảm 20% cho gói khám sức khỏe tổng quát trong tháng 12",
    isRead: false,
    isStarred: false,
    date: "2025-11-26T14:00:00",
    type: "global"
  },
  {
    id: 3,
    title: "Kết quả xét nghiệm đã có",
    content: "Kết quả xét nghiệm máu của bạn đã sẵn sàng. Nhấn để xem chi tiết",
    isRead: true,
    isStarred: true,
    date: "2025-11-25T09:15:00",
    type: "personal"
  },
  {
    id: 4,
    title: "Bài viết mới về sức khỏe",
    content: "10 cách phòng ngừa bệnh tim mạch hiệu quả",
    isRead: true,
    isStarred: false,
    date: "2025-11-24T16:45:00",
    type: "global"
  },
  {
    id: 5,
    title: "Nhắc nhở uống thuốc",
    content: "Đã đến giờ uống thuốc của bạn. Thuốc kháng sinh 500mg",
    isRead: false,
    isStarred: false,
    date: "2025-11-27T08:00:00",
    type: "personal"
  },
  {
    id: 6,
    title: "Đánh giá bác sĩ",
    content: "Hãy đánh giá trải nghiệm khám bệnh của bạn với BS. Trần Thị Bình",
    isRead: true,
    isStarred: false,
    date: "2025-11-23T11:20:00",
    type: "personal"
  },
  {
    id: 7,
    title: "Cập nhật hệ thống",
    content: "Hệ thống sẽ bảo trì từ 00:00 - 02:00 ngày 30/11/2025",
    isRead: false,
    isStarred: false,
    date: "2025-11-26T18:00:00",
    type: "global"
  }
];

export const medicalRecords = [
  {
    id: 1,
    date: "2025-11-20",
    diagnosis: "Viêm amidan cấp",
    doctorName: "BS. Nguyễn Văn An",
    specialty: "Tai Mũi Họng",
    prescription: [
      { name: "Amoxicillin 500mg", dosage: "2 viên/ngày", duration: "7 ngày" },
      { name: "Paracetamol 500mg", dosage: "Khi sốt", duration: "5 ngày" }
    ],
    notes: "Nghỉ ngơi, uống nhiều nước, tái khám sau 1 tuần nếu không thuyên giảm",
    attachments: ["xray_throat_20112025.pdf"]
  },
  {
    id: 2,
    date: "2025-10-15",
    diagnosis: "Viêm dạ dày",
    doctorName: "BS. Bùi Văn Nam",
    specialty: "Tiêu hóa",
    prescription: [
      { name: "Omeprazole 20mg", dosage: "1 viên/ngày trước ăn", duration: "14 ngày" },
      { name: "Gaviscon", dosage: "Sau bữa ăn", duration: "14 ngày" }
    ],
    notes: "Ăn nhẹ, tránh thức ăn cay nóng, không uống rượu bia",
    attachments: []
  },
  {
    id: 3,
    date: "2025-09-05",
    diagnosis: "Cận thị nhẹ",
    doctorName: "BS. Đặng Thị Mai",
    specialty: "Mắt",
    prescription: [
      { name: "Kính cận -1.5D", dosage: "Đeo thường xuyên", duration: "Lâu dài" }
    ],
    notes: "Nghỉ ngơi mắt 20 phút sau mỗi 2 giờ làm việc với màn hình. Tái khám sau 6 tháng",
    attachments: ["prescription_glasses_05092025.pdf"]
  },
  {
    id: 4,
    date: "2025-08-12",
    diagnosis: "Khám sức khỏe định kỳ",
    doctorName: "BS. Lê Minh Châu",
    specialty: "Khám tổng quát",
    prescription: [],
    notes: "Sức khỏe tốt. Chỉ số huyết áp, đường huyết trong ngưỡng bình thường. Tiếp tục duy trì lối sống lành mạnh",
    attachments: ["blood_test_12082025.pdf", "general_checkup_12082025.pdf"]
  },
  {
    id: 5,
    date: "2025-07-20",
    diagnosis: "Sâu răng",
    doctorName: "BS. Phạm Quốc Dũng",
    specialty: "Răng hàm mặt",
    prescription: [
      { name: "Ibuprofen 400mg", dosage: "Khi đau", duration: "3 ngày" }
    ],
    notes: "Đã trám răng số 36. Vệ sinh răng miệng 2 lần/ngày. Hạn chế đồ ngọt",
    attachments: []
  }
];

export const userProfile = {
  id: 1,
  name: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  phone: "0901234567",
  age: 28,
  dateOfBirth: "1997-05-15",
  address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
  gender: "Nam",
  bloodType: "O+",
  allergies: ["Penicillin"],
  emergencyContact: {
    name: "Nguyễn Thị B",
    relationship: "Vợ",
    phone: "0907654321"
  },
  insurance: {
    provider: "Bảo hiểm Y tế Xã hội",
    number: "DN1234567890",
    expiryDate: "2026-12-31"
  },
  avatarUrl: "https://i.pravatar.cc/150?img=33"
};

export const newsArticles = [
  {
    id: 1,
    title: "10 Thói Quen Tốt Cho Sức Khỏe Tim Mạch",
    excerpt: "Khám phá những thói quen đơn giản nhưng hiệu quả để bảo vệ trái tim của bạn...",
    imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&h=600&fit=crop",
    category: "Tim mạch",
    date: "2025-11-25",
    author: "BS. Nguyễn Văn An",
    readTime: "5 phút"
  },
  {
    id: 2,
    title: "Chăm Sóc Da Mùa Hè: Bí Quyết Từ Chuyên Gia",
    excerpt: "Làm thế nào để bảo vệ làn da khỏi tác hại của ánh nắng mặt trời...",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop",
    category: "Da liễu",
    date: "2025-11-24",
    author: "BS. Trần Thị Bình",
    readTime: "7 phút"
  },
  {
    id: 3,
    title: "Dinh Dưỡng Cho Trẻ Em: Những Điều Cha Mẹ Cần Biết",
    excerpt: "Hướng dẫn chi tiết về chế độ dinh dưỡng cân bằng cho trẻ từ 1-10 tuổi...",
    imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=600&fit=crop",
    category: "Nhi khoa",
    date: "2025-11-22",
    author: "BS. Lê Minh Châu",
    readTime: "8 phút"
  },
  {
    id: 4,
    title: "Làm Sao Để Có Nụ Cười Tự Tin?",
    excerpt: "Tìm hiểu về các phương pháp làm trắng răng an toàn và hiệu quả...",
    imageUrl: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&h=600&fit=crop",
    category: "Nha khoa",
    date: "2025-11-20",
    author: "BS. Phạm Quốc Dũng",
    readTime: "6 phút"
  },
  {
    id: 5,
    title: "Yoga Và Sức Khỏe Tinh Thần",
    excerpt: "Khám phá lợi ích của yoga đối với sức khỏe tâm lý và thể chất...",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop",
    category: "Sức khỏe tâm lý",
    date: "2025-11-18",
    author: "BS. Võ Thị Hằng",
    readTime: "10 phút"
  },
  {
    id: 6,
    title: "Phòng Ngừa Đột Quỵ: Những Dấu Hiệu Cảnh Báo",
    excerpt: "Nhận biết sớm các dấu hiệu đột quỵ có thể cứu sống bạn...",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
    category: "Thần kinh",
    date: "2025-11-15",
    author: "BS. Hoàng Minh Khôi",
    readTime: "6 phút"
  }
];

// Time slots for booking
export const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "13:30", "14:00", "14:30", "15:00",
  "15:30", "16:00", "16:30", "17:00"
];

// Available dates (next 14 days)
export const getAvailableDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

export default {
  doctors,
  services,
  notifications,
  medicalRecords,
  userProfile,
  newsArticles,
  timeSlots,
  getAvailableDates
};
