import { NavLink } from 'react-router-dom';
import {
  UserCircleIcon,
  LockClosedIcon,
  BellIcon,
  CreditCardIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const SettingsSidebar = () => {
  const menuItems = [
    {
      name: 'Personal Information',
      path: '/profile',
      icon: UserCircleIcon,
    },
    {
      name: 'Security',
      path: '/profile/security',
      icon: LockClosedIcon,
    },
    {
      name: 'Notifications',
      path: '/profile/notifications',
      icon: BellIcon,
    },
    {
      name: 'Payment Methods',
      path: '/profile/payments',
      icon: CreditCardIcon,
    },
    {
      name: 'Medical Records',
      path: '/medical-records',
      icon: DocumentTextIcon,
    },
    {
      name: 'Preferences',
      path: '/profile/preferences',
      icon: Cog6ToothIcon,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 px-2">Account Settings</h2>
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default SettingsSidebar;
