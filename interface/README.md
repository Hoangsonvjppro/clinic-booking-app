# Clinic Booking App

A modern, responsive clinic booking application built with React, Vite, and Tailwind CSS.

## Features

- 🏥 **Book Appointments**: Multi-step booking flow with service selection and time scheduling
- 👨‍⚕️ **Doctor Directory**: Browse and view doctors by specialty
- 📱 **Fully Responsive**: Mobile-first design that works on all devices
- 🔐 **User Authentication**: Login/Register with persistent sessions
- 📋 **Medical Records**: View your medical history and prescriptions
- 🔔 **Notifications**: Stay updated with appointment reminders and news
- 👤 **User Profile**: Manage personal and medical information
- 💊 **Consultation Requests**: Request medical consultations online

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Navigate to the project directory:
```bash
cd e:\HK5\J2ee\clinic-booking-app\interface
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit: `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx
│   ├── Banner.jsx
│   ├── DoctorCard.jsx
│   ├── DoctorList.jsx
│   ├── NewsSection.jsx
│   ├── Footer.jsx
│   ├── BookingModal.jsx
│   └── ConsultModal.jsx
├── pages/              # Page components
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Profile.jsx
│   ├── Notifications.jsx
│   └── MedicalRecords.jsx
├── context/            # Context API for state management
│   └── AppContext.jsx
├── data/               # Mock data
│   └── mockData.js
├── App.jsx             # Main app component
├── main.jsx            # App entry point
└── index.css           # Global styles
```

## Features Overview

### Booking Flow
1. **Step 1**: Enter personal information (auto-filled if logged in)
2. **Step 2**: Select or input medical service
3. **Step 3**: Choose date, time, and optionally a specific doctor

### User Authentication
- Mock authentication system (accepts any credentials for demo)
- Persistent login using localStorage
- Protected routes for authenticated users

### Mock Data
All data is completely mocked and stored in `src/data/mockData.js`:
- 8 doctors with different specialties
- 8 medical services
- 7 notifications (personal and global)
- 5 medical records with prescriptions
- Complete user profile with medical information

## Design System

### Colors
- **Primary**: Sky Blue (#0EA5E9)
- **Background**: Pure White (#FFFFFF)
- **Text**: Dark Slate (#334155, #1E293B)
- **Accents**: Various semantic colors

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- Generous whitespace and padding
- Rounded corners (`rounded-lg`, `rounded-xl`)
- Subtle shadows (`shadow-sm`, `shadow-md`)
- Smooth transitions on all interactive elements
- Hover states with scale and color changes

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Demo Credentials

For demo purposes, you can login with any email and password (minimum 6 characters).

Example:
- Email: `user@example.com`
- Password: `password123`

## Future Enhancements

- [ ] Real API integration
- [ ] Payment gateway integration
- [ ] Video consultation feature
- [ ] Prescription management
- [ ] Appointment history
- [ ] Reviews and ratings system
- [ ] Multi-language support

## License

This is a demo project for educational purposes.

## Author

Created as part of J2EE course project - HK5
