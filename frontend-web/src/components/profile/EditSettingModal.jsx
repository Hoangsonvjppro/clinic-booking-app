import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const EditSettingModal = ({ isOpen, onClose, onSubmit, field }) => {
  const [value, setValue] = useState(field?.value || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setValue(field?.value || '');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!value.trim()) {
      toast.error('Field cannot be empty');
      return;
    }

    try {
      setIsLoading(true);
      await onSubmit({ [field.name]: value });
      toast.success(`${field.label} updated successfully`);
      handleClose();
    } catch (error) {
      toast.error(error.message || `Failed to update ${field.label.toLowerCase()}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !field) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit {field.label}</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            
            {field.type === 'textarea' ? (
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={4}
                className="input-field"
                placeholder={field.placeholder}
              />
            ) : field.type === 'select' ? (
              <select
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="input-field"
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || 'text'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="input-field"
                placeholder={field.placeholder}
              />
            )}
            
            {field.description && (
              <p className="mt-2 text-sm text-gray-500">{field.description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSettingModal;
