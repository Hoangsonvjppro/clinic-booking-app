# Docker Scripts - Hướng dẫn sử dụng

## 📁 Danh sách scripts

| Script | Mô tả |
|--------|-------|
| `start-all.ps1` | Khởi động toàn bộ hệ thống |
| `stop-all.ps1` | Dừng tất cả services |
| `reset-all.ps1` | **XÓA TẤT CẢ** (bao gồm databases) và build lại từ đầu |
| `rebuild-all.ps1` | Build và run lại toàn bộ, **GIỮ NGUYÊN databases** |
| `rebuild-backend.ps1` | Rebuild tất cả backend services |
| `rebuild-frontend.ps1` | Rebuild frontend |
| `rebuild-service.ps1` | Rebuild một service cụ thể |
| `rebuild-auth.ps1` | Rebuild Auth Service |
| `rebuild-doctor.ps1` | Rebuild Doctor Service |
| `rebuild-patient.ps1` | Rebuild Patient Service |
| `rebuild-appointment.ps1` | Rebuild Appointment Service |
| `rebuild-payment.ps1` | Rebuild Payment Service |
| `rebuild-notification.ps1` | Rebuild Notification Service |
| `rebuild-gateway.ps1` | Rebuild API Gateway |
| `logs.ps1` | Xem logs của services |

---

## 🚀 Cách sử dụng

### Khởi động hệ thống lần đầu
```powershell
cd docker
.\start-all.ps1
```

### Dừng hệ thống
```powershell
.\stop-all.ps1
```

### Reset hoàn toàn (xóa hết dữ liệu)
```powershell
.\reset-all.ps1
# Hoặc skip xác nhận:
.\reset-all.ps1 -SkipConfirm
```

### Rebuild toàn bộ (giữ database)
```powershell
.\rebuild-all.ps1
```

### Rebuild backend services
```powershell
.\rebuild-backend.ps1
```

### Rebuild một service cụ thể
```powershell
# Cách 1: Dùng script riêng
.\rebuild-auth.ps1
.\rebuild-doctor.ps1
.\rebuild-patient.ps1
.\rebuild-appointment.ps1
.\rebuild-payment.ps1
.\rebuild-notification.ps1
.\rebuild-gateway.ps1

# Cách 2: Dùng script chung với tham số
.\rebuild-service.ps1 -Service auth
.\rebuild-service.ps1 -Service doctor
```

### Rebuild frontend
```powershell
.\rebuild-frontend.ps1
```

### Xem logs
```powershell
# Logs tất cả services
.\logs.ps1

# Logs một service cụ thể
.\logs.ps1 -Service auth
.\logs.ps1 -Service doctor

# Logs realtime (follow)
.\logs.ps1 -Service auth -Follow

# Logs với số dòng tùy chỉnh
.\logs.ps1 -Service auth -Tail 200
```

---

## 📊 Thông tin ports

| Service | Port |
|---------|------|
| Frontend | 5173 |
| API Gateway | 8080 |
| Auth Service | 8081 |
| Doctor Service | 8082 |
| Patient Service | 8083 |
| Appointment Service | 8084 |
| Payment Service | 8085 |
| Notification Service | 8086 |
| Prometheus | 9091 |
| Grafana | 3001 |

### Database Ports (PostgreSQL)
| Database | Port |
|----------|------|
| postgres-auth | 5433 |
| postgres-doctor | 5434 |
| postgres-patient | 5435 |
| postgres-appointment | 5436 |
| postgres-payment | 5437 |
| postgres-notification | 5438 |

---

## ⚠️ Lưu ý quan trọng

1. **`reset-all.ps1`** sẽ XÓA TẤT CẢ dữ liệu bao gồm databases. Chỉ sử dụng khi muốn làm mới hoàn toàn.

2. **`rebuild-all.ps1`** sẽ giữ nguyên dữ liệu databases, chỉ rebuild và restart services.

3. Các script rebuild service sẽ tự động kiểm tra và khởi động database tương ứng nếu chưa chạy.

4. Khi rebuild backend, databases vẫn tiếp tục chạy.

---

## 💡 Tips

- Nếu gặp lỗi connection refused, hãy đợi thêm vài giây để services khởi động hoàn tất.
- Sử dụng `.\logs.ps1 -Service <service> -Follow` để theo dõi logs realtime khi debug.
- Nếu cần clean docker hoàn toàn: `docker system prune -a --volumes`
