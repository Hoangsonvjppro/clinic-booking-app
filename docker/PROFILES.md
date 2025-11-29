# Docker Compose Profiles - Quick Reference

Tổ chức docker compose với profiles để dễ quản lý và kiểm soát.

## 📋 Profiles Available

- **`gateway`** - API Gateway (1 container)
- **`services`** - All Microservices (6 containers: Auth, Doctor, Patient, Appointment, Payment, Notification)
- **`databases`** - All PostgreSQL Databases (6 containers)
- **`frontend`** - Frontend Web Application (1 container)
- **`monitoring`** - Monitoring Stack (3 containers: Redis, Prometheus, Grafana)

---

## 🚀 Usage Commands

### Start All (Recommended for Development)

```bash
cd docker
docker compose --profile gateway --profile services --profile databases --profile frontend --profile monitoring up -d
```

### Start by Groups

```bash
# Start only databases
docker compose --profile databases up -d

# Start databases + services
docker compose --profile databases --profile services up -d

# Start full application (without monitoring)
docker compose --profile gateway --profile services --profile databases --profile frontend up -d

# Start everything
docker compose --profile gateway --profile services --profile databases --profile frontend --profile monitoring up -d
```

### Build and Start

```bash
# Build and start specific profiles
docker compose --profile databases --profile services up -d --build

# Build all
docker compose --profile gateway --profile services --profile databases --profile frontend --profile monitoring up -d --build
```

### Stop Specific Groups

```bash
# Stop only services (databases keep running)
docker compose --profile services stop

# Stop everything
docker compose down
```

---

## 📊 Container Grouping

### Gateway (1 container)
- `api-gateway` (port 8080)

### Services (6 containers)
- `Auth` - auth-service (port 8081)
- `Doctor` - doctor-service (port 8082)
- `Patient` - patient-service (port 8083)
- `Appointment` - appointment-service (port 8084)
- `Payment` - payment-service (port 8085)
- `Notification` - notification-service (port 8086)

### Databases (6 containers)
- `postgres-auth` (port 5433) - DB: `auth`
- `postgres-doctor` (port 5434) - DB: `doctor`
- `postgres-patient` (port 5435) - DB: `patient`
- `postgres-appointment` (port 5436) - DB: `appointment`
- `postgres-payment` (port 5437) - DB: `payment`
- `postgres-notification` (port 5438) - DB: `notification`

### Frontend (1 container)
- `frontend-web` (port 5173)

### Monitoring (3 containers)
- `redis` (port 6380)
- `prometheus` (port 9091)
- `grafana` (port 3001)

---

## 💡 Common Scenarios

### Development - Full Stack
```bash
docker compose --profile gateway --profile services --profile databases --profile frontend up -d
```

### Testing - Services Only
```bash
# Start databases first
docker compose --profile databases up -d

# Then start specific services
docker compose --profile services up -d
```

### Production-like - With Monitoring
```bash
docker compose --profile gateway --profile services --profile databases --profile frontend --profile monitoring up -d
```

### Frontend Development - Services + DBs + Frontend
```bash
docker compose --profile services --profile databases --profile frontend up -d
```

---

## 🔍 Useful Commands

### View Running Containers by Profile

```bash
# See all containers
docker compose ps

# See only databases
docker compose --profile databases ps

# See services status
docker compose --profile services ps
```

### Logs by Group

```bash
# All services logs
docker compose --profile services logs -f

# All databases logs
docker compose --profile databases logs -f

# Specific service
docker compose logs -f Auth
```

### Clean Up

```bash
# Stop and remove all containers
docker compose --profile gateway --profile services --profile databases --profile frontend --profile monitoring down

# Stop, remove, and delete volumes (CAREFUL: deletes all data)
docker compose --profile gateway --profile services --profile databases --profile frontend --profile monitoring down -v
```

---

## 🎯 Quick Start Alias (Optional)

Thêm vào `.bashrc` hoặc `.zshrc`:

```bash
# Full stack
alias dc-full='docker compose --profile gateway --profile services --profile databases --profile frontend --profile monitoring'

# App only (no monitoring)
alias dc-app='docker compose --profile gateway --profile services --profile databases --profile frontend'

# Services + DBs
alias dc-dev='docker compose --profile services --profile databases'
```

Sử dụng:
```bash
dc-full up -d
dc-app logs -f
dc-dev down
```

---

## ⚠️ Important Notes

> [!NOTE]
> Profiles không start tự động. Bạn phải chỉ định profile khi chạy lệnh.

> [!TIP]
> Để tiện lợi hơn, tạo script `start.sh`:
> ```bash
> #!/bin/bash
> docker compose --profile gateway --profile services --profile databases --profile frontend up -d "$@"
> ```
> 
> Sử dụng: `./start.sh --build`

> [!WARNING]
> Services phụ thuộc vào databases. Luôn start databases trước khi start services.
