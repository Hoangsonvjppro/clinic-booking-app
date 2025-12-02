import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { doctorApplicationSchema } from '../../utils/validators';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { SPECIALTIES } from '../../utils/constants';
import {
  DocumentIcon,
  XMarkIcon,
  CloudArrowUpIcon,
} from '@heroicons/react/24/outline';

const DoctorApplicationForm = ({ onSubmit: onFormSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(doctorApplicationSchema),
  });

  const onDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      }));
      setUploadedFiles((prev) => [...prev, ...newFiles]);
      setValue('certificates', [...uploadedFiles, ...newFiles].map((f) => f.file));
    },
    [uploadedFiles, setValue]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    setValue('certificates', newFiles.map((f) => f.file));
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      
      // Append text fields
      Object.keys(data).forEach((key) => {
        if (key !== 'certificates') {
          formData.append(key, data[key]);
        }
      });

      // Append files
      uploadedFiles.forEach((fileObj) => {
        formData.append('certificates', fileObj.file);
      });

      await onFormSubmit(formData);
    } catch (error) {
      console.error('Application error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              {...register('fullName')}
              className={`input-field ${errors.fullName ? 'border-red-500' : ''}`}
              placeholder="Dr. John Doe"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              {...register('phone')}
              className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="+1 234 567 8900"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
        
        <div className="space-y-4">
          {/* Specialty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialty *
            </label>
            <select
              {...register('specialty')}
              className={`input-field ${errors.specialty ? 'border-red-500' : ''}`}
            >
              <option value="">Select specialty</option>
              {SPECIALTIES.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
            {errors.specialty && (
              <p className="mt-1 text-sm text-red-600">{errors.specialty.message}</p>
            )}
          </div>

          {/* License Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medical License Number *
            </label>
            <input
              type="text"
              {...register('licenseNumber')}
              className={`input-field ${errors.licenseNumber ? 'border-red-500' : ''}`}
              placeholder="ML-123456"
            />
            {errors.licenseNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.licenseNumber.message}</p>
            )}
          </div>

          {/* Years of Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience *
            </label>
            <input
              type="number"
              {...register('yearsOfExperience', { valueAsNumber: true })}
              className={`input-field ${errors.yearsOfExperience ? 'border-red-500' : ''}`}
              placeholder="10"
              min="0"
            />
            {errors.yearsOfExperience && (
              <p className="mt-1 text-sm text-red-600">{errors.yearsOfExperience.message}</p>
            )}
          </div>

          {/* Hospital/Clinic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Hospital/Clinic
            </label>
            <input
              type="text"
              {...register('hospital')}
              className="input-field"
              placeholder="City General Hospital"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <input
              type="text"
              {...register('address')}
              className={`input-field ${errors.address ? 'border-red-500' : ''}`}
              placeholder="123 Medical Center, City, State"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Professional Summary *
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className={`input-field ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Brief description of your experience and expertise..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Certificates Upload */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificates & Documents</h3>
        
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400'
          }`}
        >
          <input {...getInputProps()} />
          <CloudArrowUpIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          {isDragActive ? (
            <p className="text-primary-600">Drop the files here...</p>
          ) : (
            <>
              <p className="text-gray-600 mb-1">
                Drag & drop certificates here, or click to select
              </p>
              <p className="text-sm text-gray-500">PDF, PNG, JPG up to 5MB each</p>
            </>
          )}
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {uploadedFiles.map((fileObj, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <DocumentIcon className="w-6 h-6 text-primary-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{fileObj.name}</p>
                    <p className="text-xs text-gray-500">
                      {(fileObj.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {errors.certificates && (
          <p className="mt-2 text-sm text-red-600">{errors.certificates.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Submitting Application...' : 'Submit Application'}
        </button>
      </div>
    </form>
  );
};

export default DoctorApplicationForm;
