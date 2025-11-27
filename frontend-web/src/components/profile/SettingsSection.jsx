import { PencilIcon } from '@heroicons/react/24/outline';

const SettingsSection = ({ title, description, children, onEdit, editLabel = 'Edit' }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
            <span className="text-sm font-medium">{editLabel}</span>
          </button>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
};

export default SettingsSection;
